import Axis from './Axis';
import Svg from './Svg';

function rect(width: number, height: number) {
  const w1 = Math.floor(width / 8);
  const w2 = Math.floor((width / 8) * 7);
  const h1 = Math.floor(height / 8);
  const h2 = Math.floor((height / 8) * 7);
  return {
    left: {
      x: 0,
      y: h1,
      width: w1,
      height: h2 - h1,
      position: 'left',
    },
    right: {
      x: w2,
      y: h1,
      width: w1,
      height: h2 - h1,
      position: 'right',
    },
    top: {
      x: w1,
      y: 0,
      width: w2 - w1,
      height: h1,
      position: 'top',
    },
    bottom: {
      x: w1,
      y: h2,
      width: w2 - w1,
      height: h1,
      position: 'bottom',
    },
  } as const;
}

export const NoLabels = () => (
  <div className="w-96">
    <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
      {(width, height) => {
        const { left, right, top, bottom } = rect(width, height);
        return (
          <>
            <Axis {...left} labels={[]} />
            <Axis {...right} labels={[]} />
            <Axis {...top} labels={[]} />
            <Axis {...bottom} labels={[]} />
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
          const { left, right, top, bottom } = rect(width, height);
          return (
            <>
              <Axis {...left} labels={labels} />
              <Axis {...right} labels={labels} />
              <Axis {...top} labels={labels} />
              <Axis {...bottom} labels={labels} />
            </>
          );
        }}
      </Svg>
    </div>
  );
};
