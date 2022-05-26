import Img from './common/Img';

export interface Props {
  className?: string;
}

export default function Footer({ className }: Props): React.ReactElement {
  return (
    <div className={`flex justify-center ${className ?? ''}`}>
      <a href="https://github.com/yubrot/storyteller" className="opacity-75 hover:opacity-100">
        <Img src="github.png" className="w-12 h-12" alt="github" />
      </a>
    </div>
  );
}
