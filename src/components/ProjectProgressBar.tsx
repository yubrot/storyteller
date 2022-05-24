import { interpolateBuGn as barColor } from 'd3-scale-chromatic';
import { useMemo } from 'react';
import Svg from './svg/Svg';
import BarStack from './svg/BarStack';
import Tooltip, { useTooltip } from './common/Tooltip';
import { dateTimeString } from '../date-time';
import { ProjectReader } from '../project-reader';

const day = 60 * 60 * 24 * 1000;
const recentDays = Number(process.env.NEXT_PUBLIC_RECENT_DAYS ?? '30');

export interface Props {
  project: ProjectReader;
  className?: string;
}

export default function ProjectProgressBar({ project, className }: Props): React.ReactElement {
  const { current, recent, data } = useMemo(() => {
    const now = Date.now();
    const current = {
      total: project.total.snapshot(now).storyPoints,
      completed: project.completed.snapshot(now).storyPoints,
    };
    const recent = {
      created: current.total - project.total.snapshot(now - recentDays * day).storyPoints,
      completed: current.completed - project.completed.snapshot(now - recentDays * day).storyPoints,
    };

    const completedData = [];
    const createdData = [];
    const total = project.total.snapshotChangesFrom(-Infinity);
    const completed = project.completed.snapshotChangesFrom(-Infinity);
    let completedOffset = current.completed;

    for (let d = recentDays; 0 <= d; --d) {
      const deltaCreated = total.to(now - d * day).storyPoints;
      const deltaCompleted = completed.to(now - d * day).storyPoints;
      const at = d == 0 ? '' : d == 1 ? ' a day ago' : ` ${d} days ago`;
      completedData.push({
        value: deltaCompleted,
        fill: barColor(0.9 - (d / recentDays) * 0.3),
        tooltip: `Completed ${completed.current.storyPoints} story points${at}`,
      });
      createdData.push({
        value: Math.max(deltaCreated - completedOffset, 0),
        fill: barColor(0.3 - (d / recentDays) * 0.2),
        tooltip: `Total ${total.current.storyPoints} story points${at}`,
      });
      completedOffset = Math.max(completedOffset - deltaCreated, 0);
    }

    return { current, recent, data: [...completedData, ...createdData] };
  }, [project]);

  const tooltip = useTooltip();

  return (
    <div className={`flex flex-col items-stretch ${className ?? ''}`}>
      <Tooltip handler={tooltip} />
      <div className="py-2">
        <Svg aspectRatio={[24, 1]} className="rounded-md shadow-md">
          {(width, height) => (
            <BarStack
              width={width}
              height={height}
              direction="right"
              data={data}
              props={({ fill, tooltip: text }) => ({
                fill,
                className: 'filter hover:brightness-200',
                onMouseOver: ev => tooltip.show(ev.currentTarget, text),
                onMouseOut: tooltip.clear,
              })}
            />
          )}
        </Svg>
      </div>

      <div className="text-right text-sm">
        <div>
          {current.completed}/{current.total} story points (
          {current.total == 0 ? 100 : Math.floor((current.completed / current.total) * 100)}
          %)
          {recent.created || recent.completed
            ? `, +${recent.completed}/${recent.created} in the last ${recentDays} days`
            : ''}
        </div>
        <div>Last updated at {dateTimeString(project.lastUpdatedAt)}</div>
      </div>
    </div>
  );
}
