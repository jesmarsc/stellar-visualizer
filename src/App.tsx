import { Canvas3D } from "./components/canvas-3d";
import { InfoCard } from "./components/info-card";

export function App() {
  return (
    <div className="relative w-screen h-screen-sm overflow-hidden">
      <Canvas3D />
      <InfoCard />
    </div>
  );
}
