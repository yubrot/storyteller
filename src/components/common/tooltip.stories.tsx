import { useTooltip } from './tooltip';

export function Top() {
  const tooltip = useTooltip();

  return (
    <div className="m-12 flex space-x-1">
      <tooltip.Container />
      <div
        className="bg-gray-100 rounded-md p-3 text-sm"
        onMouseOver={ev => tooltip.show(ev.currentTarget, 'foo')}
        onMouseOut={() => tooltip.clear()}
      >
        Hello
      </div>
      <div
        className="bg-gray-100 rounded-md p-3 text-sm"
        onMouseOver={ev => tooltip.show(ev.currentTarget, 'bar')}
        onMouseOut={() => tooltip.clear()}
      >
        World
      </div>
    </div>
  );
}
