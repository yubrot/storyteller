import Link from 'next/link';
import { useState } from 'react';
import Img from './common/Img';
import { Workspace } from '../workspace';

export interface Props {
  workspace: Workspace;
  currentProject: string;
}

export default function Header({ workspace, currentProject }: Props) {
  const [showProjects, setShowProjects] = useState(false);
  const currentProjectSource = workspace.projects.find(p => p.id == currentProject)!.source;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-end p-2">
        <Link href="/">
          <a className="block border-b border-transparent hover:border-white">
            <Img src="logo-vertical.png" alt="storyteller" className="h-8 brightness-0 invert" />
          </a>
        </Link>

        <div className="relative">
          <button
            className={`button dropdown-entrypoint-${showProjects} font-bold text-white border-b border-transparent hover:border-white p-1`}
            onClick={() => setShowProjects(!showProjects)}
          >
            {currentProjectSource}
          </button>
          <div className={`dropdown-popover-${showProjects} card top-0 left-0 whitespace-nowrap`}>
            {workspace.projects.map(p => (
              <Link href={`/${p.id}`} key={p.id}>
                <a className="block m-1 p-2" onClick={() => setShowProjects(false)}>
                  {p.source}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
