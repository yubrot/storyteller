import { schemeSet3 as defaultColors } from 'd3-scale-chromatic';
import type {
  Project,
  ProjectMetadata,
  Task as RawTask,
  Assignee as RawAssignee,
  Label as RawLabel,
} from './project';
import { replay } from './time-series';

export type Task = RawTask & { storyPoint: number; storyPointDefaulted: boolean };
export type Assignee = RawAssignee & { color: string };
export type Label = RawLabel & { color: string };

const processDefaultStoryPoint = Number(process.env.NEXT_PUBLIC_DEFAULT_STORY_POINT ?? '1');

/**
 * A read model of a project. Responsible for computing and caching data for views.
 */
export class ProjectReader {
  readonly lastUpdatedAt: number;
  readonly metadata: ProjectMetadata;
  readonly tasks: { [id: string]: Task };
  readonly assignees: Assignee[];
  readonly labels: Label[];

  constructor(project: Project, defaultStoryPoint?: number) {
    defaultStoryPoint ??= processDefaultStoryPoint;
    this.lastUpdatedAt = project.lastUpdatedAt;
    this.metadata = project.metadata;

    this.tasks = {};
    for (const task of Object.values(project.tasks)) {
      this.tasks[task.id] = {
        ...task,
        storyPoint: task.storyPoint ?? defaultStoryPoint,
        storyPointDefaulted: typeof task.storyPoint != 'number',
      };
    }

    // FIXME: This is not good for projects where the number of assignees and labels is growing.
    // It might be better to generate colors from a hash computed by the id or the name.

    this.assignees = Object.values(project.assignees)
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((a, i) => ({ ...a, color: a.color ?? defaultColors[i % defaultColors.length] }));

    this.labels = Object.values(project.labels)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((l, i) => ({ ...l, color: l.color ?? defaultColors[i % defaultColors.length] }));
  }

  private cachedStartAt?: number;

  get startAt(): number {
    if (typeof this.cachedStartAt == 'number') return this.cachedStartAt;

    this.cachedStartAt = this.lastUpdatedAt;
    for (const task of Object.values(this.tasks)) {
      if (task.createdAt < this.cachedStartAt) this.cachedStartAt = task.createdAt;
    }
    return this.cachedStartAt;
  }

  private cachedEvents?: Event[]; // time series

  get events(): Event[] {
    if (this.cachedEvents) return this.cachedEvents;

    this.cachedEvents = [];
    for (const task of Object.values(this.tasks)) {
      this.cachedEvents.push({ at: task.createdAt, type: 'created', task });
      if (typeof task.completedAt == 'number') {
        this.cachedEvents.push({ at: task.completedAt, type: 'completed', task });
      }
    }
    this.cachedEvents.sort((a, b) => a.at - b.at);
    return this.cachedEvents;
  }

  private readonly cachedQueries: { [query: string]: Query } = {};

  query(options: QueryOptions): Query {
    const queryString = Query.queryString(options);
    if (queryString in this.cachedQueries) return this.cachedQueries[queryString];
    this.cachedQueries[queryString] = new Query(queryString, options, this.events);
    return this.cachedQueries[queryString];
  }

  cachedQuery(query: string): Query | null {
    return this.cachedQueries[query] ?? null;
  }

  private cachedTotalQuery?: Query;

  get total(): Query {
    if (!this.cachedTotalQuery) this.cachedTotalQuery = this.query({ type: 'created' });
    return this.cachedTotalQuery;
  }

  private cachedCompletedQuery?: Query;

  get completed(): Query {
    if (!this.cachedCompletedQuery) this.cachedCompletedQuery = this.query({ type: 'completed' });
    return this.cachedCompletedQuery;
  }
}

export interface QueryOptions {
  type?: Event['type'];
  assignee?: string | null;
  label?: string | null;
}

export class Query {
  readonly events: Event[]; // time series

  constructor(readonly string: string, readonly options: QueryOptions, events: Event[]) {
    this.events = events.filter(e => Query.matchesOption(options, e));
    this.factor = Query.storyPointFactor(options);
  }

  private readonly factor: (ev: Event) => number;
  private readonly snapshotCache: { at: number; value: Snapshot }[] = []; // time series

  snapshot(at: number): Snapshot {
    const i = replay(
      this.events,
      this.snapshotCache,
      at,
      at => ({
        at,
        value: snapshot.zero,
      }),
      ({ value }, events, at) => ({
        at,
        value: snapshot.add(value, snapshot.fromEvents(events, this.factor)),
      }),
      25
    );
    return this.snapshotCache[i].value;
  }

  snapshotChangesFrom(startAt: number): SnapshotChanges {
    const self = this;
    let current = self.snapshot(startAt);

    return {
      get current() {
        return current;
      },

      to(at) {
        const next = self.snapshot(at);
        const delta = snapshot.sub(next, current);
        current = next;
        return delta;
      },
    };
  }

  static queryString({ type, assignee, label }: QueryOptions): string {
    let s = [];
    if (type) s.push(`type:${type}`);
    if (assignee === null) s.push('unassigned');
    if (assignee) s.push(`assigned:${assignee}`);
    if (label === null) s.push('unlabeled');
    if (label) s.push(`labeled:${label}`);
    return s.join(',');
  }

  private static matchesOption({ type, assignee, label }: QueryOptions, event: Event): boolean {
    if (type && event.type != type) return false;
    if (assignee === null && event.task.assignees.length) return false;
    if (assignee && !event.task.assignees.find(a => a == assignee)) return false;
    if (label === null && event.task.labels.length) return false;
    if (label && !event.task.labels.find(l => l == label)) return false;
    return true;
  }

  private static storyPointFactor({ assignee, label }: QueryOptions): (ev: Event) => number {
    if (assignee && label) throw new Error('unsupported');
    if (assignee) return e => 1 / e.task.assignees.length;
    if (label) return e => 1 / e.task.labels.length;
    return _ => 1;
  }
}

export interface Event {
  at: number;
  type: 'created' | 'completed';
  task: Task;
}

export interface Snapshot {
  tasks: number;
  storyPoints: number;
  storyPointDefaultedTasks: number;
}

export const snapshot = {
  zero: {
    tasks: 0,
    storyPoints: 0,
    storyPointDefaultedTasks: 0,
  },

  add(a: Snapshot, b: Snapshot | null): Snapshot {
    if (!b) return a;
    return {
      tasks: a.tasks + b.tasks,
      storyPoints: a.storyPoints + b.storyPoints,
      storyPointDefaultedTasks: a.storyPointDefaultedTasks + b.storyPointDefaultedTasks,
    };
  },

  sub(a: Snapshot, b: Snapshot | null): Snapshot {
    if (!b) return a;
    return {
      tasks: a.tasks - b.tasks,
      storyPoints: a.storyPoints - b.storyPoints,
      storyPointDefaultedTasks: a.storyPointDefaultedTasks - b.storyPointDefaultedTasks,
    };
  },

  fromEvents(events: Event[], factor: (e: Event) => number = _ => 1): Snapshot | null {
    if (events.length == 0) return null;
    let tasks = 0;
    let storyPoints = 0;
    let storyPointDefaultedTasks = 0;
    for (const e of events) {
      const f = factor(e);
      tasks += f;
      storyPoints += e.task.storyPoint * f;
      if (e.task.storyPointDefaulted) storyPointDefaultedTasks += f;
    }
    return { tasks, storyPoints, storyPointDefaultedTasks };
  },
};

export interface SnapshotChanges {
  current: Snapshot;
  to(at: number): Snapshot;
}
