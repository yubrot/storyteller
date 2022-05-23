import { useMemo } from 'react';

export interface Datum {
  key?: string | number;
  [_: string]: any; // to avoid no properties in common with type T error
}

export interface Props<T extends Datum> {
  x?: number;
  y?: number;
  width: number;
  height: number;
  direction: Direction;
  data: T[];
  children(
    datum: T,
    width: number,
    height: number,
    x: number,
    y: number,
    index: number
  ): React.ReactNode;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export default function Group<T extends Datum>({
  x,
  y,
  width,
  height,
  direction,
  data,
  children,
}: Props<T>) {
  const f = useMemo(
    () => getFactors(direction, width, height, data.length),
    [direction, width, height, data.length]
  );

  return (
    <svg x={x} y={y} overflow="visible">
      {data.map((datum, i) => {
        const sx = Math.floor(i * f.nx + f.mx);
        const sy = Math.floor(i * f.ny + f.my);
        const ex = Math.floor(i * f.nx + f.mx + f.w);
        const ey = Math.floor(i * f.ny + f.my + f.h);
        const x = Math.min(sx, ex);
        const y = Math.min(sy, ey);
        const w = Math.abs(ex - sx);
        const h = Math.abs(ey - sy);
        return (
          <svg key={datum.key ?? i} x={x} y={y} overflow="visible">
            {children(datum, w, h, x, y, i)}
          </svg>
        );
      })}
    </svg>
  );
}

function getFactors(direction: Direction, width: number, height: number, num: number) {
  switch (direction) {
    case 'up':
      return {
        w: width,
        h: -height / num,
        nx: 0,
        ny: -height / num,
        mx: 0,
        my: height,
      };
    case 'down':
      return {
        w: width,
        h: height / num,
        nx: 0,
        ny: height / num,
        mx: 0,
        my: 0,
      };
    case 'left':
      return {
        w: -width / num,
        h: height,
        nx: -width / num,
        ny: 0,
        mx: width,
        my: 0,
      };
    case 'right':
      return {
        w: width / num,
        h: height,
        nx: width / num,
        ny: 0,
        mx: 0,
        my: 0,
      };
    default:
      return direction; // never
  }
}
