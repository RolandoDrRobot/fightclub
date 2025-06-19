import { createContext, useContext, useState } from "react";

const CharacterAnimationsContext = createContext({});

// Mapeo de animaciones de ataque a animaciones de defensa usando animaciones existentes
const attackToDefenseMap = {
  // Usamos las animaciones disponibles en el modelo para testing
  "punch": "idle", // Player 1 hace alguna animación, Player 2 hace idle como "reacción"
  "kick": "walking", // Player 1 hace otra animación, Player 2 hace walking
  "strong": "running", // Player 1 hace una tercera, Player 2 hace running
  "uppercut": "jump", // Si hay jump, Player 2 hace jump
};

export const CharacterAnimationsProvider = (props) => {
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animations, setAnimations] = useState([]);
  
  // Sistema de combate
  const [player1AnimationIndex, setPlayer1AnimationIndex] = useState(0);
  const [player2AnimationIndex, setPlayer2AnimationIndex] = useState(0);
  const [isCombatMode, setIsCombatMode] = useState(false);

  // Función para activar ataque del jugador 1 y reacción del jugador 2
  const triggerAttack = (attackAnimationName) => {
    console.log("Trigger attack:", attackAnimationName);
    console.log("Available animations:", animations);
    
    // Para testing, usamos índices específicos de las animaciones disponibles
    let attackIndex = 0;
    let defenseIndex = 0;
    
    switch(attackAnimationName) {
      case "punch":
        attackIndex = Math.min(1, animations.length - 1); // Segunda animación disponible
        defenseIndex = Math.min(0, animations.length - 1); // Primera animación (idle)
        break;
      case "kick":
        attackIndex = Math.min(2, animations.length - 1); // Tercera animación
        defenseIndex = Math.min(1, animations.length - 1); // Segunda animación
        break;
      case "strong":
        attackIndex = Math.min(3, animations.length - 1); // Cuarta animación
        defenseIndex = Math.min(2, animations.length - 1); // Tercera animación
        break;
      case "uppercut":
        attackIndex = Math.min(0, animations.length - 1); // Primera animación
        defenseIndex = Math.min(3, animations.length - 1); // Cuarta animación
        break;
      default:
        attackIndex = 0;
        defenseIndex = 0;
    }
    
    console.log(`Attack: ${animations[attackIndex]}, Defense: ${animations[defenseIndex]}`);
    setPlayer1AnimationIndex(attackIndex);
    setPlayer2AnimationIndex(defenseIndex);
  };

  // Función para activar animación sincronizada (modo normal)
  const triggerSyncAnimation = (index) => {
    setPlayer1AnimationIndex(index);
    setPlayer2AnimationIndex(index);
    setAnimationIndex(index);
  };

  return (
    <CharacterAnimationsContext.Provider
      value={{
        // Sistema original
        animationIndex,
        setAnimationIndex,
        animations,
        setAnimations,
        
        // Sistema de combate
        player1AnimationIndex,
        player2AnimationIndex,
        setPlayer1AnimationIndex,
        setPlayer2AnimationIndex,
        isCombatMode,
        setIsCombatMode,
        triggerAttack,
        triggerSyncAnimation,
      }}
    >
      {props.children}
    </CharacterAnimationsContext.Provider>
  );
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationsContext);
};
