import { useMemo, useState } from 'react';
import LinearAxis from './svg/LinearAxis';
import GroupAxis from './svg/GroupAxis';
import BarStackGroup from './svg/BarStackGroup';
import Svg, { separateRect } from './svg/Svg';
import Title from './svg/Title';
import Line from './svg/Line';
import Axis from './svg/Axis';
import { useTooltip } from './common/tooltip';
import { useFilters } from './project-sprints/filters';
import { useSegments } from './project-sprints/segments';
import FilterControl from './project-sprints/FilterControl';
import Activities from './project-sprints/Activities';
import { dateString, shortDateString } from '../date-time';
import { ProjectReader } from '../project-reader';

const sprintDays = Number(process.env.NEXT_PUBLIC_SPRINT_DAYS ?? '14') * 60 * 60 * 24 * 1000;

export interface Props {
  project: ProjectReader;
  className?: string;
}

export default function ProjectSprints({ project, className }: Props): React.ReactElement {
  const numSprints = useMemo(
    () => Math.ceil((Date.now() - project.startAt - 1) / sprintDays),
    [project]
  );
  const [end, setEnd] = useState(numSprints);
  const start = Math.max(end - 8, 0);
  const filters = useFilters();

  // Compute sprints from [project, start, end, filters]
  const segments = useSegments(project, filters);
  const { sprints, bound } = useMemo(() => {
    let bound = 0;
    const sprints = [];

    const graphStartAt = project.startAt - 1 + start * sprintDays;
    const total = project.total.snapshotChangesFrom(graphStartAt);
    const completed = project.completed.snapshotChangesFrom(graphStartAt);
    const stack = segments.sources.map(segment =>
      segment.active ? segment.query.snapshotChangesFrom(graphStartAt) : null
    );

    for (let i = start; i < end; ++i) {
      const sprintStartAt = project.startAt - 1 + i * sprintDays;
      const sprintEndAt = sprintStartAt + sprintDays;
      bound = Math.max(
        bound,
        total.to(sprintEndAt).storyPoints + completed.to(sprintEndAt).storyPoints
      );

      sprints.push({
        key: sprintStartAt,
        data: segments.sources.map(({ query, color, tooltipText }, i) => ({
          key: query.string,
          value: stack[i]?.to(sprintEndAt).storyPoints ?? 0,
          color,
          tooltipText,
          start: sprintStartAt,
          end: sprintEndAt,
        })),
      });
    }

    return { sprints, bound };
  }, [project, start, end, segments]);

  const averages = useMemo(() => {
    let offset = 0;
    return segments.sources.map(({ active, labelText }, i) => {
      if (!active || !labelText) return null;
      const value = sprints.reduce((a, b) => a + b.data[i].value, 0) / sprints.length;
      if (!value) return null;

      offset += value;
      const shortLabelText = `${labelText.substring(0, 11)}${11 < labelText.length ? '..' : ''}`;
      return {
        key: labelText,
        value: offset,
        text: `${shortLabelText}: ${Math.floor(value * 100) / 100}`,
      };
    });
  }, [sprints, segments]);

  const tooltip = useTooltip();
  const [select, setSelect] = useState<{ query: string; start: number; end: number } | null>(null);

  return (
    <div className={`flex items-stretch space-x-6 ${className ?? ''}`}>
      <tooltip.Container />
      <div className="flex-1">
        <Svg
          aspectRatio={[4, 3]}
          className="bg-gradient-to-b from-slate-500 to-slate-700 rounded-md shadow-lg"
        >
          {(w, h) => {
            const { center, top, left, right, bottom } = separateRect(
              w,
              h,
              [0.08, 0.8],
              [0.2, 0.9]
            );
            return (
              <>
                <segments.Defs />
                <Title
                  {...top}
                  text={
                    sprints.length
                      ? dateString(sprints[0].key) +
                        ' - ' +
                        dateString(sprints[sprints.length - 1].key)
                      : null
                  }
                  hasPrev={1 < end}
                  onPrev={() => setEnd(end - 1)}
                  hasNext={end < numSprints}
                  onNext={() => setEnd(end + 1)}
                />
                <LinearAxis {...left} position="left" range={[bound, 0]} />
                <GroupAxis
                  {...bottom}
                  position="bottom"
                  labels={sprints.map(sprint => shortDateString(sprint.key))}
                />
                <BarStackGroup
                  {...center}
                  direction="right"
                  barDirection="up"
                  data={sprints}
                  bound={bound}
                  props={({ key, value, color, tooltipText, start, end }) => {
                    const isSelected =
                      select && select.query == key && select.start == start && select.end == end;
                    return {
                      fill: color,
                      className: `filter ${isSelected ? 'brightness-150' : 'hover:brightness-150'}`,
                      onMouseOver: ev => tooltip.show(ev.currentTarget, tooltipText(value)),
                      onMouseOut: tooltip.clear,
                      onClick: () => setSelect({ query: key, start, end }),
                    };
                  }}
                />
                <Axis
                  {...right}
                  position="right"
                  axisStroke={false}
                  range={[bound, 0]}
                  labels={averages.flatMap(a => (a ? [a] : []))}
                />
                {averages.map(a =>
                  a ? <Line key={a.key} {...center} value={a.value} range={[bound, 0]} /> : null
                )}
              </>
            );
          }}
        </Svg>
      </div>

      <div className="w-96 shrink-0">
        <FilterControl className="my-4" project={project} filters={filters} />

        {select ? (
          <div className="border border-gray-300 rounded-md mt-4">
            <div className="text-sm font-bold text-gray-600 bg-gray-100 py-1 px-3 rounded-t-md">
              Activities ({shortDateString(select.start)} - {shortDateString(select.end)})
            </div>

            <Activities className="max-h-96 overflow-auto m-2" project={project} {...select} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
