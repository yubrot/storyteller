import { useMemo, useState } from 'react';
import type { SourceLocator } from '../source';
import type { Project } from '../project';
import { ProjectReader } from '../project-reader';
import ProjectProgressBar from './ProjectProgressBar';
import ProjectProgressChart from './ProjectProgressChart';

export interface Props {
  source: SourceLocator;
  data: Project;
  className?: string;
}

type Mode = 'progress';

export default function ProjectDetail({ source, data, className }: Props): React.ReactElement {
  const [mode, setMode] = useState<Mode>('progress');
  const project = useMemo(() => new ProjectReader(data), [data]);

  return (
    <div className={`max-w-6xl mx-auto px-2 ${className ?? ''} space-y-4`}>
      <div className="p-1 space-x-4 flex items-end">
        <div className="text-2xl text-emerald-900 font-bold">{source}</div>
        {project.metadata.url && (
          <span className="text-sm">
            <a href={project.metadata.url}>{project.metadata.url}</a>
          </span>
        )}
      </div>

      <div className="card p-2">
        <ProjectProgressBar className="m-4" project={project} />
      </div>

      <div className="card p-2">
        <div className="tab-bar">
          <button
            className="button tab-bar-item"
            disabled={mode == 'progress'}
            onClick={() => setMode('progress')}
          >
            Progress
          </button>
        </div>

        <div className="m-4">
          {mode == 'progress' ? <ProjectProgressChart project={project} /> : null}
        </div>
      </div>
    </div>
  );
}
