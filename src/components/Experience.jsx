import { CameraControls } from "./CameraControls";
import Woman from "./Woman";

const Experience = () => {
  return (
    <>
      <CameraControls />
      <ambientLight />
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <group position={[0, -1, 0]}>
        <Woman player={1} position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Woman player={2} position={[0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </group>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeBufferGeometry args={[15, 15, 1, 1]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};

export default Experience;
