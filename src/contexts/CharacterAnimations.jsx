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
  
  // Estados de defensa/bloqueo
  const [player1IsBlocking, setPlayer1IsBlocking] = useState(false);
  const [player2IsBlocking, setPlayer2IsBlocking] = useState(false);
  
  // Referencias para timeouts y intervals
  const attackTimeoutRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const player1BlockTimeoutRef = useRef(null);
  const player2BlockTimeoutRef = useRef(null);
  const player1StaminaRegenRef = useRef(null);
  const player2StaminaRegenRef = useRef(null);
  const player1BlockStaminaRef = useRef(null);
  const player2BlockStaminaRef = useRef(null);

  // Función para encontrar índice de animación por nombre exacto
  const findAnimationIndex = (animationName) => {
    const index = animations.findIndex(anim => anim === animationName);
    if (index >= 0) {
      return index;
    }
    
    // Si no encuentra la animación exacta, buscar por nombre similar
    const fallbackIndex = animations.findIndex(anim => 
      anim.toLowerCase().includes(animationName.toLowerCase())
    );
    
    return fallbackIndex >= 0 ? fallbackIndex : 0; // Fallback a la primera animación
  };

  // Función para obtener animación específica según el modo
  const getAnimationForMode = (animationType) => {
    if (isCombatMode) {
      // En modo combate, usar animaciones de pelea
      const combatAnim = peteAnimations.combat[animationType];
      if (combatAnim) {
        return findAnimationIndex(combatAnim);
      }
      // Si no encuentra la animación, usar idleFight como fallback
      return findAnimationIndex("idleFight");
    } else {
      // Fuera de combate, usar animaciones de baile para movimientos básicos
      if (animationType === "idle") {
        // Buscar idle normal primero, si no existe usar la primera animación
        const idleIndex = findAnimationIndex("idle");
        return idleIndex > 0 ? idleIndex : 0;
      }
      
      // Para otros movimientos, usar animaciones de baile
      const danceAnimations = Object.values(peteAnimations.dance);
      const randomDance = danceAnimations[Math.floor(Math.random() * danceAnimations.length)];
      return findAnimationIndex(randomDance);
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

  // Función para obtener índice de animación de muerte usando Pete
  const getDeathAnimationIndex = () => {
    return findAnimationIndex("die");
  };

  // Función para obtener índice de animación de bloqueo usando Pete
  const getBlockAnimationIndex = () => {
    return findAnimationIndex("cover");
  };

  // Función para aplicar animación con verificación de muerte
  const setPlayer1Animation = (index) => {
    console.log(`setPlayer1Animation called with index: ${index}, player1IsDead: ${player1IsDead}`);
    if (player1IsDead) {
      console.log("Player 1 is dead - cannot change animation from death");
      return;
    }
    console.log(`Setting Player 1 animation to index: ${index}`);
    setPlayer1AnimationIndex(index);
  };

  const setPlayer2Animation = (index) => {
    console.log(`setPlayer2Animation called with index: ${index}, player2IsDead: ${player2IsDead}`);
    if (player2IsDead) {
      console.log("Player 2 is dead - cannot change animation from death");
      return;
    }
    console.log(`Setting Player 2 animation to index: ${index}`);
    setPlayer2AnimationIndex(index);
  };

  // Función para volver ambos personajes a idle
  const returnToIdle = () => {
    console.log("Attempting to return players to idle");
    
    // Determinar qué animación idle usar según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight") : findAnimationIndex("idle");
    
    // Solo volver a idle si no están muertos y no están bloqueando
    if (!player1IsDead && !player1IsBlocking) {
      console.log("Player 1 returning to idle");
      setPlayer1AnimationIndex(idleIndex);
    } else if (player1IsBlocking) {
      console.log("Player 1 is blocking - staying in block animation");
    } else {
      console.log("Player 1 is dead - staying in death animation");
    }
    
    if (!player2IsDead && !player2IsBlocking) {
      console.log("Player 2 returning to idle");
      setPlayer2AnimationIndex(idleIndex);
    } else if (player2IsBlocking) {
      console.log("Player 2 is blocking - staying in block animation");
    } else {
      console.log("Player 2 is dead - staying in death animation");
    }
  };

  // Función para detener bloqueo del Player 1
  const stopPlayer1Block = () => {
    console.log("Player 1 stops blocking");
    setPlayer1IsBlocking(false);
    
    // Usar la animación idle correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight") : findAnimationIndex("idle");
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
    console.log("=== Player 2 STOPPING BLOCK ===");
    setPlayer2IsBlocking(false);
    
    // Usar la animación idle correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight") : findAnimationIndex("idle");
    setPlayer2Animation(idleIndex);
    
    // Limpiar completamente todos los timeouts e intervals del bloqueo
    if (player2BlockTimeoutRef.current) {
      console.log("Player 2 - Clearing block timeout");
      clearTimeout(player2BlockTimeoutRef.current);
      player2BlockTimeoutRef.current = null;
    }
    if (player2BlockStaminaRef.current) {
      console.log("Player 2 - Clearing stamina drain interval");
      clearInterval(player2BlockStaminaRef.current);
      player2BlockStaminaRef.current = null;
    }
    
    // VERIFICACIÓN ADICIONAL: Asegurar que no hay regeneración activa
    if (player2StaminaRegenRef.current) {
      console.log("Player 2 - FOUND ACTIVE REGEN DURING STOP, clearing it");
      clearInterval(player2StaminaRegenRef.current);
      player2StaminaRegenRef.current = null;
    }
    
    console.log("Player 2 - Block stopped, will start regen after delay");
    
    // IMPORTANTE: Iniciar regeneración solo después de limpiar todo y verificar estado
    setTimeout(() => {
      console.log(`Player 2 - Checking if can start regen: isBlocking=${player2IsBlocking}`);
      if (!player2IsBlocking) { // Verificar que realmente no esté bloqueando
        startPlayer2StaminaRegen();
      } else {
        console.log("Player 2 - CANCELLED regen start, player is blocking again");
      }
    }, 150); // Aumentar delay para mayor seguridad
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
      setPlayer1Animation(getBlockAnimationIndex());
      
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
      setPlayer2Animation(getBlockAnimationIndex());
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
        setPlayer1AnimationIndex(getDeathAnimationIndex());
      }
      
      return newHealth;
    });
  };

  // Función para aplicar daño al jugador 2
  const applyDamageToPlayer2 = (attackType) => {
    // Si Player 2 está bloqueando, no recibe daño
    if (player2IsBlocking) {
      console.log("Player 2 is blocking - no damage taken!");
      return;
    }

    const damage = attackDamage[attackType] || 10;
    setPlayer2Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      console.log(`Player 2 receives ${damage} damage. Health: ${newHealth}/${maxHealth}`);
      
      // Verificar si Player 2 muere
      if (newHealth <= 0 && !player2IsDead) {
        console.log("Player 2 has died! Setting permanent death animation");
        setPlayer2IsDead(true);
        setPlayer2IsBlocking(false); // No puede bloquear si está muerto
        stopPlayer2Block(); // Detener bloqueo si estaba activo
        // Activar animación de muerte inmediatamente y de forma permanente
        setPlayer2AnimationIndex(getDeathAnimationIndex());
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
    
    // Limpiar todos los timeouts e intervals
    if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
    if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
    if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
    if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
    if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
    if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
    
    // Volver ambos a idle usando la animación correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight") : findAnimationIndex("idle");
    setPlayer1AnimationIndex(idleIndex);
    setPlayer2AnimationIndex(idleIndex);
    
    console.log("All players revived and returned to idle");
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
    console.log("Initializing combat mode with intro animation");
    resetHealth(); // Resetear vida y stamina al iniciar combate (esto revive a todos)
    
    // Limpiar timeout anterior del intro si existe
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    
    // Primero mostrar la animación intro para ambos jugadores
    const introIndex = findAnimationIndex("intro");
    setPlayer1AnimationIndex(introIndex);
    setPlayer2AnimationIndex(introIndex);
    
    console.log("Playing intro animation for both players");
    
    // Después de 3 segundos, cambiar a idle de combate
    introTimeoutRef.current = setTimeout(() => {
      const combatIdleIndex = findAnimationIndex("idleFight");
      setPlayer1AnimationIndex(combatIdleIndex);
      setPlayer2AnimationIndex(combatIdleIndex);
      console.log("Intro finished - both players now in combat idle, ready to fight!");
      introTimeoutRef.current = null; // Limpiar la referencia
    }, 3000); // 3 segundos para la animación intro
  };

  // Función para limpiar completamente el estado de combate
  const cleanCombatState = () => {
    console.log("Cleaning combat state completely");
    
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
    
    // Resetear todos los estados
    setPlayer1IsDead(false);
    setPlayer2IsDead(false);
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    setPlayer1Health(maxHealth);
    setPlayer2Health(maxHealth);
    setPlayer1Stamina(MAX_STAMINA);
    setPlayer2Stamina(MAX_STAMINA);
    
    console.log("Combat state cleaned");
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
      cleanCombatState();
      
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
        
        // Sistema de stamina
        player1Stamina,
        player2Stamina,
        maxStamina: MAX_STAMINA,
        
        // Estados de muerte
        player1IsDead,
        player2IsDead,
        
        // Sistema de bloqueo/defensa
        player1IsBlocking,
        player2IsBlocking,
        togglePlayer1Block,
        togglePlayer2Block,
        
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
