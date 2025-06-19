import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import HealthBars from "./components/HealthBars";

function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 60 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        <Experience />
      </Canvas>
      <Interface />
      <HealthBars />
    </>
  );
}

export default App;
