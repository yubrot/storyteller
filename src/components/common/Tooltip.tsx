import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

export interface UseTooltip {
  current: { x: number; y: number; content: React.ReactNode } | null;
  show(el: Element, content: React.ReactNode): void;
  clear(): void;
}

export function useTooltip(): UseTooltip {
  const [state, setState] = useState<UseTooltip['current']>(null);

  return {
    current: state,
    show: useCallback((el, content) => {
      const rect = el.getBoundingClientRect();
      setState({
        x: rect.left + rect.width / 2,
        y: rect.top - 5,
        content,
      });
    }, []),
    clear: useCallback(() => setState(null), []),
  };
}

export interface Props {
  handler: UseTooltip;
}

export default function Tooltip({ handler }: Props): React.ReactElement | null {
  if (!handler.current) return null;
  const { x, y, content } = handler.current;

  return ReactDOM.createPortal(
    <div className="tooltip top" style={{ left: x, top: y }}>
      {content}
    </div>,
    document.body
  );
}
