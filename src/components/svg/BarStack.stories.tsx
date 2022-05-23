import BarStack, { Direction } from './BarStack';
import Svg from './Svg';

function Story({ direction }: { direction: Direction }) {
  const data = [3, 5, 6, 8, 9].map(value => ({ value }));
  return (
    <div className="w-96 space-y-4">
      <Svg aspectRatio={[1, 1]} className="bg-gray-600 shadow-lg">
        {(width, height) => (
          <BarStack width={width} height={height} direction={direction} data={[]} />
        )}
      </Svg>
      <Svg aspectRatio={[1, 1]} className="bg-gray-600 shadow-lg">
        {(width, height) => (
          <BarStack
            width={width}
            height={height}
            direction={direction}
            data={data}
            props={({ value }) => ({ fill: `#${value}${value}${value}` })}
          />
        )}
      </Svg>
      <Svg aspectRatio={[1, 1]} className="bg-gray-600 shadow-lg">
        {(width, height) => (
          <BarStack
            width={width}
            height={height}
            direction={direction}
            data={data}
            bound={100}
            props={({ value }) => ({ fill: `#${value}${value}${value}` })}
          />
        )}
      </Svg>
    </div>
  );
}

export const Left = () => <Story direction="left" />;
export const Right = () => <Story direction="right" />;
export const Up = () => <Story direction="up" />;
export const Down = () => <Story direction="down" />;
