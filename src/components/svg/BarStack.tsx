import { SVGProps, useEffect, useMemo, useRef } from 'react';
import Transition from './Transition';

export interface Datum {
  key?: string | number;
  value: number;
}

export function defaultBound<T extends Datum>(data: T[]): number {
  return data.reduce((a, b) => a + b.value, 0);
}

export interface Props<T extends Datum> {
  x?: number;
  y?: number;
  width: number;
  height: number;
  direction: Direction;
  data: T[];
  bound?: number;
  props?(datum: T): BarItemProps | undefined;
}

export type Direction = 'up' | 'down' | 'right' | 'left';

export type BarItemProps = Omit<
  SVGProps<SVGRectElement>,
  'children' | 'x' | 'y' | 'width' | 'height'
>;

const rectTransparent = { 'fill-opacity': 0 };
const rectVisible = { 'fill-opacity': 1 };

export default function BarStack<T extends Datum>({
  x,
  y,
  width,
  height,
  direction,
  data,
  bound,
  props,
}: Props<T>) {
  const maxValue = bound ?? defaultBound(data);
  const f = useMemo(
    () => getFactors(direction, width, height, maxValue),
    [direction, width, height, maxValue]
  );

  let s = 0;
  const initialRect = {
    x: Math.min(f.sx, f.ex),
    y: Math.min(f.sy, f.ey),
    width: Math.abs(f.ex - f.sx),
    height: Math.abs(f.ey - f.sy),
  };

  return (
    <svg x={x} y={y}>
      {data.map((datum, i) => {
        const e = s + datum.value;
        const sx = f.sx + Math.floor(f.nx * s);
        const sy = f.sy + Math.floor(f.ny * s);
        const ex = f.ex + Math.floor(f.nx * e);
        const ey = f.ey + Math.floor(f.ny * e);
        const rect = {
          x: Math.min(sx, ex),
          y: Math.min(sy, ey),
          width: Math.abs(ex - sx),
          height: Math.abs(ey - sy),
        };
        s = e;
        return (
          <BarRect key={datum.key ?? i} {...props?.(datum)} initialRect={initialRect} rect={rect} />
        );
      })}
    </svg>
  );
}

type BarRectProps = BarItemProps & {
  rect: { x: number; y: number; width: number; height: number };
  initialRect: { x: number; y: number; width: number; height: number };
};

function BarRect({ initialRect, rect, ...props }: BarRectProps) {
  // Avoid unnecessary rect and transitions to improve performance
  const visibleRef = useRef<boolean>(initialRect.width != 0 && initialRect.height != 0);
  useEffect(() => {
    visibleRef.current = rect.width != 0 && rect.height != 0;
  }, [rect.width, rect.height]);
  const visible = (rect.width != 0 && rect.height != 0) || visibleRef.current;

  return visible ? (
    <rect {...props}>
      <Transition initialProps={rectTransparent} props={rectVisible} dur="500ms" />
      <Transition initialProps={initialRect} props={rect} />
    </rect>
  ) : null;
}

function getFactors(direction: Direction, width: number, height: number, maxValue: number) {
  if (maxValue == 0) maxValue = 1;
  switch (direction) {
    case 'up':
      return {
        sx: 0,
        sy: height,
        ex: width,
        ey: height,
        nx: 0,
        ny: -height / maxValue,
      };
    case 'down':
      return {
        sx: 0,
        sy: 0,
        ex: width,
        ey: 0,
        nx: 0,
        ny: height / maxValue,
      };
    case 'right':
      return {
        sx: 0,
        sy: 0,
        ex: 0,
        ey: height,
        nx: width / maxValue,
        ny: 0,
      };
    case 'left':
      return {
        sx: width,
        sy: 0,
        ex: width,
        ey: height,
        nx: -width / maxValue,
        ny: 0,
      };
    default:
      return direction; // never
  }
}
