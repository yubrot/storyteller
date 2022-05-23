import LineChart from './LineChart';
import Svg from './Svg';

export const Empty = () => (
  <div className="w-96">
    <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
      {(width, height) => <LineChart width={width} height={height} direction="right" data={[]} />}
    </Svg>
  </div>
);

export const Wave = () => {
  const data: number[] = [];
  for (let i = 0; i < 100; ++i) data.push(Math.sin((i * 0.03) ** 3));
  const ranges = [
    [-2, 2],
    [2, -2],
  ] as const;
  const directions = ['left', 'right', 'up', 'down'] as const;
  return (
    <div className="w-96 space-y-4">
      {directions.flatMap(direction =>
        ranges.map(range => (
          <Svg
            aspectRatio={[4, 3]}
            className="bg-gray-600 shadow-lg"
            key={`${direction}-${range[0]}-${range[1]}`}
          >
            {(width, height) => (
              <>
                <LineChart
                  x={width * 0.05}
                  y={height * 0.05}
                  width={width * 0.9}
                  height={height * 0.9}
                  direction={direction}
                  range={range}
                  data={data}
                  lineProps={{ strokeWidth: 2, stroke: 'white' }}
                  gonProps={{ fill: 'silver', opacity: 0.2 }}
                />
                <text
                  x={width / 2}
                  y={height * 0.1}
                  fill="white"
                  fontSize={14}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {direction}, {range[0]}..{range[1]}
                </text>
              </>
            )}
          </Svg>
        ))
      )}
    </div>
  );
};
