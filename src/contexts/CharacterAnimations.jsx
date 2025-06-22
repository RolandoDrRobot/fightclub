import { createContext, useContext, useState, useRef, useEffect } from "react";

const CharacterAnimationsContext = createContext({});

// Mapeo de animaciones de ataque a animaciones de defensa para Pete
// Usando las animaciones reales disponibles
const attackToDefenseMap = {
  // Todos los ataques causan la animación "hurt" en el defensor
  "kick": "hurt",
  "punch": "hurt", 
  "punches": "hurt", // Combo de puñetazos
};

// Definir animaciones específicas de Pete por categoría usando las reales
const peteAnimations = {
  // Animaciones de combate (para modo combate)
  combat: {
    idle: "idleFight",        // Idle específico para combate
    kick: "kick",             // Patada
    punch: "punch",           // Puñetazo simple
    punches: "punches",       // Combo de puñetazos (ataque fuerte)
    hurt: "hurt",             // Reacción al recibir daño
    die: "die",               // Animación de muerte
    block: "cover"            // Usar cover como bloqueo
  },
  // Animaciones de baile y celebración (para modo fuera de combate)
  dance: {
    celebration: "celebration",
    dance1: "dance1",
    dance2: "dance2", 
    dance3: "dance3",
    dance4: "dance4",
    dance5: "dance5",
    dance6: "dance6",
    intro: "intro"
  }
};

// Definir animaciones específicas de Tyler - Tyler tendrá las mismas referencias pero pueden mapear a diferentes nombres
const tylerAnimations = {
  // Animaciones de combate (para modo combate)
  combat: {
    idle: "idleFight",        // Idle específico para combate
    kick: "kick",             // Patada
    punch: "punch",           // Puñetazo simple
    punches: "punches",       // Combo de puñetazos (ataque fuerte)
    hurt: "hurt",             // Reacción al recibir daño
    die: "die",               // Animación de muerte
    block: "cover"            // Usar cover como bloqueo
  },
  // Animaciones de baile y celebración (para modo fuera de combate)
  dance: {
    celebration: "celebration",
    dance1: "dance1",
    dance2: "dance2", 
    dance3: "dance3",
    dance4: "dance4",
    dance5: "dance5",
    dance6: "dance6",
    intro: "intro"
  }
};

// Mapeo de bailes para Player 2 - cuando Player 1 hace un baile, Player 2 hace otro
const danceMapping = {
  "dance1": "dance2",
  "dance2": "dance3", 
  "dance3": "dance4",
  "dance4": "dance5",
  "dance5": "dance6",
  "dance6": "dance1",  // Ciclo completo
  "celebration": "intro",
  "intro": "celebration"
};

// Daño por tipo de ataque
const attackDamage = {
  "punch": 15,    // Puñetazo básico
  "kick": 20,     // Patada
  "punches": 35,  // Combo de puñetazos (más daño)
};

// Costo de stamina por acción
const staminaCosts = {
  "punch": 5,     // Puñetazo básico - bajo costo
  "kick": 10,     // Patada - costo medio
  "punches": 25,  // Combo de puñetazos - alto costo
};

// Constantes de stamina
const MAX_STAMINA = 100;
const STAMINA_REGEN_RATE = 20; // Stamina que se regenera por segundo
const STAMINA_REGEN_DELAY = 1000; // Tiempo antes de empezar a regenerar (ms)
const BLOCK_DURATION = 5000; // Máximo tiempo de bloqueo (5 segundos)
const BLOCK_STAMINA_DRAIN_RATE = 20; // Stamina que se drena por segundo mientras bloquea
const STAMINA_UPDATE_INTERVAL = 50; // Actualizar cada 50ms para animación suave

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
  
  // Sistema de stamina
  const [player1Stamina, setPlayer1Stamina] = useState(MAX_STAMINA);
  const [player2Stamina, setPlayer2Stamina] = useState(MAX_STAMINA);
  
  // Estados de muerte
  const [player1IsDead, setPlayer1IsDead] = useState(false);
  const [player2IsDead, setPlayer2IsDead] = useState(false);
  
  // Contador de victorias del Player 1
  const [player1Wins, setPlayer1Wins] = useState(0);
  
  // Flag para evitar contar victorias duplicadas en la misma ronda
  const [victoryCountedThisRound, setVictoryCountedThisRound] = useState(false);
  
  // Estados de defensa/bloqueo
  const [player1IsBlocking, setPlayer1IsBlocking] = useState(false);
  const [player2IsBlocking, setPlayer2IsBlocking] = useState(false);
  
  // Sistema de IA para Player 2
  const [isAIEnabled, setIsAIEnabled] = useState(true); // IA siempre activada
  const [aiDifficulty, setAIDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  
  // Referencias para timeouts y intervals
  const attackTimeoutRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const player1BlockTimeoutRef = useRef(null);
  const player2BlockTimeoutRef = useRef(null);
  const player1StaminaRegenRef = useRef(null);
  const player2StaminaRegenRef = useRef(null);
  const player1BlockStaminaRef = useRef(null);
  const player2BlockStaminaRef = useRef(null);
  const aiActionTimeoutRef = useRef(null);

  // Función para encontrar índice de animación por nombre exacto - funciona para ambos personajes
  const findAnimationIndex = (animationName, player = 1) => {
    const index = animations.findIndex(anim => anim === animationName);
    if (index >= 0) {
      return index;
    }
    
    // Si no encuentra la animación exacta, buscar por nombre similar
    const fallbackIndex = animations.findIndex(anim => 
      anim.toLowerCase().includes(animationName.toLowerCase())
    );
    
    console.log(`Animation "${animationName}" for Player ${player}: index ${fallbackIndex >= 0 ? fallbackIndex : 0}`);
    return fallbackIndex >= 0 ? fallbackIndex : 0; // Fallback a la primera animación
  };

  // Función para obtener animación específica según el modo y jugador
  const getAnimationForMode = (animationType, player = 1) => {
    // Usar las animaciones correspondientes según el jugador
    const characterAnimations = player === 1 ? peteAnimations : tylerAnimations;
    
    if (isCombatMode) {
      // En modo combate, usar animaciones de pelea
      const combatAnim = characterAnimations.combat[animationType];
      if (combatAnim) {
        return findAnimationIndex(combatAnim, player);
      }
      // Si no encuentra la animación, usar idleFight como fallback
      return findAnimationIndex("idleFight", player);
    } else {
      // Fuera de combate, usar animaciones de baile para movimientos básicos
      if (animationType === "idle") {
        // Buscar idle normal primero, si no existe usar la primera animación
        const idleIndex = findAnimationIndex("idle", player);
        return idleIndex > 0 ? idleIndex : 0;
      }
      
      // Para otros movimientos, usar animaciones de baile
      const danceAnimations = Object.values(characterAnimations.dance);
      const randomDance = danceAnimations[Math.floor(Math.random() * danceAnimations.length)];
      return findAnimationIndex(randomDance, player);
    }
  };

  // Función para consumir stamina del Player 1
  const consumePlayer1Stamina = (amount) => {
    setPlayer1Stamina(prev => {
      const newStamina = Math.max(0, prev - amount);
      console.log(`Player 1 stamina: ${newStamina}/${MAX_STAMINA} (consumed ${amount})`);
      return newStamina;
    });
    // Solo iniciar regeneración si NO está bloqueando
    if (!player1IsBlocking) {
      startPlayer1StaminaRegen();
    }
  };

  // Función para consumir stamina del Player 2
  const consumePlayer2Stamina = (amount) => {
    setPlayer2Stamina(prev => {
      const newStamina = Math.max(0, prev - amount);
      console.log(`Player 2 stamina: ${newStamina}/${MAX_STAMINA} (consumed ${amount})`);
      return newStamina;
    });
    // Solo iniciar regeneración si NO está bloqueando
    if (!player2IsBlocking) {
      startPlayer2StaminaRegen();
    }
  };

  // Función para iniciar regeneración de stamina del Player 1
  const startPlayer1StaminaRegen = () => {
    // Si está bloqueando, no regenerar stamina
    if (player1IsBlocking) {
      console.log("Player 1 is blocking - no stamina regeneration");
      return;
    }
    
    // Limpiar regeneración anterior si existe
    if (player1StaminaRegenRef.current) {
      clearInterval(player1StaminaRegenRef.current);
      player1StaminaRegenRef.current = null;
    }
    
    console.log("Player 1 stamina regeneration will start after delay");
    
    // Esperar antes de empezar a regenerar
    setTimeout(() => {
      // Verificar nuevamente que no esté bloqueando antes de iniciar regeneración
      if (player1IsBlocking) {
        console.log("Player 1 started blocking during regen delay - cancelling regeneration");
        return;
      }
      
      console.log("Player 1 stamina regeneration starting");
      player1StaminaRegenRef.current = setInterval(() => {
        setPlayer1Stamina(prev => {
          // Si está bloqueando, detener regeneración inmediatamente
          if (player1IsBlocking) {
            clearInterval(player1StaminaRegenRef.current);
            player1StaminaRegenRef.current = null;
            console.log("Player 1 started blocking - stopping stamina regeneration");
            return prev;
          }
          
          const increment = (STAMINA_REGEN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
          const newStamina = Math.min(MAX_STAMINA, prev + increment);
          
          if (newStamina >= MAX_STAMINA) {
            clearInterval(player1StaminaRegenRef.current);
            player1StaminaRegenRef.current = null;
            console.log("Player 1 stamina fully regenerated");
            return MAX_STAMINA;
          }
          return newStamina;
        });
      }, STAMINA_UPDATE_INTERVAL);
    }, STAMINA_REGEN_DELAY);
  };

  // Función para iniciar regeneración de stamina del Player 2
  const startPlayer2StaminaRegen = () => {
    console.log("=== Player 2 STAMINA REGEN REQUESTED ===");
    
    // Si está bloqueando, no regenerar stamina
    if (player2IsBlocking) {
      console.log("Player 2 is blocking - REJECTING stamina regeneration");
      return;
    }
    
    // Limpiar regeneración anterior si existe
    if (player2StaminaRegenRef.current) {
      console.log("Player 2 - Clearing existing regeneration before starting new one");
      clearInterval(player2StaminaRegenRef.current);
      player2StaminaRegenRef.current = null;
    }
    
    console.log("Player 2 stamina regeneration will start after delay");
    
    // Esperar antes de empezar a regenerar
    setTimeout(() => {
      // Verificar nuevamente que no esté bloqueando antes de iniciar regeneración
      if (player2IsBlocking) {
        console.log("Player 2 started blocking during regen delay - CANCELLING regeneration");
        return;
      }
      
      console.log("Player 2 stamina regeneration starting NOW");
      player2StaminaRegenRef.current = setInterval(() => {
        setPlayer2Stamina(prev => {
          // VERIFICACIÓN CRÍTICA: Si está bloqueando, detener regeneración inmediatamente
          if (player2IsBlocking) {
            console.log("Player 2 EMERGENCY STOP - started blocking during regeneration");
            clearInterval(player2StaminaRegenRef.current);
            player2StaminaRegenRef.current = null;
            return prev;
          }
          
          const increment = (STAMINA_REGEN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
          const newStamina = Math.min(MAX_STAMINA, prev + increment);
          
          if (newStamina >= MAX_STAMINA) {
            clearInterval(player2StaminaRegenRef.current);
            player2StaminaRegenRef.current = null;
            console.log("Player 2 stamina fully regenerated");
            return MAX_STAMINA;
          }
          return newStamina;
        });
      }, STAMINA_UPDATE_INTERVAL);
    }, STAMINA_REGEN_DELAY);
  };

  // Función para obtener índice de animación de muerte según el jugador
  const getDeathAnimationIndex = (player = 1) => {
    return findAnimationIndex("die", player);
  };

  // Función para obtener índice de animación de bloqueo según el jugador
  const getBlockAnimationIndex = (player = 1) => {
    return findAnimationIndex("cover", player);
  };

  // Función para aplicar animación con verificación de muerte
  const setPlayer1Animation = (index) => {
    console.log(`setPlayer1Animation called with index: ${index}, player1IsDead: ${player1IsDead}`);
    if (player1IsDead) {
      console.log("Player 1 is dead - cannot change animation from death");
      return;
    }
    console.log(`Setting Player 1 (Pete) animation to index: ${index}`);
    setPlayer1AnimationIndex(index);
  };

  const setPlayer2Animation = (index) => {
    console.log(`setPlayer2Animation called with index: ${index}, player2IsDead: ${player2IsDead}`);
    if (player2IsDead) {
      console.log("Player 2 is dead - cannot change animation from death");
      return;
    }
    console.log(`Setting Player 2 (Tyler) animation to index: ${index}`);
    setPlayer2AnimationIndex(index);
  };

  // Función para volver ambos personajes a idle
  const returnToIdle = () => {
    console.log("Attempting to return players to idle");
    
    // Determinar qué animación idle usar según el modo para cada jugador
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    
    // Solo volver a idle si no están muertos y no están bloqueando
    if (!player1IsDead && !player1IsBlocking) {
      console.log("Player 1 (Pete) returning to idle");
      setPlayer1AnimationIndex(player1IdleIndex);
    } else if (player1IsBlocking) {
      console.log("Player 1 (Pete) is blocking - staying in block animation");
    } else {
      console.log("Player 1 (Pete) is dead - staying in death animation");
    }
    
    if (!player2IsDead && !player2IsBlocking) {
      console.log("Player 2 (Tyler) returning to idle");
      setPlayer2AnimationIndex(player2IdleIndex);
    } else if (player2IsBlocking) {
      console.log("Player 2 (Tyler) is blocking - staying in block animation");
    } else {
      console.log("Player 2 (Tyler) is dead - staying in death animation");
    }
  };

  // Función para detener bloqueo del Player 1
  const stopPlayer1Block = () => {
    console.log("Player 1 (Pete) stops blocking");
    setPlayer1IsBlocking(false);
    
    // Usar la animación idle correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    setPlayer1Animation(idleIndex);
    
    // Limpiar completamente todos los timeouts e intervals del bloqueo
    if (player1BlockTimeoutRef.current) {
      clearTimeout(player1BlockTimeoutRef.current);
      player1BlockTimeoutRef.current = null;
    }
    if (player1BlockStaminaRef.current) {
      clearInterval(player1BlockStaminaRef.current);
      player1BlockStaminaRef.current = null;
    }
    
    // IMPORTANTE: Iniciar regeneración solo después de limpiar todo
    setTimeout(() => {
      if (!player1IsBlocking) { // Verificar que realmente no esté bloqueando
        startPlayer1StaminaRegen();
      }
    }, 100); // Pequeño delay para asegurar que el estado se actualice
  };

  // Función para detener bloqueo del Player 2
  const stopPlayer2Block = () => {
    console.log("Player 2 (Tyler) stops blocking");
    setPlayer2IsBlocking(false);
    
    // Usar la animación idle correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    setPlayer2Animation(idleIndex);
    
    // Limpiar completamente todos los timeouts e intervals del bloqueo
    if (player2BlockTimeoutRef.current) {
      clearTimeout(player2BlockTimeoutRef.current);
      player2BlockTimeoutRef.current = null;
    }
    if (player2BlockStaminaRef.current) {
      clearInterval(player2BlockStaminaRef.current);
      player2BlockStaminaRef.current = null;
    }
    
    // IMPORTANTE: Iniciar regeneración solo después de limpiar todo
    setTimeout(() => {
      if (!player2IsBlocking) { // Verificar que realmente no esté bloqueando
        startPlayer2StaminaRegen();
      }
    }, 100); // Pequeño delay para asegurar que el estado se actualice
  };

  // Función para activar/desactivar bloqueo del Player 1
  const togglePlayer1Block = () => {
    if (player1IsDead) {
      console.log("Player 1 is dead - cannot block");
      return;
    }

    if (player1IsBlocking) {
      // Detener bloqueo
      stopPlayer1Block();
    } else {
      // Verificar si tiene stamina suficiente para bloquear
      if (player1Stamina <= 0) {
        console.log("Player 1 has no stamina - cannot block");
        return;
      }

      console.log("Player 1 starts blocking");
      
      // PRIMERO: Detener completamente cualquier regeneración de stamina
      if (player1StaminaRegenRef.current) {
        clearInterval(player1StaminaRegenRef.current);
        player1StaminaRegenRef.current = null;
        console.log("Player 1 blocking - stopped stamina regeneration");
      }
      
      // SEGUNDO: Activar el estado de bloqueo y animación
      setPlayer1IsBlocking(true);
      setPlayer1Animation(getBlockAnimationIndex(1));
      
      // TERCERO: Iniciar el gasto gradual de stamina
      player1BlockStaminaRef.current = setInterval(() => {
        setPlayer1Stamina(prev => {
          const decrement = (BLOCK_STAMINA_DRAIN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
          const newStamina = Math.max(0, prev - decrement);
          
          if (newStamina <= 0) {
            console.log("Player 1 out of stamina - auto stop blocking");
            stopPlayer1Block();
            return 0;
          }
          return newStamina;
        });
      }, STAMINA_UPDATE_INTERVAL);
      
      // CUARTO: Auto-detener después de 5 segundos máximo
      player1BlockTimeoutRef.current = setTimeout(() => {
        if (player1IsBlocking) {
          console.log("Player 1 block timeout - auto stop blocking");
          stopPlayer1Block();
        }
      }, BLOCK_DURATION);
    }
  };

  // Función para activar/desactivar bloqueo del Player 2
  const togglePlayer2Block = () => {
    if (player2IsDead) {
      console.log("Player 2 is dead - cannot block");
      return;
    }

    if (player2IsBlocking) {
      // Detener bloqueo
      stopPlayer2Block();
    } else {
      // Verificar si tiene stamina suficiente para bloquear
      if (player2Stamina <= 0) {
        console.log("Player 2 has no stamina - cannot block");
        return;
      }

      console.log("=== Player 2 STARTING BLOCK ===");
      
      // PASO 1: DETENER COMPLETAMENTE CUALQUIER REGENERACIÓN (MÁS AGRESIVO)
      if (player2StaminaRegenRef.current) {
        console.log("Player 2 - Clearing existing stamina regeneration interval");
        clearInterval(player2StaminaRegenRef.current);
        player2StaminaRegenRef.current = null;
      }
      
      // PASO 2: VERIFICACIÓN ADICIONAL - Limpiar cualquier timeout pendiente de regeneración
      setTimeout(() => {
        if (player2StaminaRegenRef.current) {
          console.log("Player 2 - Found lingering regen interval, clearing it");
          clearInterval(player2StaminaRegenRef.current);
          player2StaminaRegenRef.current = null;
        }
      }, 10);
      
      // PASO 3: Activar el estado de bloqueo y animación
      setPlayer2IsBlocking(true);
      setPlayer2Animation(getBlockAnimationIndex(2));
      console.log("Player 2 - Block state and animation set");
      
      // PASO 4: DELAY ANTES DE INICIAR GASTO (para asegurar que regeneración esté completamente detenida)
      setTimeout(() => {
        // Verificación final antes de iniciar gasto
        if (player2StaminaRegenRef.current) {
          console.log("Player 2 - CRITICAL: Found regen during block start, clearing");
          clearInterval(player2StaminaRegenRef.current);
          player2StaminaRegenRef.current = null;
        }
        
        console.log("Player 2 - Starting stamina drain");
        // QUINTO: Iniciar el gasto gradual de stamina
        player2BlockStaminaRef.current = setInterval(() => {
          setPlayer2Stamina(prev => {
            const decrement = (BLOCK_STAMINA_DRAIN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
            const newStamina = Math.max(0, prev - decrement);
            
            if (newStamina <= 0) {
              console.log("Player 2 out of stamina - auto stop blocking");
              stopPlayer2Block();
              return 0;
            }
            return newStamina;
          });
        }, STAMINA_UPDATE_INTERVAL);
        
        // SEXTO: Auto-detener después de 5 segundos máximo
        player2BlockTimeoutRef.current = setTimeout(() => {
          if (player2IsBlocking) {
            console.log("Player 2 block timeout - auto stop blocking");
            stopPlayer2Block();
          }
        }, BLOCK_DURATION);
        
      }, 50); // Delay de 50ms para asegurar limpieza completa
    }
  };

  // Función para aplicar daño al jugador 1
  const applyDamageToPlayer1 = (attackType) => {
    // Si Player 1 está bloqueando, no recibe daño
    if (player1IsBlocking) {
      console.log("Player 1 is blocking - no damage taken!");
      return;
    }

    const damage = attackDamage[attackType] || 10;
    setPlayer1Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      console.log(`Player 1 receives ${damage} damage. Health: ${newHealth}/${maxHealth}`);
      
      // Verificar si Player 1 muere
      if (newHealth <= 0 && !player1IsDead) {
        console.log("Player 1 has died! Setting permanent death animation");
        setPlayer1IsDead(true);
        setPlayer1IsBlocking(false); // No puede bloquear si está muerto
        stopPlayer1Block(); // Detener bloqueo si estaba activo
        // Activar animación de muerte inmediatamente y de forma permanente
        setPlayer1AnimationIndex(getDeathAnimationIndex(1));
      }
      
      return newHealth;
    });
  };

  // Función para aplicar daño al jugador 2
  const applyDamageToPlayer2 = (attackType) => {
    console.log(`=== APPLYING DAMAGE TO PLAYER 2 ===`);
    console.log(`Attack type: ${attackType}`);
    console.log(`Player 2 current health: ${player2Health}`);
    console.log(`Player 2 is blocking: ${player2IsBlocking}`);
    console.log(`Player 2 is dead: ${player2IsDead}`);
    
    // Si Player 2 está bloqueando, no recibe daño
    if (player2IsBlocking) {
      console.log("Player 2 is blocking - no damage taken!");
      return;
    }

    const damage = attackDamage[attackType] || 10;
    console.log(`Damage to be applied: ${damage}`);
    
    setPlayer2Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      console.log(`Player 2 receives ${damage} damage. Health: ${newHealth}/${maxHealth}`);
      
      // Verificar si Player 2 muere
      if (newHealth <= 0 && !player2IsDead) {
        console.log("🔥 PLAYER 2 HAS DIED! Setting permanent death animation");
        setPlayer2IsDead(true);
        setPlayer2IsBlocking(false); // No puede bloquear si está muerto
        stopPlayer2Block(); // Detener bloqueo si estaba activo
        // Activar animación de muerte inmediatamente y de forma permanente
        setPlayer2AnimationIndex(getDeathAnimationIndex(2));
        
        // Incrementar contador de victorias del Player 1 SOLO si no se ha contado ya
        if (!victoryCountedThisRound) {
          console.log(`🏆 PLAYER 1 WINS! Incrementing counter (First time this round)`);
          setVictoryCountedThisRound(true);
          setPlayer1Wins(prevWins => {
            const newWins = prevWins + 1;
            console.log(`🎉 Total victories: ${newWins}`);
            return newWins;
          });
        } else {
          console.log(`⚠️ VICTORY ALREADY COUNTED THIS ROUND - Skipping increment`);
        }
      } else if (newHealth <= 0) {
        console.log("Player 2 health is 0 but player2IsDead is already true");
      }
      
      return newHealth;
    });
  };

  // Función para resetear vida y stamina de ambos jugadores
  const resetHealth = () => {
    console.log("Resetting health, stamina and reviving all players");
    setPlayer1Health(maxHealth);
    setPlayer2Health(maxHealth);
    setPlayer1Stamina(MAX_STAMINA);
    setPlayer2Stamina(MAX_STAMINA);
    setPlayer1IsDead(false);
    setPlayer2IsDead(false);
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    
    // Resetear flag de victoria contada para nueva ronda
    setVictoryCountedThisRound(false);
    console.log("🔄 Victory flag reset for new round");
    
    // Limpiar todos los timeouts e intervals
    if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
    if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
    if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
    if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
    if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
    if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
    
    // Volver ambos a idle usando la animación correcta según el modo para cada personaje
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    setPlayer1AnimationIndex(player1IdleIndex);
    setPlayer2AnimationIndex(player2IdleIndex);
    
    console.log("All players revived and returned to idle - Pete (Player 1) and Tyler (Player 2)");
  };

  // Función para revivir solo al jugador que perdió
  const reviveLosingPlayer = () => {
    console.log("Reviving losing player");
    
    // Resetear flag de victoria para nueva ronda
    setVictoryCountedThisRound(false);
    console.log("🔄 Victory flag reset for new round after revive");
    
    if (player1IsDead && !player2IsDead) {
      console.log("Reviving Player 1 (Pete)");
      setPlayer1IsDead(false);
      setPlayer1Health(maxHealth);
      setPlayer1Stamina(MAX_STAMINA);
      setPlayer1IsBlocking(false);
      
      // Volver a idle de combate
      const combatIdleIndex = findAnimationIndex("idleFight", 1);
      setPlayer1AnimationIndex(combatIdleIndex);
      
      // Reiniciar IA si estaba habilitada
      if (isAIEnabled && isCombatMode) {
        setTimeout(() => {
          startAI();
        }, 1000);
      }
      
    } else if (player2IsDead && !player1IsDead) {
      console.log("Reviving Player 2 (Tyler)");
      setPlayer2IsDead(false);
      setPlayer2Health(maxHealth);
      setPlayer2Stamina(MAX_STAMINA);
      setPlayer2IsBlocking(false);
      
      // Volver a idle de combate
      const combatIdleIndex = findAnimationIndex("idleFight", 2);
      setPlayer2AnimationIndex(combatIdleIndex);
      
      // Reiniciar IA si estaba habilitada
      if (isAIEnabled && isCombatMode) {
        setTimeout(() => {
          startAI();
        }, 1000);
      }
    }
    
    console.log("Losing player revived");
  };

  // ========== SISTEMA DE IA PARA PLAYER 2 ==========
  
  // Función para que la IA tome decisiones
  const makeAIDecision = () => {
    console.log("=== AI DECISION MAKING ===");
    console.log(`isAIEnabled: ${isAIEnabled}`);
    console.log(`isCombatMode: ${isCombatMode}`);
    console.log(`player1IsDead: ${player1IsDead}`);
    console.log(`player2IsDead: ${player2IsDead}`);
    console.log(`player2IsBlocking: ${player2IsBlocking}`);
    console.log(`player2Stamina: ${player2Stamina}`);
    
    // VERIFICACIÓN PRIORITARIA: Si el combate terminó, detener IA inmediatamente
    const combatEnded = player1IsDead || player2IsDead;
    if (combatEnded) {
      console.log("COMBAT ENDED - AI stopping all actions immediately");
      stopAI();
      return;
    }
    
    // Solo actuar si la IA está habilitada, en modo combate, y ningún jugador está muerto
    if (!isAIEnabled || !isCombatMode || player1IsDead || player2IsDead) {
      console.log("AI decision cancelled - conditions not met");
      return;
    }

    // Si Player 2 está bloqueando, decidir si continuar o no
    if (player2IsBlocking) {
      // 30% de probabilidad de dejar de bloquear en modo fácil
      if (Math.random() < 0.3) {
        console.log("AI decides to stop blocking");
        togglePlayer2Block();
      } else {
        console.log("AI decides to continue blocking");
      }
      return;
    }

    // Configuración de dificultad
    const difficultyConfig = {
      easy: {
        reactionTime: { min: 1500, max: 3000 }, // 1.5-3 segundos
        attackChance: 0.4, // 40% de probabilidad de atacar
        blockChance: 0.3,  // 30% de probabilidad de bloquear
        smartBlockChance: 0.1, // 10% de bloqueo inteligente
        staminaAwareness: 0.2 // 20% de consciencia de stamina
      }
    };

    const config = difficultyConfig[aiDifficulty];
    const action = Math.random();
    
    console.log(`AI random action value: ${action}`);
    console.log(`Attack threshold: ${config.attackChance}`);
    console.log(`Block threshold: ${config.attackChance + config.blockChance}`);

    // Decidir acción basada en probabilidades
    if (action < config.attackChance) {
      console.log("AI decides to attack");
      // Decidir qué ataque usar
      const attackTypes = ['punch', 'kick', 'punches'];
      const availableAttacks = attackTypes.filter(attack => {
        const cost = staminaCosts[attack] || 0;
        return player2Stamina >= cost;
      });
      
      console.log(`Available attacks: ${availableAttacks.join(', ')}`);

      if (availableAttacks.length > 0) {
        // En modo fácil, preferir ataques más simples
        let selectedAttack;
        if (aiDifficulty === 'easy') {
          // 60% punch, 30% kick, 10% punches
          const rand = Math.random();
          if (rand < 0.6 && availableAttacks.includes('punch')) {
            selectedAttack = 'punch';
          } else if (rand < 0.9 && availableAttacks.includes('kick')) {
            selectedAttack = 'kick';
          } else {
            selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
          }
        } else {
          selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
        }

        console.log(`AI selected attack: ${selectedAttack}`);
        console.log("Calling triggerPlayer2Attack...");
        triggerPlayer2Attack(selectedAttack);
      } else {
        console.log("AI wanted to attack but no attacks available due to stamina");
      }
    } else if (action < config.attackChance + config.blockChance) {
      console.log("AI decides to block");
      // Decidir si bloquear
      if (player2Stamina > 20) { // Solo bloquear si tiene suficiente stamina
        console.log("AI has enough stamina to block");
        togglePlayer2Block();
      } else {
        console.log("AI wanted to block but not enough stamina");
      }
    } else {
      console.log("AI decides to wait/do nothing");
    }
    // Si no hace nada, simplemente espera
  };

  // Función para iniciar el comportamiento de IA
  const startAI = () => {
    if (!isAIEnabled || !isCombatMode) return;

    console.log("Starting AI behavior");
    scheduleNextAIAction();
  };

  // Función para programar la próxima acción de IA
  const scheduleNextAIAction = () => {
    console.log("=== SCHEDULING NEXT AI ACTION ===");
    console.log(`isAIEnabled: ${isAIEnabled}`);
    console.log(`isCombatMode: ${isCombatMode}`);
    console.log(`player1IsDead: ${player1IsDead}`);
    console.log(`player2IsDead: ${player2IsDead}`);
    
    // VERIFICACIÓN PRIORITARIA: Si el combate terminó, no programar más acciones
    const combatEnded = player1IsDead || player2IsDead;
    if (combatEnded) {
      console.log("COMBAT ENDED - AI not scheduling any more actions");
      return;
    }
    
    if (!isAIEnabled || !isCombatMode || player1IsDead || player2IsDead) {
      console.log("AI scheduling cancelled - conditions not met");
      return;
    }

    // Limpiar timeout anterior
    if (aiActionTimeoutRef.current) {
      console.log("Clearing previous AI timeout");
      clearTimeout(aiActionTimeoutRef.current);
    }

    const difficultyConfig = {
      easy: { min: 1500, max: 3000 }
    };

    const config = difficultyConfig[aiDifficulty];
    const delay = Math.random() * (config.max - config.min) + config.min;
    
    console.log(`AI will act in ${delay}ms`);

    aiActionTimeoutRef.current = setTimeout(() => {
      console.log("AI timeout triggered - making decision");
      makeAIDecision();
      scheduleNextAIAction(); // Programar la siguiente acción
    }, delay);
    
    console.log("AI action scheduled successfully");
  };

  // Función para detener la IA
  const stopAI = () => {
    console.log("=== STOPPING AI BEHAVIOR ===");
    
    if (aiActionTimeoutRef.current) {
      console.log("Clearing AI action timeout");
      clearTimeout(aiActionTimeoutRef.current);
      aiActionTimeoutRef.current = null;
    }
    
    // Si Player 2 está bloqueando cuando se detiene la IA, detener el bloqueo
    if (player2IsBlocking) {
      console.log("AI was blocking when stopped - stopping block");
      stopPlayer2Block();
    }
    
    console.log("AI behavior completely stopped");
  };

  // Función para obtener animaciones según el tipo de ataque usando Pete
  const getAttackAnimations = (attackAnimationName) => {
    // Obtener animación de ataque
    const attackIndex = findAnimationIndex(attackAnimationName);
    
    // Obtener animación de defensa usando el mapeo (siempre "hurt")
    const defenseAnimationName = attackToDefenseMap[attackAnimationName] || "hurt";
    const defenseIndex = findAnimationIndex(defenseAnimationName);
    
    return { attackIndex, defenseIndex };
  };

  // Función para activar ataque del jugador 1 contra jugador 2
  const triggerPlayer1Attack = (attackAnimationName) => {
    // No permitir ataques si algún jugador está muerto o si el atacante está bloqueando
    if (player1IsDead || player2IsDead || player1IsBlocking) {
      console.log("Cannot attack - a player is dead or attacker is blocking");
      return;
    }

    // Verificar stamina para golpes fuertes
    const staminaCost = staminaCosts[attackAnimationName] || 0;
    if (staminaCost > 0 && player1Stamina < staminaCost) {
      console.log(`Player 1 needs ${staminaCost} stamina for ${attackAnimationName} but only has ${player1Stamina}`);
      return;
    }

    console.log("Player 1 attacks:", attackAnimationName);
    
    // Consumir stamina si es necesario
    if (staminaCost > 0) {
      consumePlayer1Stamina(staminaCost);
    }
    
    // Limpiar timeout anterior si existe
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
    const { attackIndex, defenseIndex } = getAttackAnimations(attackAnimationName);
    console.log(`P1 Attack: ${animations[attackIndex]}, P2 Defense: ${animations[defenseIndex]}`);
    
    // Ejecutar las animaciones de ataque usando las funciones protegidas
    setPlayer1Animation(attackIndex);
    // Solo cambiar animación del defensor si no está bloqueando
    if (!player2IsBlocking) {
      setPlayer2Animation(defenseIndex);
    }
    
    // Aplicar daño al Player 2
    applyDamageToPlayer2(attackAnimationName);
    
    // Volver a idle después de 2 segundos solo si no hay muerte
    attackTimeoutRef.current = setTimeout(() => {
      returnToIdle();
    }, 2000);
  };

  // Función para activar ataque del jugador 2 contra jugador 1
  const triggerPlayer2Attack = (attackAnimationName) => {
    // No permitir ataques si algún jugador está muerto o si el atacante está bloqueando
    if (player1IsDead || player2IsDead || player2IsBlocking) {
      console.log("Cannot attack - a player is dead or attacker is blocking");
      return;
    }

    // Verificar stamina para golpes fuertes
    const staminaCost = staminaCosts[attackAnimationName] || 0;
    if (staminaCost > 0 && player2Stamina < staminaCost) {
      console.log(`Player 2 needs ${staminaCost} stamina for ${attackAnimationName} but only has ${player2Stamina}`);
      return;
    }

    console.log("Player 2 attacks:", attackAnimationName);
    
    // Consumir stamina si es necesario
    if (staminaCost > 0) {
      consumePlayer2Stamina(staminaCost);
    }
    
    // Limpiar timeout anterior si existe
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
    const { attackIndex, defenseIndex } = getAttackAnimations(attackAnimationName);
    console.log(`P2 Attack: ${animations[attackIndex]}, P1 Defense: ${animations[defenseIndex]}`);
    
    // Ejecutar las animaciones de ataque usando las funciones protegidas
    setPlayer2Animation(attackIndex);
    // Solo cambiar animación del defensor si no está bloqueando
    if (!player1IsBlocking) {
      setPlayer1Animation(defenseIndex);
    }
    
    // Aplicar daño al Player 1
    applyDamageToPlayer1(attackAnimationName);
    
    // Volver a idle después de 2 segundos solo si no hay muerte
    attackTimeoutRef.current = setTimeout(() => {
      returnToIdle();
    }, 2000);
  };

  // Función para activar animación sincronizada (modo normal)
  const triggerSyncAnimation = (index) => {
    console.log(`=== TRIGGER SYNC ANIMATION ===`);
    console.log(`Index: ${index}, isCombatMode: ${isCombatMode}`);
    console.log(`Player states - P1 Dead: ${player1IsDead}, P2 Dead: ${player2IsDead}`);
    
    // Limpiar timeout si existe
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
    if (!isCombatMode && animations.length > 0) {
      // En modo baile, asignar diferentes animaciones a cada jugador
      const player1AnimationName = animations[index];
      
      // Obtener la animación mapeada para Player 2
      const player2AnimationName = danceMapping[player1AnimationName] || player1AnimationName;
      
      // Encontrar los índices de las animaciones
      const player1AnimationIndex = findAnimationIndex(player1AnimationName);
      const player2AnimationIndex = findAnimationIndex(player2AnimationName);
      
      console.log(`Dance sync - P1: ${player1AnimationName} (${player1AnimationIndex}), P2: ${player2AnimationName} (${player2AnimationIndex})`);
      
      // Asegurar que ambos jugadores están vivos antes de asignar animaciones
      if (player1IsDead || player2IsDead) {
        console.log("WARNING: One or both players are dead, reviving them first");
        setPlayer1IsDead(false);
        setPlayer2IsDead(false);
      }
      
      // Asignar diferentes animaciones a cada jugador
      console.log("Setting P1 animation...");
      setPlayer1Animation(player1AnimationIndex);
      console.log("Setting P2 animation...");
      setPlayer2Animation(player2AnimationIndex);
      
      // Actualizar el índice principal para la UI DESPUÉS de aplicar las animaciones
      console.log(`Updating animationIndex from ${animationIndex} to ${index}`);
      setAnimationIndex(index); // El índice principal sigue siendo el de Player 1 para la UI
      
      // Verificación adicional después de un pequeño delay
      setTimeout(() => {
        console.log(`Verification - Current animationIndex: ${animationIndex}, Expected: ${index}`);
        console.log(`P1 Animation Index: ${player1AnimationIndex}, P2 Animation Index: ${player2AnimationIndex}`);
      }, 50);
      
      console.log("Dance sync completed");
    } else {
      // En modo combate, usar la lógica original (ambos iguales)
      let animationToUse = index;
      
      if (animations.length > 0) {
        const animationName = animations[index];
        // Si la animación seleccionada no es idle, usar una animación de baile
        if (animationName && !animationName.toLowerCase().includes('idle')) {
          const danceAnimations = Object.values(peteAnimations.dance);
          const randomDance = danceAnimations[index % danceAnimations.length];
          animationToUse = findAnimationIndex(randomDance);
        }
      }
      
      // Usar las funciones protegidas para evitar cambiar animaciones de jugadores muertos
      setPlayer1Animation(animationToUse);
      setPlayer2Animation(animationToUse);
      setAnimationIndex(animationToUse);
    }
  };

  // Función para inicializar combate con animación intro
  const initializeCombat = () => {
    console.log("Initializing combat mode with intro animation - Pete vs Tyler");
    resetHealth(); // Resetear vida y stamina al iniciar combate (esto revive a todos)
    
    // Resetear flag de victoria para nueva sesión de combate
    setVictoryCountedThisRound(false);
    console.log("🔄 Victory flag reset for new combat session");
    
    // Limpiar timeout anterior del intro si existe
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    
    // Primero mostrar la animación intro para ambos jugadores
    const player1IntroIndex = findAnimationIndex("intro", 1);
    const player2IntroIndex = findAnimationIndex("intro", 2);
    setPlayer1AnimationIndex(player1IntroIndex);
    setPlayer2AnimationIndex(player2IntroIndex);
    
    console.log("Playing intro animation for both players - Pete and Tyler");
    
    // Después de 3 segundos, cambiar a idle de combate
    introTimeoutRef.current = setTimeout(() => {
      const player1CombatIdleIndex = findAnimationIndex("idleFight", 1);
      const player2CombatIdleIndex = findAnimationIndex("idleFight", 2);
      setPlayer1AnimationIndex(player1CombatIdleIndex);
      setPlayer2AnimationIndex(player2CombatIdleIndex);
      console.log("Intro finished - Pete (Player 1) and Tyler (Player 2) now in combat idle, ready to fight!");
      
      // Iniciar IA después de que termine la intro
      if (isAIEnabled) {
        setTimeout(() => {
          startAI();
        }, 1000); // Esperar 1 segundo adicional antes de que la IA empiece a actuar
      }
      
      introTimeoutRef.current = null; // Limpiar la referencia
    }, 3000); // 3 segundos para la animación intro
  };

  // Función para limpiar completamente el estado de combate
  const cleanupCombatState = () => {
    console.log("=== CLEANING UP COMBAT STATE ===");
    
    // Detener IA inmediatamente
    stopAI();
    
    // Limpiar todos los timeouts e intervals
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
      attackTimeoutRef.current = null;
    }
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    if (player1BlockTimeoutRef.current) {
      clearTimeout(player1BlockTimeoutRef.current);
      player1BlockTimeoutRef.current = null;
    }
    if (player2BlockTimeoutRef.current) {
      clearTimeout(player2BlockTimeoutRef.current);
      player2BlockTimeoutRef.current = null;
    }
    if (player1StaminaRegenRef.current) {
      clearInterval(player1StaminaRegenRef.current);
      player1StaminaRegenRef.current = null;
    }
    if (player2StaminaRegenRef.current) {
      clearInterval(player2StaminaRegenRef.current);
      player2StaminaRegenRef.current = null;
    }
    if (player1BlockStaminaRef.current) {
      clearInterval(player1BlockStaminaRef.current);
      player1BlockStaminaRef.current = null;
    }
    if (player2BlockStaminaRef.current) {
      clearInterval(player2BlockStaminaRef.current);
      player2BlockStaminaRef.current = null;
    }
    
    // Resetear estados de bloqueo
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    
    // Volver a idle normal según el modo para cada personaje
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    
    // Solo cambiar animación si no están muertos
    if (!player1IsDead) {
      setPlayer1AnimationIndex(player1IdleIndex);
    }
    if (!player2IsDead) {
      setPlayer2AnimationIndex(player2IdleIndex);
    }
    
    console.log("Combat state cleaned up - Pete (Player 1) and Tyler (Player 2) ready");
  };

  // Limpiar timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
      if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
      if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
      if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
      if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
      if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
      if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
      if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
      if (aiActionTimeoutRef.current) clearTimeout(aiActionTimeoutRef.current);
    };
  }, []);

  // Manejar cambios de modo entre combate y baile
  useEffect(() => {
    if (animations.length === 0) return; // Esperar a que las animaciones estén cargadas
    
    if (isCombatMode) {
      // En modo combate, no hacer nada aquí ya que initializeCombat() maneja la secuencia intro
      // La función initializeCombat() se llama explícitamente desde la UI cuando se inicia combate
      console.log("Combat mode activated - waiting for initializeCombat() call");
    } else {
      // Limpiar completamente el estado de combate al cambiar a modo baile
      cleanupCombatState();
      
      // Resetear animationIndex para que ningún botón aparezca activo inicialmente
      setAnimationIndex(-1);
      
      // En modo baile, mantener ambos jugadores en idle normal
      // No activar automáticamente ningún baile específico
      setTimeout(() => {
        const idleIndex = findAnimationIndex("idle");
        setPlayer1AnimationIndex(idleIndex);
        setPlayer2AnimationIndex(idleIndex);
        console.log("Both players set to idle for dance mode");
      }, 100); // Pequeño delay para asegurar que el estado se limpie primero
    }
  }, [isCombatMode, animations]);

  // useEffect para manejar cambios en el estado de IA
  useEffect(() => {
    console.log(`AI State Changed: isAIEnabled=${isAIEnabled}, isCombatMode=${isCombatMode}`);
    
    if (isAIEnabled && isCombatMode && !player1IsDead && !player2IsDead) {
      console.log("AI enabled during combat - starting AI behavior");
      // Pequeño delay para asegurar que el combate esté completamente inicializado
      setTimeout(() => {
        startAI();
      }, 500);
    } else if (!isAIEnabled) {
      console.log("AI disabled - stopping AI behavior");
      stopAI();
    }
  }, [isAIEnabled, isCombatMode, player1IsDead, player2IsDead]);

  // useEffect para detener IA cuando el combate termina (algún jugador muere)
  useEffect(() => {
    if (player1IsDead || player2IsDead) {
      console.log("Combat ended - stopping AI automatically");
      stopAI();
    }
  }, [player1IsDead, player2IsDead]);

  // useEffect para debuggear cambios en el contador de victorias
  useEffect(() => {
    console.log(`🎯 PLAYER 1 WINS COUNTER CHANGED: ${player1Wins}`);
  }, [player1Wins]);

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
        triggerPlayer1Attack,
        triggerPlayer2Attack,
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
        reviveLosingPlayer,
        
        // Sistema de stamina
        player1Stamina,
        player2Stamina,
        maxStamina: MAX_STAMINA,
        
        // Estados de muerte
        player1IsDead,
        player2IsDead,
        
        // Contador de victorias
        player1Wins,
        
        // Flag para debug (temporal)
        victoryCountedThisRound,
        
        // Sistema de bloqueo/defensa
        player1IsBlocking,
        player2IsBlocking,
        togglePlayer1Block,
        togglePlayer2Block,
        
        // Sistema de IA para Player 2
        isAIEnabled,
        setIsAIEnabled,
        aiDifficulty,
        setAIDifficulty,
        startAI,
        stopAI,
        makeAIDecision, // Para debug
        
        // Constantes para la UI
        staminaCosts,
      }}
    >
      {props.children}
    </CharacterAnimationsContext.Provider>
  );
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationsContext);
};
