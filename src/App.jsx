import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import HealthBars from "./components/HealthBars";
import CrowdSound from "./components/CrowdSound";
import PunchSound from "./components/PunchSound";
import { useCharacterAnimations } from "./contexts/CharacterAnimations";

function App() {
  const { isCombatMode } = useCharacterAnimations();

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: -1
      }} />
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 60 }}
        shadows
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Experience />
      </Canvas>
      <Interface />
      <HealthBars />
      <CrowdSound />
      <PunchSound />
    </>
  );
}

export default App;
