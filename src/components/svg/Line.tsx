import Transition from './Transition';

export interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  value: number;
  mode?: Mode;
  transition?: boolean;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  range?: readonly [number, number];
}

export type Mode = 'vertical' | 'horizontal';

export default function Line({
  x = 0,
  y = 0,
  width,
  height,
  value,
  mode = 'horizontal',
  transition = true,
  stroke = 'white',
  strokeWidth = 1,
  strokeDasharray = '2 2',
  range: [start, end] = [0, 1],
}: Props): React.ReactElement {
  const n = start < end ? (value - start) / (end - start) : 1 - (value - end) / (start - end);
  const [nx, ny, mx, my] =
    mode == 'horizontal' ? [width, 0, 0, n * height] : [0, height, n * width, 0];
  const props = {
    x1: x + mx,
    y1: y + my,
    x2: x + nx + mx,
    y2: y + ny + my,
  };

  return (
    <line
      strokeWidth={strokeWidth}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      {...(transition ? {} : props)}
    >
      <Transition props={transition ? props : {}} />
    </line>
  );
}
