import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

export interface Tooltip {
  Container(): React.ReactElement | null;
  current: { x: number; y: number; content: React.ReactNode } | null;
  show(el: Element, content: React.ReactNode): void;
  clear(): void;
}

export function useTooltip(): Tooltip {
  const [state, setState] = useState<Tooltip['current']>(null);

  return {
    Container: () => <Container current={state} />,
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

interface ContainerProps {
  current: Tooltip['current'];
}

function Container({ current }: ContainerProps): React.ReactElement | null {
  if (!current) return null;
  const { x, y, content } = current;

  return ReactDOM.createPortal(
    <div className="tooltip top" style={{ left: x, top: y }}>
      {content}
    </div>,
    document.body
  );
}
