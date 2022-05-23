import { Fragment, useMemo } from 'react';
import Transition from './Transition';

const defaultFontSize = 11;

export interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  position: Position;
  textColor?: string;
  strokeColor?: string;
  fontSize?: number;
  axisStroke?: boolean;
  labelStroke?: boolean;
  labels: Label[];
  range?: readonly [number, number];
}

export interface Label {
  value: number; // [0,1], top to bottom or left to right
  text: string;
}

export type Position = 'top' | 'bottom' | 'left' | 'right';

export function recommendedLabelNum(
  width: number,
  height: number,
  position: Position,
  fontSize: number = defaultFontSize
): number {
  if (width <= 0 || height <= 0) return 0;
  switch (position) {
    case 'top':
    case 'bottom':
      return Math.floor(width / fontSize / 4);
    case 'left':
    case 'right':
      return Math.floor(height / fontSize / 2);
    default:
      return position; // never
  }
}

export default function Axis({
  x,
  y,
  width,
  height,
  position,
  textColor = 'white',
  strokeColor = 'silver',
  fontSize = defaultFontSize,
  axisStroke = true,
  labelStroke = true,
  labels,
  range: [start, end] = [0, 1],
}: Props): React.ReactElement {
  const f = useMemo(() => getFactors(width, height, position), [width, height, position]);

  return (
    <svg x={x} y={y} overflow="visible">
      {axisStroke ? (
        <line
          x1={f.mx + 0.5}
          y1={f.my + 0.5}
          x2={f.nx * width + f.mx + 0.5}
          y2={f.ny * height + f.my + 0.5}
          stroke={strokeColor}
          strokeWidth={1}
        />
      ) : null}
      {labels.map(({ value, text }) => {
        const p = start < end ? (value - start) / (end - start) : 1 - (value - end) / (start - end);
        const mx = Math.floor(p * f.nx * width + f.mx);
        const my = Math.floor(p * f.ny * height + f.my);
        return (
          <Fragment key={text}>
            <text
              fontSize={fontSize}
              fill={textColor}
              textAnchor={f.textAnchor}
              dominantBaseline={f.dominantBaseline}
            >
              <Transition props={{ x: mx + f.lx * 5, y: my + f.ly * 5 }} />
              {text}
            </text>
            {labelStroke ? (
              <line stroke={strokeColor} strokeWidth={1}>
                <Transition
                  props={{
                    x1: mx + 0.5,
                    y1: my + 0.5,
                    x2: mx + f.lx * 4 + 0.5,
                    y2: my + f.ly * 4 + 0.5,
                  }}
                />
              </line>
            ) : null}
          </Fragment>
        );
      })}
    </svg>
  );
}

function getFactors(w: number, h: number, position: Position) {
  const offset = 2;
  switch (position) {
    case 'bottom':
      return {
        nx: 1,
        ny: 0,
        mx: 0,
        my: 0,
        lx: 0,
        ly: offset,
        textAnchor: 'middle',
        dominantBaseline: 'hanging',
      };
    case 'top':
      return {
        nx: 1,
        ny: 0,
        mx: 0,
        my: h,
        lx: 0,
        ly: -offset,
        textAnchor: 'middle',
        dominantBaseline: 'before-edge',
      };
    case 'right':
      return {
        nx: 0,
        ny: 1,
        mx: 0,
        my: 0,
        lx: offset,
        ly: 0,
        textAnchor: 'start',
        dominantBaseline: 'central',
      };
    case 'left':
      return {
        nx: 0,
        ny: 1,
        mx: w,
        my: 0,
        lx: -offset,
        ly: 0,
        textAnchor: 'end',
        dominantBaseline: 'central',
      };
    default:
      return position; // never
  }
}
