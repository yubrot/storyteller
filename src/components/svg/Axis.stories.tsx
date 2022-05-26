import Axis from './Axis';
import Svg, { separateRect } from './Svg';

export const NoLabels = () => (
  <div className="w-96">
    <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
      {(width, height) => {
        const { left, right, top, bottom } = separateRect(width, height, [0.2, 0.8], [0.2, 0.8]);
        return (
          <>
            <Axis {...left} position="left" labels={[]} />
            <Axis {...right} position="right" labels={[]} />
            <Axis {...top} position="top" labels={[]} />
            <Axis {...bottom} position="bottom" labels={[]} />
          </>
        );
      }}
    </Svg>
  </div>
);

export const WithLabels = () => {
  const labels = [
    { value: 0.2, text: 'At 0.2' },
    { value: 0.7, text: 'At 0.7' },
    { value: 0.9, text: 'At 0.9' },
  ];
  return (
    <div className="w-96 shadow-xl">
      <Svg aspectRatio={[4, 3]} className="bg-gray-600">
        {(width, height) => {
          const { left, right, top, bottom } = separateRect(width, height, [0.2, 0.8], [0.2, 0.8]);
          return (
            <>
              <Axis {...left} position="left" labels={labels} />
              <Axis {...right} position="right" labels={labels} />
              <Axis {...top} position="top" labels={labels} />
              <Axis {...bottom} position="bottom" labels={labels} />
            </>
          );
        }}
      </Svg>
    </div>
  );
};
