import { interpolateBuGn as barColor } from 'd3-scale-chromatic';
import { useMemo, useState } from 'react';
import Tooltip, { useTooltip } from './common/Tooltip';
import Svg, { separateRect } from './svg/Svg';
import LinearAxis from './svg/LinearAxis';
import GroupAxis from './svg/GroupAxis';
import LineChart from './svg/LineChart';
import Group from './svg/Group';
import Title from './svg/Title';
import { dateString, shortDateString } from '../date-time';
import { ProjectReader } from '../project-reader';

const day = 60 * 60 * 24 * 1000;
const year = day * 365;

export interface Props {
  project: ProjectReader;
  className?: string;
}

export default function ProjectProgressChart({ project, className }: Props): React.ReactElement {
  const { data, bound } = useMemo(() => {
    const now = Date.now();
    const step = Math.ceil((now - project.startAt) / year) * day;
    const data = [];

    for (let t = Math.floor((project.startAt - 1) / step) * step; t <= now; t += step) {
      const date = dateString(t);
      const shortDate = shortDateString(t);
      const total = project.total.snapshot(t).storyPoints;
      const completed = project.completed.snapshot(t).storyPoints;
      const percentage = total == 0 ? 100 : Math.floor((100 * completed) / total);
      const tooltip = `${date}: ${completed}/${total} story points (${percentage}%)`;
      data.push({ date, shortDate, total, completed, tooltip });
    }

    const bound = data.reduce((a, b) => Math.max(a, b.total), 0);
    return { data, bound };
  }, [project]);

  const tooltip = useTooltip();
  const [focusLine, setFocusLine] = useState<number | null>(null);

  const [totalGradId] = useState(() => `g${Math.random()}`);
  const [completedGradId] = useState(() => `g${Math.random()}`);

  if (data.length == 0) return <div className={className} />;

  return (
    <div className={className}>
      <Tooltip handler={tooltip} />
      <Svg
        aspectRatio={[2, 1]}
        className="bg-gradient-to-b from-slate-500 to-slate-700 rounded-md shadow-lg"
      >
        {(w, h) => {
          const { center, top, left, bottom } = separateRect(w, h, [0.07, 0.93], [0.17, 0.87]);
          return (
            <>
              <defs>
                <linearGradient id={totalGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0" stopColor={barColor(0.15)} stopOpacity="0.5" />
                  <stop offset="1" stopColor={barColor(0.55)} stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id={completedGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0" stopColor={barColor(0.65)} stopOpacity="0.5" />
                  <stop offset="1" stopColor={barColor(0.85)} stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <Title {...top} text={`${data[0].date} - ${data[data.length - 1].date}`} />
              <LineChart
                {...center}
                direction="right"
                range={[bound, 0]}
                data={data.map(d => d.total)}
                lineProps={{ stroke: barColor(0.2), className: 'line-chart-line' }}
                gonProps={{ fill: `url(#${totalGradId})`, className: 'line-chart-gon' }}
              />
              <LineChart
                {...center}
                direction="right"
                range={[bound, 0]}
                data={data.map(d => d.completed)}
                lineProps={{ stroke: barColor(0.5), className: 'line-chart-line' }}
                gonProps={{ fill: `url(#${completedGradId})`, className: 'line-chart-gon' }}
              />
              <LinearAxis {...left} position="left" range={[bound, 0]} />
              <GroupAxis {...bottom} position="bottom" labels={data.map(d => d.shortDate)} />
              <Group {...center} direction="right" data={data}>
                {({ tooltip: text }, width, height, x) => (
                  <rect
                    width={width}
                    height={height}
                    fill="transparent"
                    onMouseOver={ev => {
                      setFocusLine(x + width / 2);
                      tooltip.show(ev.currentTarget, text);
                    }}
                  />
                )}
              </Group>
              {focusLine !== null ? (
                <line
                  x1={focusLine + center.x}
                  y1={center.y}
                  x2={focusLine + center.x}
                  y2={center.y + center.height}
                  strokeWidth={1}
                  stroke="white"
                  strokeDasharray="2 2"
                />
              ) : null}
            </>
          );
        }}
      </Svg>
    </div>
  );
}
