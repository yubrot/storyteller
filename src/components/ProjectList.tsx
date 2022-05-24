import { useMemo } from 'react';
import Link from 'next/link';
import type { Project } from '../project';
import type { WorkspaceProject } from '../workspace';
import type { SourceLocator } from '../source';
import { ProjectReader } from '../project-reader';
import ProjectProgressBar from './ProjectProgressBar';

export interface Props {
  projects: WorkspaceProject[];
  className?: string;
}

export default function ProjectList({ projects, className }: Props): React.ReactElement {
  return (
    <div className={`max-w-2xl mx-auto card divide-y ${className ?? ''}`}>
      {projects.map(({ id, source, data }) => (
        <ProjectListItem key={id} id={id} source={source} data={data} />
      ))}
    </div>
  );
}

interface ItemProps {
  id: string;
  source: SourceLocator;
  data: Project;
}

function ProjectListItem({ id, source, data }: ItemProps): React.ReactElement {
  const project = useMemo(() => new ProjectReader(data), [data]);

  return (
    <div key={id} className="p-3 space-y-1 border-gray-200">
      <div className="space-x-2 flex items-end text-emerald-800">
        <Link href={`/${id}`}>
          <a className="text-xl font-bold">{source}</a>
        </Link>

        {data.metadata.url && (
          <span className="text-sm">
            (<a href={data.metadata.url}>Source</a>)
          </span>
        )}
      </div>
      <ProjectProgressBar project={project} />
    </div>
  );
}
