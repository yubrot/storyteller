import { SVGProps, useMemo } from 'react';

export interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  direction: Direction;
  data: number[];
  range?: readonly [number, number];
  lineProps?: SVGProps<SVGPolylineElement>;
  gonProps?: SVGProps<SVGPolygonElement>;
  line?: boolean;
  gon?: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export default function LineChart({
  x,
  y,
  width,
  height,
  direction,
  data,
  range,
  lineProps,
  gonProps,
  line = true,
  gon = true,
}: Props) {
  const minValue = range ? range[0] : data.reduce((a, b) => Math.max(a, b), 0);
  const maxValue = range ? range[1] : 0;

  const f = useMemo(
    () => getFactors(direction, width, height, data.length),
    [direction, width, height, data.length]
  );

  const points = useMemo(() => {
    const line = data
      .map((value, i) => {
        const v = (value - minValue) / (maxValue - minValue);
        const x = Math.floor(f.ox + (i + 0.5) * f.nx + v * f.mx);
        const y = Math.floor(f.oy + (i + 0.5) * f.ny + v * f.my);
        return `${x},${y}`;
      })
      .join(' ');
    const p = minValue < maxValue ? 0 : 1;
    const sx = Math.floor(f.ox + 0.5 * f.nx + p * f.mx);
    const sy = Math.floor(f.oy + 0.5 * f.ny + p * f.my);
    const ex = Math.floor(f.ox + (data.length - 0.5) * f.nx + p * f.mx);
    const ey = Math.floor(f.oy + (data.length - 0.5) * f.ny + p * f.my);
    const gon = `${sx},${sy} ${line} ${ex},${ey}`;
    return { line, gon };
  }, [minValue, maxValue, data, f]);

  return (
    <svg x={x} y={y} overflow="visible">
      {gon ? <polygon points={points.gon} {...gonProps} /> : null}
      {line ? <polyline points={points.line} fill="none" {...lineProps} /> : null}
    </svg>
  );
}

function getFactors(direction: Direction, width: number, height: number, num: number) {
  const w = width / num;
  const h = height / num;
  switch (direction) {
    case 'up':
      return {
        nx: 0,
        ny: -h,
        mx: width,
        my: 0,
        ox: 0,
        oy: height,
      };
    case 'down':
      return {
        nx: 0,
        ny: h,
        mx: width,
        my: 0,
        ox: 0,
        oy: 0,
      };
    case 'left':
      return {
        nx: -w,
        ny: 0,
        mx: 0,
        my: height,
        ox: width,
        oy: 0,
      };
    case 'right':
      return {
        nx: w,
        ny: 0,
        mx: 0,
        my: height,
        ox: 0,
        oy: 0,
      };
    default:
      return direction; // never
  }
}
