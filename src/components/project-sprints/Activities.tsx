import { useMemo } from 'react';
import { interpolateMagma as storyPointColor } from 'd3-scale-chromatic';
import { dateTimeString } from '../../date-time';
import { ProjectReader } from '../../project-reader';

export interface Props {
  className?: string;
  project: ProjectReader;
  query: string;
  start: number;
  end: number;
}

export default function Activities({
  className,
  project,
  query,
  start,
  end,
}: Props): React.ReactElement {
  const events = useMemo(
    () => project.cachedQuery(query)?.events.filter(e => start < e.at && e.at <= end),
    [project, query, start, end]
  );

  return (
    <div className={`divide-y divide-gray-200 ${className ?? ''}`}>
      {events?.map(({ at, type, task }) => {
        const color = storyPointColor(Math.min(0.2 + task.storyPoint * 0.07, 0.8));
        return (
          <div key={`${type}-${task.id}`} className="py-2 pl-1 pr-2">
            <div className="flex items-center space-x-2">
              <div
                style={{ background: color }}
                className={`
                w-8 h-8 text-white text-xs font-bold inline-flex justify-center items-center rounded-full
                border-4 ${task.completedAt ? 'border-emerald-400' : 'border-gray-200'}
              `}
              >
                {task.storyPoint}
              </div>

              <div className="flex-1">
                <a href={task.url ?? '#'} className="text-sm flex-1">
                  {task.title}
                </a>

                {project.assignees
                  .filter(a => task.assignees.find(a2 => a2 == a.id))
                  .map(({ id, url, color, avatarUrl }) => (
                    <a key={id} href={url ?? '#'} className="float-right block ml-1">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="icon" className="w-5 h-5 rounded-full" />
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ background: color }}
                        />
                      )}
                    </a>
                  ))}

                {project.labels
                  .filter(l => task.labels.find(l2 => l2 == l.name))
                  .map(({ name, color }) => (
                    <div
                      key={name}
                      style={{ borderColor: color }}
                      className="float-right border-l-4 text-xs whitespace-nowrap font-bold px-1 ml-1"
                    >
                      {name}
                    </div>
                  ))}
              </div>
            </div>

            <div className="clear-both text-xs text-gray-500 text-right mt-1">
              {type} at {dateTimeString(at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
