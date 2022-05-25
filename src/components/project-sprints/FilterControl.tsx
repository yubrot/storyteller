import { useMemo } from 'react';
import { ProjectReader } from '../../project-reader';
import { Filters } from './filters';
import { getSegmentColors } from './segments';

export interface Props {
  className?: string;
  project: ProjectReader;
  filters: Filters;
}

export default function FilterControl({ className, project, filters }: Props): React.ReactElement {
  const colors = useMemo(() => getSegmentColors(project), [project]);

  return (
    <div className={className}>
      <div className="border border-gray-300 rounded-md">
        <div className="text-sm font-bold text-gray-600 bg-gray-100 py-1 px-3 rounded-t-md">
          Filters
        </div>

        <div className="flex p-2">
          <Option
            color={colors.created}
            name="Created tasks"
            active={filters.created}
            onClick={() => filters.setCreated(!filters.created)}
          />
          <Option
            color={
              filters.completedGroup == 'by-assignee'
                ? colors.assignees
                : filters.completedGroup == 'by-label'
                ? colors.labels
                : colors.completedDefault
            }
            name="Completed tasks"
            active={filters.completed}
            onClick={() => filters.setCompleted(!filters.completed)}
          />
        </div>
      </div>

      {filters.completed ? (
        <div className="border border-gray-300 rounded-md mt-4">
          <div className="text-sm font-bold text-gray-600 bg-gray-100 py-1 px-3 rounded-t-md">
            Completed tasks grouping
          </div>

          <div className="p-2 flex">
            <Option
              color={colors.completedDefault}
              name="none"
              active={filters.completedGroup == 'none'}
              onClick={() => filters.setCompletedGroup('none')}
            />
            <Option
              color={colors.assignees}
              name="by assignee"
              active={filters.completedGroup == 'by-assignee'}
              onClick={() => filters.setCompletedGroup('by-assignee')}
            />
            <Option
              color={colors.labels}
              name="by label"
              active={filters.completedGroup == 'by-label'}
              onClick={() => filters.setCompletedGroup('by-label')}
            />
          </div>

          {filters.completedGroup != 'none' ? (
            <div className="border-t border-gray-200 p-2">
              {filters.completedGroup == 'by-assignee' ? (
                <div className="flex flex-wrap">
                  <Option
                    color={colors.void}
                    name="unassigned"
                    active={filters.unassigned}
                    onClick={() => filters.setUnassigned(!filters.unassigned)}
                  />
                  {project.assignees.map(({ id, name, color }) => (
                    <Option
                      key={id}
                      color={color}
                      name={name}
                      active={filters.assignee(id)}
                      onClick={() => filters.setAssignee(id, !filters.assignee(id))}
                    />
                  ))}
                </div>
              ) : null}

              {filters.completedGroup == 'by-label' ? (
                <div className="flex flex-wrap">
                  <Option
                    color={colors.void}
                    name="unlabeled"
                    active={filters.unlabeled}
                    onClick={() => filters.setUnlabeled(!filters.unlabeled)}
                  />
                  {project.labels.map(({ name, color }) => (
                    <Option
                      key={name}
                      color={color}
                      name={name}
                      active={filters.label(name)}
                      onClick={() => filters.setLabel(name, !filters.label(name))}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

interface OptionProps {
  color: string | string[];
  name: string;
  active?: boolean;
  onClick?(): void;
}

function Option({ color, name, active, onClick }: OptionProps) {
  const colors = Array.isArray(color) ? color : [color];
  return (
    <button
      className={`
        button rounded-lg flex items-center space-x-2 px-2 py-1 m-px
        text-sm ${active ? 'text-emerald-700' : 'text-gray-500'} hover:text-emerald-600
        border ${active ? 'border-emerald-300' : 'border-gray-300'} hover:border-emerald-500
        ${active ? 'bg-emerald-50' : 'bg-white'}
      `}
      onClick={onClick}
    >
      <svg className="w-4 h-4 border border-gray-300 rounded-md" viewBox="0 0 16 16">
        {colors.map((color, i) => (
          <rect
            key={i}
            y={(16 / colors.length) * i}
            width="16"
            height={16 / colors.length}
            fill={color}
          />
        ))}
      </svg>
      <div>{name}</div>
    </button>
  );
}
