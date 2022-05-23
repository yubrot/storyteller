import Button from './Button';

export interface Props {
  x?: number;
  y?: number;
  width: number;
  height: number;
  text?: string | null;
  hasPrev?: boolean | null;
  onPrev?(): void;
  hasNext?: boolean | null;
  onNext?(): void;
}

export default function Title({
  x,
  y,
  width,
  height,
  text,
  hasPrev,
  onPrev,
  hasNext,
  onNext,
}: Props): React.ReactElement {
  return (
    <svg x={x} y={y}>
      {text ? (
        <text
          x={width / 2}
          y={height / 2}
          fontSize={14}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {text}
        </text>
      ) : null}
      {hasPrev ? (
        <Button
          center={[width / 5, height / 2]}
          width={40}
          height={40}
          rectProps={{ onClick: onPrev }}
          text="<<"
          textProps={{
            fontSize: 14,
            letterSpacing: -4,
            className: 'transition fill-teal-100 group-hover:fill-white',
          }}
        />
      ) : null}
      {hasNext ? (
        <Button
          center={[(width / 5) * 4, height / 2]}
          width={40}
          height={40}
          rectProps={{ onClick: onNext }}
          text=">>"
          textProps={{
            fontSize: 14,
            letterSpacing: -4,
            className: 'transition fill-teal-100 group-hover:fill-white',
          }}
        />
      ) : null}
    </svg>
  );
}
