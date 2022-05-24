import { SVGProps, useEffect, useState } from 'react';

export function separateRect(w: number, h: number, x: [number, number], y: [number, number]) {
  const l = Math.floor(w * x[0]);
  const r = Math.floor(w * x[1]);
  const t = Math.floor(h * y[0]);
  const b = Math.floor(h * y[1]);
  return {
    center: { x: l, y: t, width: r - l, height: b - t },
    top: { x: l, y: 0, width: r - l, height: t },
    bottom: { x: l, y: b, width: r - l, height: h - b },
    left: { x: 0, y: t, width: l, height: b - t },
    right: { x: r, y: t, width: w - r, height: b - t },
  };
}

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
