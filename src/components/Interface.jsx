import { Affix, Button, Group, Switch, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

const Interface = () => {
  const { 
    animations, 
    animationIndex, 
    setAnimationIndex,
    isCombatMode,
    setIsCombatMode,
    triggerPlayer1Attack,
    triggerPlayer2Attack,
    triggerSyncAnimation,
    initializeCombat,
    resetHealth,
    player1Health,
    player2Health,
    player1Stamina,
    player2Stamina,
    maxStamina,
    player1IsDead,
    player2IsDead,
    player1IsBlocking,
    player2IsBlocking,
    togglePlayer1Block,
    togglePlayer2Block,
    staminaCosts
  } = useCharacterAnimations();

  // Media queries para responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Botones de ataque para modo combate - usando las animaciones reales de Pete
  const attackButtons = [
    { name: "punch", label: "Puñetazo", emoji: "👊" },
    { name: "kick", label: "Patada", emoji: "🦵" },
    { name: "punches", label: "Combo Puñetazos", emoji: "💥" }
  ];

  // Animaciones de baile - solo estas en modo sincronizado
  const danceAnimations = [
    "celebration",
    "dance1", 
    "dance2",
    "dance3",
    "dance4",
    "dance5",
    "dance6",
    "intro"
  ];

  // Función para verificar si una animación es de baile
  const isDanceAnimation = (animationName) => {
    return danceAnimations.some(dance => 
      animationName.toLowerCase().includes(dance.toLowerCase())
    );
  };

  // Filtrar solo animaciones de baile para el modo sincronizado
  const filteredAnimations = animations.filter(isDanceAnimation);

  // Manejar cambio de modo
  const handleModeChange = (event) => {
    const combatMode = event.currentTarget.checked;
    setIsCombatMode(combatMode);
    
    // Si se activa modo combate, inicializar ambos en idle
    if (combatMode) {
      initializeCombat();
    }
  };

  // Determinar si el combate ha terminado
  const isCombatOver = player1IsDead || player2IsDead;

  // Función para verificar si un ataque está disponible
  const canAttack = (playerStamina, attackName, isPlayerDead, isPlayerBlocking) => {
    if (isPlayerDead || isPlayerBlocking || isCombatOver) return false;
    const cost = staminaCosts[attackName] || 0;
    return playerStamina >= cost;
  };

  // Función para verificar si se puede bloquear
  const canBlock = (playerStamina, isPlayerDead) => {
    return !isPlayerDead && playerStamina > 0;
  };
  
  // CSS para la animación de countdown
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes countdown {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Mensaje de Victoria - Overlay cuando termina el combate */}
      {isCombatOver && isCombatMode && (
        <Affix position={{ 
          top: "50%", 
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Box style={{
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            padding: isMobile ? "20px" : "40px",
            borderRadius: "16px",
            border: "4px solid gold",
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.8)",
            textAlign: "center",
            minWidth: isMobile ? "280px" : "400px"
          }}>
            <Stack spacing="md" align="center">
              <Text size={isMobile ? "xl" : "2xl"} weight={700} color="gold">
                🏆 ¡VICTORIA! 🏆
              </Text>
              <Text size={isMobile ? "lg" : "xl"} weight={600} color="white">
                {player1IsDead ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!"}
              </Text>
              
              {/* Toggle de modo - Solo aparece en el modal de victoria */}
              <Box style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: isMobile ? "12px" : "16px",
                borderRadius: "8px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                marginTop: "16px"
              }}>
                <Stack spacing="md" align="center">
                  <Text size={isMobile ? "sm" : "md"} color="gray">
                    ¿Qué quieres hacer ahora?
                  </Text>
                  
                  {/* Botones de acción */}
                  <Group spacing="md" position="center">
                    {/* Botón Volver a Pelear */}
                    <Button
                      variant="gradient"
                      gradient={{ from: 'red', to: 'orange' }}
                      size={isMobile ? "sm" : "md"}
                      onClick={() => {
                        resetHealth();
                        initializeCombat();
                      }}
                      style={{
                        fontSize: isMobile ? "11px" : "13px",
                        fontWeight: 700,
                        padding: isMobile ? "8px 12px" : "12px 16px"
                      }}
                    >
                      <Stack spacing={2} align="center">
                        <Text size={isMobile ? "md" : "lg"}>⚔️</Text>
                        <Text size={isMobile ? "xs" : "sm"}>
                          VOLVER A PELEAR
                        </Text>
                      </Stack>
                    </Button>

                    {/* Botón Modo Baile */}
                    <Button
                      variant="gradient"
                      gradient={{ from: 'violet', to: 'purple' }}
                      size={isMobile ? "sm" : "md"}
                      onClick={() => setIsCombatMode(false)}
                      style={{
                        fontSize: isMobile ? "11px" : "13px",
                        fontWeight: 700,
                        padding: isMobile ? "8px 12px" : "12px 16px"
                      }}
                    >
                      <Stack spacing={2} align="center">
                        <Text size={isMobile ? "md" : "lg"}>🕺</Text>
                        <Text size={isMobile ? "xs" : "sm"}>
                          CELEBRAR BAILANDO
                        </Text>
                      </Stack>
                    </Button>
                  </Group>
                  
                  <Text size="xs" color="gray" align="center">
                    Elige tu próxima acción
                  </Text>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Affix>
      )}

      {/* Controles de animación de baile - Solo en modo sincronizado - CENTRO ARRIBA */}
      {!isCombatMode && (
        <>
          <Affix position={{ 
            top: isMobile ? 60 : 80, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Box style={{ 
              maxWidth: isMobile ? "340px" : isTablet ? "600px" : "800px",
              textAlign: "center"
            }}>
              <Stack spacing="xs">
                <Text size={isMobile ? "xs" : "sm"} weight={500} color="violet">
                  🕺 Animaciones de Baile 💃
                </Text>
                <Group spacing={isMobile ? "xs" : "sm"} position="center">
                  {filteredAnimations.map((animation, index) => {
                    // Encontrar el índice original en el array completo de animaciones
                    const originalIndex = animations.findIndex(anim => anim === animation);
                    
                    return (
                      <Button
                        key={animation}
                        variant={originalIndex === animationIndex ? "filled" : "light"}
                        color="violet"
                        size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                        onClick={() => setAnimationIndex(originalIndex)}
                        style={{
                          fontSize: isMobile ? "10px" : "12px",
                          padding: isMobile ? "4px 8px" : "8px 12px"
                        }}
                      >
                        {isMobile 
                          ? animation.substring(0, 6) + (animation.length > 6 ? "..." : "")
                          : animation
                        }
                      </Button>
                    );
                  })}
                </Group>
              </Stack>
            </Box>
          </Affix>

          {/* Botón para iniciar combate - ABAJO CENTRO */}
          <Affix position={{ 
            bottom: isMobile ? 20 : 30, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Button
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
              size={isMobile ? "md" : "lg"}
              onClick={() => setIsCombatMode(true)}
              style={{
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: 700,
                padding: isMobile ? "12px 20px" : "16px 24px",
                boxShadow: "0 4px 12px rgba(255, 0, 0, 0.3)"
              }}
            >
              <Stack spacing={4} align="center">
                <Text size={isMobile ? "lg" : "xl"}>⚔️</Text>
                <Text size={isMobile ? "sm" : "md"}>INICIAR COMBATE</Text>
              </Stack>
            </Button>
          </Affix>
        </>
      )}

      {/* Controles de combate - Solo Player 1 */}
      {isCombatMode && !isCombatOver && (
        <>
          {/* Botones de ataque - CENTRO HORIZONTAL */}
          <Affix position={{ 
            bottom: isMobile ? 80 : 100, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Box style={{ textAlign: "center" }}>
              <Stack spacing="xs" align="center">
                <Text size={isMobile ? "sm" : "md"} weight={600} color="blue">
                  ⚔️ ATAQUES PLAYER 1
                </Text>
                
                {/* Botones de ataque en horizontal */}
                <Group spacing={isMobile ? "xs" : "sm"} position="center">
                  {attackButtons.map((attack) => {
                    const canUseAttack = canAttack(player1Stamina, attack.name, player1IsDead, player1IsBlocking);
                    const staminaCost = staminaCosts[attack.name] || 0;
                    
                    return (
                      <Button
                        key={`p1-${attack.name}`}
                        variant="filled"
                        color="blue"
                        size={isMobile ? "sm" : isTablet ? "md" : "lg"}
                        disabled={!canUseAttack}
                        onClick={() => triggerPlayer1Attack(attack.name)}
                        style={{
                          fontSize: isMobile ? "10px" : "12px",
                          padding: isMobile ? "8px 12px" : "12px 16px",
                          opacity: !canUseAttack ? 0.5 : 1,
                          minWidth: isMobile ? "70px" : "90px"
                        }}
                      >
                        <Stack spacing={2} align="center">
                          <Text size={isMobile ? "sm" : "md"} weight={700}>
                            {attack.emoji}
                          </Text>
                          <Text size={isMobile ? "xs" : "sm"}>
                            {isMobile 
                              ? attack.label.substring(0, 4) + (attack.label.length > 4 ? "..." : "")
                              : attack.label
                            }
                          </Text>
                          {staminaCost > 0 && (
                            <Text size="xs" color={player1Stamina < staminaCost ? "red" : "lightblue"}>
                              ⚡{staminaCost}
                            </Text>
                          )}
                        </Stack>
                      </Button>
                    );
                  })}
                </Group>
              </Stack>
            </Box>
          </Affix>

          {/* Botón de bloqueo - IZQUIERDA */}
          <Affix position={{ 
            bottom: isMobile ? 140 : 180, 
            left: isMobile ? 10 : 20 
          }}>
            <Box>
              <Button
                variant={player1IsBlocking ? "filled" : "outline"}
                color="orange"
                size={isMobile ? "sm" : "md"}
                disabled={!canBlock(player1Stamina, player1IsDead)}
                onClick={togglePlayer1Block}
                style={{
                  fontSize: isMobile ? "10px" : "12px",
                  padding: isMobile ? "8px 12px" : "12px 16px",
                  fontWeight: 700,
                  opacity: !canBlock(player1Stamina, player1IsDead) ? 0.5 : 1
                }}
              >
                <Stack spacing={2} align="center">
                  <Text size={isMobile ? "md" : "lg"}>🛡️</Text>
                  <Text size={isMobile ? "xs" : "sm"}>
                    {player1IsBlocking ? "DEJAR" : "BLOQUEAR"}
                  </Text>
                  {player1IsBlocking && (
                    <Text size="xs" color="yellow" weight={700}>
                      ACTIVO
                    </Text>
                  )}
                  {!player1IsBlocking && player1Stamina <= 0 && !player1IsDead && (
                    <Text size="xs" color="red">
                      Sin stamina
                    </Text>
                  )}
                </Stack>
              </Button>
            </Box>
          </Affix>

          {/* Estado del combate y Reset - DERECHA */}
          <Affix position={{ 
            bottom: isMobile ? 140 : 180, 
            right: isMobile ? 10 : 20
          }}>
            <Box>
              <Stack spacing="xs" align="center">
                {/* Estado del combate */}
                {isCombatOver && (
                  <Text size={isMobile ? "xs" : "sm"} color="yellow" weight={600} align="center">
                    {player1IsDead ? "💀 P1 Muerto" : 
                     player2IsDead ? "🏆 P1 Ganó" : ""}
                  </Text>
                )}
                
                {/* Botón de Reset */}
                <Button
                  variant="outline"
                  color="green"
                  size={isMobile ? "sm" : "md"}
                  onClick={resetHealth}
                  style={{ 
                    fontSize: isMobile ? "10px" : "12px",
                    fontWeight: 600,
                    padding: isMobile ? "8px 12px" : "12px 16px"
                  }}
                >
                  <Stack spacing={2} align="center">
                    <Text size={isMobile ? "md" : "lg"}>
                      {isCombatOver ? "🔄" : "💚"}
                    </Text>
                    <Text size={isMobile ? "xs" : "sm"}>
                      {isCombatOver ? "NUEVO" : "RESET"}
                    </Text>
                    <Text size={isMobile ? "xs" : "sm"}>
                      {isCombatOver ? "COMBATE" : "VIDA"}
                    </Text>
                  </Stack>
                </Button>
              </Stack>
            </Box>
          </Affix>

          {/* Información de stamina - ARRIBA CENTRO */}
          {!isCombatOver && (
            <Affix position={{ 
              bottom: isMobile ? 200 : 260, 
              left: "50%",
              transform: "translateX(-50%)"
            }}>
              <Box style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: isMobile ? "4px 8px" : "6px 12px",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.3)"
              }}>
                <Text size="xs" color="gray" align="center">
                  {isMobile ? "🛡️ 5s máx • 💥 30⚡" : "🛡️ Bloqueo: máx 5s • 💥 Golpe fuerte: 30⚡"}
                </Text>
              </Box>
            </Affix>
          )}
        </>
      )}
    </>
  );
};

export default Interface;
