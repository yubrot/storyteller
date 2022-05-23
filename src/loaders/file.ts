import { ProjectData, registerType, SourceLoader } from '../source';
import * as fs from 'fs/promises';

/**
 * See top-level README.md.
 */
export class FileLoader implements SourceLoader {
  constructor(readonly path: string) {}

  async load(_updatedAfter?: number): Promise<ProjectData> {
    return JSON.parse(await fs.readFile(this.path, 'utf-8'));
  }

  /**
   * Create a loader from a query string. See top-level README.md.
   */
  static fromQuery(q: string): FileLoader {
    return new FileLoader(q);
  }
}

if (typeof window === 'undefined') registerType('file', FileLoader.fromQuery);
