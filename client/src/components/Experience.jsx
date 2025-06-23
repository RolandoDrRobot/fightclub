import { CameraControls } from "./CameraControls";
import Pete from "./Pete";
import Tyler from "./Tyler";
import ParticleEffect from "./ParticleEffect";
import BloodFloor from "./BloodFloor";
import Audience from "./Audience";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

const Experience = () => {
  const { isCombatMode } = useCharacterAnimations();

  // Posiciones y rotaciones según el modo
  const getCharacterTransforms = () => {
    if (isCombatMode) {
      // Modo combate: mirándose uno al otro
      return {
        player1: {
          position: [-0.5, 0, 0],
          rotation: [0, Math.PI / 2, 0] // Mirando hacia la derecha
        },
        player2: {
          position: [0.5, 0, 0], 
          rotation: [0, -Math.PI / 2, 0] // Mirando hacia la izquierda
        }
      };
    } else {
      // Modo sincronización: misma distancia pero mirando al frente
      return {
        player1: {
          position: [-0.5, 0, 0], // Misma distancia
          rotation: [0, 0, 0] // Mirando al frente
        },
        player2: {
          position: [0.5, 0, 0], // Misma distancia
          rotation: [0, 0, 0] // Mirando al frente
        }
      };
    }
  };

  const transforms = getCharacterTransforms();

  return (
    <>
      <CameraControls />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-5, 5, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Efectos de sangre - En ambos modos */}
      <ParticleEffect />
      <BloodFloor />
      
      {/* Audiencia - Personajes bailando alrededor */}
      <Audience />
      
      <group position={[0, -1, 0]}>
        {/* Player 1 - Pete */}
        <Pete 
          player={1} 
          position={transforms.player1.position} 
          rotation={transforms.player1.rotation} 
        />
        {/* Player 2 - Tyler */}
        <Tyler 
          player={2} 
          position={transforms.player2.position} 
          rotation={transforms.player2.rotation} 
        />
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
