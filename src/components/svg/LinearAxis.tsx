import { useMemo } from 'react';
import * as Axis from './Axis';

export type Props = Omit<Axis.Props, 'labels' | 'range'> & { range: [number, number] };

export default function LinearAxis({
  range: [start, end],
  ...axisProps
}: Props): React.ReactElement {
  const { width, height, position, fontSize } = axisProps;
  const labelNum = useMemo(
    () => Axis.recommendedLabelNum(width, height, position, fontSize),
    [width, height, position, fontSize]
  );

  const labels = useMemo(() => {
    const range = Math.abs(end - start);
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    let step = 10 ** Math.floor(Math.log10(range) - 1);
    while (labelNum < range / step) step *= 5;

    const labels = [];
    for (let i = Math.ceil(min / step) * step; i <= max; i += step) {
      labels.push({ value: i, text: String(i) });
    }
    return labels;
  }, [start, end, labelNum]);

  return <Axis.default {...axisProps} range={[start, end]} labels={labels} />;
}
