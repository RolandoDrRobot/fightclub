import { createContext, useContext, useState, useRef, useEffect } from "react";

const CharacterAnimationsContext = createContext({});

// Mapeo de animaciones de ataque a animaciones de defensa usando animaciones existentes
const attackToDefenseMap = {
  // Usamos las animaciones disponibles en el modelo para testing
  "punch": "idle", // Player 1 hace alguna animación, Player 2 hace idle como "reacción"
  "kick": "walking", // Player 1 hace otra animación, Player 2 hace walking
  "strong": "running", // Player 1 hace una tercera, Player 2 hace running
  "uppercut": "jump", // Si hay jump, Player 2 hace jump
};

// Daño por tipo de ataque
const attackDamage = {
  "punch": 10,
  "kick": 15,
  "strong": 25,
  "uppercut": 20,
};

export const CharacterAnimationsProvider = (props) => {
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animations, setAnimations] = useState([]);
  
  // Sistema de combate
  const [player1AnimationIndex, setPlayer1AnimationIndex] = useState(0);
  const [player2AnimationIndex, setPlayer2AnimationIndex] = useState(0);
  const [isCombatMode, setIsCombatMode] = useState(false);
  
  // Sistema de vida
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [maxHealth] = useState(100);
  
  // Estados de muerte
  const [player1IsDead, setPlayer1IsDead] = useState(false);
  const [player2IsDead, setPlayer2IsDead] = useState(false);
  
  // Referencias para timeouts
  const attackTimeoutRef = useRef(null);

  // Función para obtener índice de animación de muerte (usando una animación disponible)
  const getDeathAnimationIndex = () => {
    // Para prueba, usamos la última animación disponible como "muerte"
    return Math.max(0, animations.length - 1);
  };

  // Función para aplicar animación con verificación de muerte
  const setPlayer1Animation = (index) => {
    if (player1IsDead) {
      console.log("Player 1 is dead - cannot change animation from death");
      return;
    }
    setPlayer1AnimationIndex(index);
  };

  const setPlayer2Animation = (index) => {
    if (player2IsDead) {
      console.log("Player 2 is dead - cannot change animation from death");
      return;
    }
    setPlayer2AnimationIndex(index);
  };

  // Función para volver ambos personajes a idle
  const returnToIdle = () => {
    console.log("Attempting to return players to idle");
    const idleIndex = 0; // Asumimos que idle es la primera animación
    
    // Solo volver a idle si no están muertos
    if (!player1IsDead) {
      console.log("Player 1 returning to idle");
      setPlayer1AnimationIndex(idleIndex);
    } else {
      console.log("Player 1 is dead - staying in death animation");
    }
    
    if (!player2IsDead) {
      console.log("Player 2 returning to idle");
      setPlayer2AnimationIndex(idleIndex);
    } else {
      console.log("Player 2 is dead - staying in death animation");
    }
  };

  // Función para aplicar daño al jugador 2
  const applyDamageToPlayer2 = (attackType) => {
    const damage = attackDamage[attackType] || 10;
    setPlayer2Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      console.log(`Player 2 receives ${damage} damage. Health: ${newHealth}/${maxHealth}`);
      
      // Verificar si Player 2 muere
      if (newHealth <= 0 && !player2IsDead) {
        console.log("Player 2 has died! Setting permanent death animation");
        setPlayer2IsDead(true);
        // Activar animación de muerte inmediatamente y de forma permanente
        setPlayer2AnimationIndex(getDeathAnimationIndex());
      }
      
      return newHealth;
    });
  };

  // Función para resetear vida de ambos jugadores
  const resetHealth = () => {
    console.log("Resetting health and reviving all players");
    setPlayer1Health(maxHealth);
    setPlayer2Health(maxHealth);
    setPlayer1IsDead(false);
    setPlayer2IsDead(false);
    
    // Volver ambos a idle al resetear (ahora es posible porque no están muertos)
    const idleIndex = 0;
    setPlayer1AnimationIndex(idleIndex);
    setPlayer2AnimationIndex(idleIndex);
    
    console.log("All players revived and returned to idle");
  };

  // Función para activar ataque del jugador 1 y reacción del jugador 2
  const triggerAttack = (attackAnimationName) => {
    // No permitir ataques si algún jugador está muerto
    if (player1IsDead || player2IsDead) {
      console.log("Cannot attack - a player is dead");
      return;
    }

    console.log("Trigger attack:", attackAnimationName);
    console.log("Available animations:", animations);
    
    // Limpiar timeout anterior si existe
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
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
    
    // Ejecutar las animaciones de ataque usando las funciones protegidas
    setPlayer1Animation(attackIndex);
    setPlayer2Animation(defenseIndex);
    
    // Aplicar daño al Player 2
    applyDamageToPlayer2(attackAnimationName);
    
    // Volver a idle después de 2 segundos solo si no hay muerte
    attackTimeoutRef.current = setTimeout(() => {
      // Esta función ya verifica internamente si los jugadores están muertos
      returnToIdle();
    }, 2000);
  };

  // Función para activar animación sincronizada (modo normal)
  const triggerSyncAnimation = (index) => {
    // Limpiar timeout si existe
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
    // Usar las funciones protegidas para evitar cambiar animaciones de jugadores muertos
    setPlayer1Animation(index);
    setPlayer2Animation(index);
    setAnimationIndex(index);
  };

  // Función para inicializar combate en idle
  const initializeCombat = () => {
    console.log("Initializing combat mode");
    resetHealth(); // Resetear vida al iniciar combate (esto revive a todos)
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
        setPlayer1AnimationIndex: setPlayer1Animation, // Usar función protegida
        setPlayer2AnimationIndex: setPlayer2Animation, // Usar función protegida
        isCombatMode,
        setIsCombatMode,
        triggerAttack,
        triggerSyncAnimation,
        returnToIdle,
        initializeCombat,
        
        // Sistema de vida
        player1Health,
        player2Health,
        maxHealth,
        setPlayer1Health,
        setPlayer2Health,
        resetHealth,
        
        // Estados de muerte
        player1IsDead,
        player2IsDead,
      }}
    >
      {props.children}
    </CharacterAnimationsContext.Provider>
  );
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationsContext);
};
