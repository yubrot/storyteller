import type { Project } from './project';
import { SourceLocator, load as loadSource } from './source';
import * as fs from 'fs/promises';
import crypto from 'crypto';

export interface Workspace {
  projects: WorkspaceProject[];
}

export interface WorkspaceProject {
  id: string;
  source: SourceLocator;
  data: Project;
}

export async function load(sources: SourceLocator[], cache?: Workspace): Promise<Workspace> {
  const workspace: Workspace = { projects: [] };

  for (const source of sources) {
    const cachedProject = cache?.projects.find(p => p.source == source);
    const id = cachedProject?.id ?? crypto.randomBytes(8).toString('hex');
    const data = await loadSource(source, cachedProject?.data);
    workspace.projects.push({ id, source, data });
  }

  return workspace;
}

export async function loadWithCache(sources: SourceLocator[], path: string): Promise<Workspace> {
  let cache: Workspace | undefined;
  try {
    cache = JSON.parse(await fs.readFile(path, 'utf-8'));
  } catch {}

  const workspace = await load(sources, cache);

  try {
    await fs.writeFile(path, JSON.stringify(workspace), 'utf-8');
  } catch {}

  return workspace;
}

let workspaceCache: Promise<Workspace> | undefined;

export function workspace(): Promise<Workspace> {
  if (workspaceCache) return workspaceCache;
  workspaceCache = loadWithCache(process.env.SOURCES!.split(/,/), '.workspace.json');
  return workspaceCache;
}
