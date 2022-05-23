import { useState } from 'react';
import Svg from './Svg';
import Transition from './Transition';

export const Default = () => {
  const [point, setPoint] = useState(false);

  return (
    <div className="w-96 space-y-8">
      <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
        {(width, height) => (
          <rect fill="white">
            <Transition
              props={{
                x: (width / 4) * (point ? 3 : 1),
                y: (height / 4) * (point ? 3 : 1),
                width: width / 8,
                height: height / 8,
              }}
            />
          </rect>
        )}
      </Svg>
      <button
        className="text-sm bg-gray-200 hover:bg-gray-100 rounded-md py-2 px-3"
        onClick={() => setPoint(p => !p)}
      >
        Move
      </button>
    </div>
  );
};
