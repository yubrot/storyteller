import Axis from './Axis';
import Line from './Line';
import Svg, { separateRect } from './Svg';

export const Default = () => {
  const horizontal = [
    { value: 0.3, text: 'At 0.3' },
    { value: 0.5, text: 'At 0.5' },
  ];
  const vertical = [
    { value: 0.2, text: 'At 0.2' },
    { value: 0.7, text: 'At 0.7' },
    { value: 0.9, text: 'At 0.9' },
  ];
  return (
    <div className="w-96 shadow-xl">
      <Svg aspectRatio={[4, 3]} className="bg-gray-600">
        {(width, height) => {
          const { center, left, bottom } = separateRect(width, height, [0.1, 0.9], [0.1, 0.9]);
          return (
            <>
              <Axis {...left} position="left" labels={horizontal} />
              <Axis {...bottom} position="bottom" labels={vertical} />
              {horizontal.map(({ value }) => (
                <Line key={value} {...center} value={value} mode="horizontal" />
              ))}
              {vertical.map(({ value }) => (
                <Line key={value} {...center} value={value} mode="vertical" />
              ))}
            </>
          );
        }}
      </Svg>
    </div>
  );
};
