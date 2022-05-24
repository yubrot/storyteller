import { describe, test, expect } from 'vitest';
import type { Task as RawTask } from './project';
import { ProjectReader, snapshot } from './project-reader';

function task(
  id: string,
  title: string,
  createdAt: number,
  completedAt: number | null,
  storyPoint: number | null
): RawTask {
  return {
    id,
    title,
    createdAt,
    completedAt,
    storyPoint,
    assignees: [],
    labels: [],
  };
}

const project = new ProjectReader(
  {
    lastUpdatedAt: 100,
    metadata: {},
    assignees: {},
    tasks: {
      '1': task('1', '1st', 5, 10, 2),
      '2': task('2', '2nd', 5, 20, 3),
      '3': task('3', '3rd', 5, 80, 1),
      '4': task('4', '4th', 20, 40, 2),
      '5': task('5', '5th', 40, 80, 2),
      '6': task('6', '6th', 45, 80, null),
      '7': task('7', '7th', 80, null, 1),
      '8': task('8', '8th', 100, null, 2),
    },
    labels: {},
  },
  1
);

describe('ProjectReader', () => {
  test('startAt', () => {
    expect(project.startAt).toEqual(5);
  });

  test('events', () => {
    const events = project.events;
    expect(events.map(e => e.at)).toEqual([5, 5, 5, 10, 20, 20, 40, 40, 45, 80, 80, 80, 80, 100]);
    expect(events.filter(e => e.type == 'created').map(e => e.at)).toEqual([
      5, 5, 5, 20, 40, 45, 80, 100,
    ]);
    expect(events.filter(e => e.type == 'completed').map(e => e.at)).toEqual([
      10, 20, 40, 80, 80, 80,
    ]);
    expect(
      events
        .filter(e => e.at == 80)
        .map(e => e.task.id)
        .sort()
    ).toEqual('3 5 6 7'.split(/ /));
  });

  test('total', () => {
    expect(project.total.snapshot(0)).toEqual({
      tasks: 0,
      storyPoints: 0,
      storyPointDefaultedTasks: 0,
    });
    expect(project.total.snapshot(20)).toEqual({
      tasks: 4,
      storyPoints: 8,
      storyPointDefaultedTasks: 0,
    });
    expect(project.total.snapshot(40)).toEqual({
      tasks: 5,
      storyPoints: 10,
      storyPointDefaultedTasks: 0,
    });
    expect(project.total.snapshot(60)).toEqual({
      tasks: 6,
      storyPoints: 11,
      storyPointDefaultedTasks: 1,
    });
    expect(project.total.snapshot(80)).toEqual({
      tasks: 7,
      storyPoints: 12,
      storyPointDefaultedTasks: 1,
    });
    expect(project.total.snapshot(100)).toEqual({
      tasks: 8,
      storyPoints: 14,
      storyPointDefaultedTasks: 1,
    });
    expect(project.total.snapshotChangesFrom(80).to(100)).toEqual({
      tasks: 1,
      storyPoints: 2,
      storyPointDefaultedTasks: 0,
    });
  });

  test('completed', () => {
    expect(project.completed.snapshot(0)).toEqual({
      tasks: 0,
      storyPoints: 0,
      storyPointDefaultedTasks: 0,
    });
    expect(project.completed.snapshot(20)).toEqual({
      tasks: 2,
      storyPoints: 5,
      storyPointDefaultedTasks: 0,
    });
    expect(project.completed.snapshot(40)).toEqual({
      tasks: 3,
      storyPoints: 7,
      storyPointDefaultedTasks: 0,
    });
    expect(project.completed.snapshot(60)).toEqual({
      tasks: 3,
      storyPoints: 7,
      storyPointDefaultedTasks: 0,
    });
    expect(project.completed.snapshot(80)).toEqual({
      tasks: 6,
      storyPoints: 11,
      storyPointDefaultedTasks: 1,
    });
    expect(project.completed.snapshot(100)).toEqual({
      tasks: 6,
      storyPoints: 11,
      storyPointDefaultedTasks: 1,
    });
    expect(project.completed.snapshotChangesFrom(20).to(40)).toEqual({
      tasks: 1,
      storyPoints: 2,
      storyPointDefaultedTasks: 0,
    });
  });
});

describe('snapshot', () => {
  test('add', () => {
    expect(
      snapshot.add(
        { tasks: 2, storyPoints: 5, storyPointDefaultedTasks: 0 },
        { tasks: 3, storyPoints: 3, storyPointDefaultedTasks: 1 }
      )
    ).toEqual({ tasks: 5, storyPoints: 8, storyPointDefaultedTasks: 1 });
  });

  test('sub', () => {
    expect(
      snapshot.sub(
        { tasks: 13, storyPoints: 17, storyPointDefaultedTasks: 2 },
        { tasks: 10, storyPoints: 12, storyPointDefaultedTasks: 1 }
      )
    ).toEqual({ tasks: 3, storyPoints: 5, storyPointDefaultedTasks: 1 });
  });

  test('fromEvents', () => {
    expect(snapshot.fromEvents(project.events.filter(e => e.type == 'created'))).toEqual({
      tasks: 8,
      storyPoints: 14,
      storyPointDefaultedTasks: 1,
    });
  });
});
