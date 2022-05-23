import Button from './Button';
import Svg from './Svg';

export const Text = () => (
  <div className="w-96 space-y-4">
    <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
      {(width, height) => (
        <Button
          center={[width / 2, height / 2]}
          width={60}
          height={60}
          rectProps={{ fill: 'gray', onClick: () => alert('CLICK') }}
          text="Button"
          textProps={{ fontSize: 12, fill: 'white' }}
        />
      )}
    </Svg>
  </div>
);

export const Custom = () => (
  <div className="w-96 space-y-4">
    <Svg aspectRatio={[4, 3]} className="bg-gray-600 shadow-lg">
      {(width, height) => (
        <Button
          center={[width / 2, height / 2]}
          width={60}
          height={60}
          rectProps={{ fill: 'gray', onClick: () => alert('CLICK') }}
        >
          <circle cx="0" cy="0" r="20" fill="white" pointerEvents="none" />
        </Button>
      )}
    </Svg>
  </div>
);
