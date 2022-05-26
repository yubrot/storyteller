import { ImgHTMLAttributes } from 'react';

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '/';

export default function Img({
  src,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>): React.ReactElement {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img src={src ? assetPrefix + src : src} {...props} />;
}
