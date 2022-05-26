import Img from './common/Img';

export interface Props {
  className?: string;
}

export default function Logo({ className }: Props): React.ReactElement {
  return (
    <div className={`flex justify-center ${className ?? ''}`}>
      <Img src="logo.png" alt="storyteller" />
    </div>
  );
}
