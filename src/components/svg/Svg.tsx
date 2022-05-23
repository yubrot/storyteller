import { SVGProps, useEffect, useState } from 'react';

export type Props = {
  aspectRatio: [number, number];
  children(width: number, height: number, svg: SVGSVGElement): React.ReactNode;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'className'>;

export default function Svg({ aspectRatio: [ax, ay], children, className, ...svgProps }: Props) {
  const [[width, height, initialized], initialize] = useState([ax, ay, false as boolean] as const);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svg) return;
    const { width } = svg.getBoundingClientRect();
    initialize([width, Math.floor((width * ay) / ax), true]);
  }, [ax, ay, svg]);

  return (
    <svg
      ref={setSvg}
      className={`w-full box-content ${className ?? ''}`}
      viewBox={`0 0 ${width} ${height}`}
      {...svgProps}
    >
      {svg && initialized ? children(width, height, svg) : null}
    </svg>
  );
}
