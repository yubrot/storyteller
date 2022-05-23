import type { Direction } from './Group';
import type { Direction as BarDirection } from './BarStack';
import BarStackGroup from './BarStackGroup';
import Svg from './Svg';

function Story({
  direction,
  barDirections,
}: {
  direction: Direction;
  barDirections: BarDirection[];
}) {
  const data = [[7, 5], [3, 9], [4, 2, 1], [], [3, 8], [5]].map(values => ({
    data: values.map(value => ({ value })),
  }));
  return (
    <div className="w-96 space-y-4">
      {barDirections.map(barDirection => (
        <Svg aspectRatio={[4, 3]} className="bg-gray-200 shadow-lg" key={barDirection}>
          {(width, height) => (
            <BarStackGroup
              x={Math.floor(width * 0.05)}
              y={Math.floor(height * 0.05)}
              width={Math.floor(width * 0.9)}
              height={Math.floor(height * 0.9)}
              direction={direction}
              barDirection={barDirection}
              data={data}
              bound={20}
              props={({ value }) => ({ fill: `#${value}${value}${value}` })}
            />
          )}
        </Svg>
      ))}
    </div>
  );
}

export const Left = () => <Story direction="left" barDirections={['up', 'down']} />;
export const Right = () => <Story direction="right" barDirections={['up', 'down']} />;
export const Up = () => <Story direction="up" barDirections={['left', 'right']} />;
export const Down = () => <Story direction="down" barDirections={['left', 'right']} />;
