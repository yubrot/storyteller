import Svg from './Svg';

export const Default = () => {
  return (
    <div className="w-96">
      <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
        {(width, height) => (
          <text
            x={width / 2}
            y={height / 2}
            fill="white"
            fontSize={20}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {width} x {height}
          </text>
        )}
      </Svg>
    </div>
  );
};
