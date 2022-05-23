import Svg from './Svg';
import Title from './Title';

export const Default = () => {
  return (
    <div className="w-96 space-y-8">
      <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
        {(width, height) => (
          <Title width={width} height={height / 4} text="Title" hasPrev hasNext />
        )}
      </Svg>
    </div>
  );
};
