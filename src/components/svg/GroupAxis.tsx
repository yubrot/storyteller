import { useMemo } from 'react';
import * as Axis from './Axis';

export type Props = Omit<Axis.Props, 'labels' | 'range'> & { labels: string[] };

export default function GroupAxis({
  labels: groupLabels,
  ...axisProps
}: Props): React.ReactElement {
  const { width, height, position, fontSize } = axisProps;
  const labelNum = useMemo(
    () => Axis.recommendedLabelNum(width, height, position, fontSize),
    [width, height, position, fontSize]
  );

  const range = [0, groupLabels.length] as const;
  const labels = useMemo(() => {
    let labels = groupLabels.map((text, i) => ({ value: i + 0.5, text }));
    while (labelNum < labels.length) labels = labels.filter((_, i) => i % 2 == 1);
    return labels;
  }, [groupLabels, labelNum]);

  return <Axis.default {...axisProps} range={range} labels={labels} />;
}
