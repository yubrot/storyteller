import GroupAxis from './GroupAxis';
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

export const Default = () => {
  return (
    <div className="w-96">
      <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
        {(width, height) => {
          const { left, right, top, bottom } = rect(width, height);
          return (
            <>
              <GroupAxis {...left} labels={['foo']} />
              <GroupAxis {...right} labels={['foo', 'bar']} />
              <GroupAxis {...top} labels={['foo', 'bar', 'baz']} />
              <GroupAxis {...bottom} labels={'ABCDEFGHIJ'.split('')} />
            </>
          );
        }}
      </Svg>
    </div>
  );
};
