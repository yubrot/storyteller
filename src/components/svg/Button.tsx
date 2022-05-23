import type { SVGProps } from 'react';

export interface Props {
  center: [number, number];
  width: number;
  height: number;
  rectProps?: SVGProps<SVGRectElement>;
  text?: string;
  textProps?: SVGProps<SVGTextElement>;
  children?: React.ReactNode;
}

export default function Button({
  center: [x, y],
  width,
  height,
  rectProps,
  text,
  textProps,
  children,
}: Props): React.ReactElement {
  return (
    <svg x={x} y={y} overflow="visible" className="group button">
      <rect
        fill="transparent"
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        {...rectProps}
      />
      {text ? (
        <text textAnchor="middle" dominantBaseline="central" pointerEvents="none" {...textProps}>
          {text}
        </text>
      ) : null}
      {children}
    </svg>
  );
}
