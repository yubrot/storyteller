import { useEffect, useRef } from 'react';

export interface Props {
  initialProps?: { [attr: string]: string | number };
  props: { [attr: string]: string | number };
  dur?: string;
  calcMode?: string;
  keyTimes?: string;
  keySplines?: string;
}

const predefinedKeySplines: { [name: string]: string } = {
  ease: '0.25 0.1 0.25 1.0',
  linear: '0.0 0.0 1.0 1.0',
  'ease-in': '0.42 0 1.0 1.0',
  'ease-out': '0.0 0.0 0.58 1.0',
  'ease-in-out': '0.42 0.0 0.58 1.0',
};

export default function Transition({
  initialProps = {},
  props,
  dur = '300ms',
  calcMode = 'spline',
  keyTimes = '0;1',
  keySplines = 'ease-in-out',
}: Props): React.ReactElement {
  const prevPropsRef = useRef<{ [attr: string]: string | number }>(initialProps);
  useEffect(() => {
    prevPropsRef.current = props;
  }, [props]);
  const prevProps = prevPropsRef.current;

  if (keySplines in predefinedKeySplines) keySplines = predefinedKeySplines[keySplines];

  return (
    <>
      {Object.entries(props).map(([attr, prop]) => {
        const prevProp = prevProps[attr] ?? prop;
        return (
          <animate
            key={attr}
            ref={a => prevProp != prop && (a as any)?.beginElement?.()}
            attributeName={attr}
            from={prevProp}
            to={prop}
            dur={dur}
            repeatCount={0}
            fill="freeze"
            calcMode={calcMode}
            keyTimes={keyTimes}
            keySplines={keySplines}
          />
        );
      })}
    </>
  );
}
