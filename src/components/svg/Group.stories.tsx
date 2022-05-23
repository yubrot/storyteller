import Group, { Direction } from './Group';
import Svg from './Svg';

function Story({ direction }: { direction: Direction }) {
  const data = [
    [],
    ['#eee'].map(color => ({ color })),
    ['#eee', '#ddd', '#ccc', '#bbb'].map(color => ({ color })),
  ];
  return (
    <div className="w-96 space-y-4">
      {data.map((data, i) => (
        <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg" key={i}>
          {(width, height) => (
            <Group width={width} height={height} direction={direction} data={data}>
              {({ color }, width, height) => <rect width={width} height={height} fill={color} />}
            </Group>
          )}
        </Svg>
      ))}
    </div>
  );
}

export const Left = () => <Story direction="left" />;
export const Right = () => <Story direction="right" />;
export const Up = () => <Story direction="up" />;
export const Down = () => <Story direction="down" />;
