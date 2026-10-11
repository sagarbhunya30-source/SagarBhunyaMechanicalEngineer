import ErrorBoundary from '../ErrorBoundary.jsx';
import ConveyorDemo from './ConveyorDemo.jsx';
import WasteDemo from './WasteDemo.jsx';

const demos = { conveyor: ConveyorDemo, waste: WasteDemo };

export default function ProjectDemo({ id }) {
  const Demo = demos[id];
  if (!Demo) return null;
  return (
    <ErrorBoundary fallback={<p className="rounded-lg border border-white/10 p-4 text-sm text-steel-300">Illustration unavailable.</p>}>
      <Demo />
    </ErrorBoundary>
  );
}
