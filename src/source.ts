import type { Project } from './project';

/**
 * A source of the project, see {@link load}.
 */
export type Source = SourceLocator | SourceLoader;

export type SourceLocator = string;

export interface SourceLoader {
  load(updatedAfter?: number): Promise<ProjectData>;
}

export type ProjectData = Omit<Project, 'lastUpdatedAt'>;

/**
 * Load a project from the source.
 * @param cache If available, only the difference is loaded.
 */
export async function load(source: Source, cache?: Project): Promise<Project> {
  if (typeof source == 'string') source = interpretLocator(source);
  const data = await source.load(cache?.lastUpdatedAt);
  return {
    lastUpdatedAt: Date.now(),
    metadata: data.metadata,
    tasks: { ...cache?.tasks, ...data.tasks },
    assignees: { ...cache?.assignees, ...data.assignees },
    labels: { ...cache?.labels, ...data.labels },
  };
}

const typeRegistry: { [type: string]: (query: string) => SourceLoader } = {};
const defaultType = 'github';

export function interpretLocator(locator: SourceLocator): SourceLoader {
  let [type, query] = locator.split(/:/, 2);
  if (!query) {
    query = type;
    type = defaultType;
  }

  const loader = typeRegistry[type.toLowerCase()];
  if (!loader) throw new Error(`Unknown source type: ${type}`);

  return loader(query);
}

export function registerType(type: string, loader: (query: string) => SourceLoader): void {
  if (type in typeRegistry) throw new Error(`Duplicate source type: ${type}`);
  typeRegistry[type] = loader;
}
