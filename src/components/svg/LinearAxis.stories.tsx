import LinearAxis from './LinearAxis';
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
  return ['max-w-md mb-4', 'max-w-2xl'].map((c, i) => (
    <div className={c} key={i}>
      <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
        {(width, height) => {
          const { left, right, top, bottom } = rect(width, height);
          return (
            <>
              <LinearAxis {...left} range={[0, 40]} />
              <LinearAxis {...right} range={[800, 0]} />
              <LinearAxis {...top} range={[0, 10]} />
              <LinearAxis {...bottom} range={[0, 2000]} />
            </>
          );
        }}
      </Svg>
    </div>
  ));
};
