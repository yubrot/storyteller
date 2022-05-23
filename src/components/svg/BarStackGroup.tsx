import { SVGProps, useMemo } from 'react';
import * as BarStack from './BarStack';
import Group, { Datum as GroupDatum, Direction } from './Group';
import Transition from './Transition';

export type Row<T> = { data: T[] } & GroupDatum;

export function defaultBound<T extends BarStack.Datum>(data: Row<T>[]): number {
  return data.reduce((a, b) => Math.max(a, BarStack.defaultBound(b.data)), 0);
}

export interface Props<T extends BarStack.Datum> {
  x?: number;
  y?: number;
  width: number;
  height: number;
  direction: Direction;
  barDirection: BarStack.Direction;
  barWidth?: number; // [0,1]
  data: Row<T>[];
  bound?: number;
  props?(datum: T): SVGProps<SVGRectElement>;
}

export default function BarStackGroup<T extends BarStack.Datum>({
  x,
  y,
  width,
  height,
  direction,
  barDirection,
  barWidth = 0.6,
  data,
  bound,
  props,
}: Props<T>) {
  const maxValue = bound ?? defaultBound(data);

  const { sx, sy } = useMemo(() => {
    switch (barDirection) {
      case 'up':
      case 'down':
        return { sx: barWidth, sy: 1 };
      case 'left':
      case 'right':
        return { sx: 1, sy: barWidth };
      default:
        return barDirection;
    }
  }, [barDirection, barWidth]);

  return (
    <Group x={x} y={y} width={width} height={height} direction={direction} data={data}>
      {(row, width, height, x, y) => (
        <>
          <Transition props={{ x, y }} />
          <BarStack.default
            x={Math.floor((width * (1 - sx)) / 2)}
            y={Math.floor((height * (1 - sy)) / 2)}
            width={Math.floor(width * sx)}
            height={Math.floor(height * sy)}
            direction={barDirection}
            data={row.data}
            bound={maxValue}
            props={props}
          />
        </>
      )}
    </Group>
  );
}
