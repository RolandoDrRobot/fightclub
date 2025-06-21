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
    "dance1", 
    "dance2",
    "dance3",
    "dance4",
    "dance5",
    "dance6"
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
          bottom: isMobile ? 35 : 55, 
          left: "50%",
          transform: "translateX(-50%)"
        }}>
          <Box style={{
            backgroundColor: "transparent",
            padding: isMobile ? "20px" : "40px",
            borderRadius: "16px",
            border: "3px solid #fc3f31",
            boxShadow: "0 0 30px rgba(252, 63, 49, 0.8)",
            textAlign: "center",
            width: "94vw",
            maxWidth: isMobile ? "94vw" : "400px"
          }}>
            <Stack spacing="md" align="center">
              <Text size={isMobile ? "xl" : "2xl"} weight={700} style={{ color: player1IsDead ? "#fc3f31" : "#04cbee" }}>
                🏆 {player1IsDead ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!"} 🏆
              </Text>
              
              {/* Botones de acción */}
              <Group spacing="md" position="center" style={{ width: "100%" }}>
                {/* Botón Volver a Pelear */}
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "md"}
                  onClick={() => {
                    resetHealth();
                    initializeCombat();
                  }}
                  style={{
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: 700,
                    padding: isMobile ? "8px 12px" : "12px 16px",
                    backgroundColor: "transparent",
                    borderColor: "#fc3f31",
                    color: "#fc3f31",
                    textTransform: "uppercase",
                    borderWidth: "3px",
                    flex: 1
                  }}
                >
                  <Stack spacing={2} align="center">
                    <Text size={isMobile ? "md" : "lg"} style={{ color: "#fc3f31" }}>⚔️</Text>
                    <Text size={isMobile ? "xs" : "sm"} style={{ color: "#fc3f31" }}>
                      VOLVER A PELEAR
                    </Text>
                  </Stack>
                </Button>

                {/* Botón Modo Baile */}
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "md"}
                  onClick={() => setIsCombatMode(false)}
                  style={{
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: 700,
                    padding: isMobile ? "8px 12px" : "12px 16px",
                    backgroundColor: "transparent",
                    borderColor: "#04cbee",
                    color: "#04cbee",
                    textTransform: "uppercase",
                    borderWidth: "3px",
                    flex: 1
                  }}
                >
                  <Stack spacing={2} align="center">
                    <Text size={isMobile ? "md" : "lg"} style={{ color: "#04cbee" }}>🕺</Text>
                    <Text size={isMobile ? "xs" : "sm"} style={{ color: "#04cbee" }}>
                      CELEBRAR BAILANDO
                    </Text>
                  </Stack>
                </Button>
              </Group>

              <Text size={isMobile ? "sm" : "md"} color="white">
                ¿Qué quieres hacer ahora?
              </Text>
            </Stack>
          </Box>
        </Affix>
      )}

      {/* Controles de animación de baile - Solo en modo sincronizado - CENTRO ARRIBA */}
      {!isCombatMode && (
        <>
          {/* Título Fight Club - ARRIBA CENTRO */}
          <Affix position={{ 
            top: isMobile ? 25 : 35, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <div style={{ 
              color: "#fc3f31",
              textShadow: `
                0 0 3px #fc3f31,
                0 0 6px #fc3f31,
                2px 2px 4px rgba(0,0,0,0.8)
              `,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontFamily: "Anton, sans-serif",
              fontSize: "50px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {"FIGHT CLUB".split("").map((letter, index) => (
                <span 
                  key={index}
                  style={{
                    display: "inline-block",
                    margin: letter === " " ? "0 8px" : "0"
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </div>
          </Affix>

          {/* Botones de baile - ABAJO CENTRO */}
          <Affix position={{ 
            bottom: isMobile ? 35 : 45, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Box style={{ 
              maxWidth: isMobile ? "100%" : "400px",
              width: isMobile ? "100%" : "400px",
              textAlign: "center",
              padding: isMobile ? "0 10px" : "0",
              margin: "0 auto"
            }}>
              <Stack spacing="xs">
                {/* Organizar botones en 1 fila */}
                <Stack spacing="xs" style={{ width: "100vw", margin: "auto", padding: "15px 15px 0 15px" }}>
                  {/* Una sola fila - 6 botones */}
                  <Group spacing={isMobile ? "xs" : "sm"} position="center" style={{ width: "100%" }}>
                    {filteredAnimations.map((animation, index) => {
                      // Encontrar el índice original en el array completo de animaciones
                      const originalIndex = animations.findIndex(anim => anim === animation);
                      const isActive = originalIndex === animationIndex;
                      
                      return (
                        <Button
                          key={animation}
                          variant={isActive ? "filled" : "outline"}
                          color="#04cbee"
                          size="sm"
                          onClick={() => triggerSyncAnimation(originalIndex)}
                          style={{
                            fontSize: isMobile ? "9px" : "11px",
                            fontWeight: "bold",
                            padding: "0px",
                            height: isMobile ? "30px" : "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            lineHeight: 1,
                            backgroundColor: "transparent",
                            textTransform: "uppercase",
                            flex: 1,
                            borderWidth: "3px",
                            borderRadius: "6px",
                            borderColor: isActive ? "#fc3f31" : "#04cbee",
                            color: isActive ? "#fc3f31" : "#04cbee",
                            textShadow: isActive 
                              ? `0 0 3px #fc3f31, 0 0 6px #fc3f31`
                              : `0 0 2px #04cbee, 0 0 4px #04cbee`,
                            boxShadow: isActive
                              ? `0 0 3px #fc3f31, 0 0 6px rgba(252, 63, 49, 0.3)`
                              : `0 0 3px #04cbee, 0 0 6px rgba(4, 203, 238, 0.2)`
                          }}
                        >
                          {isMobile 
                            ? animation.substring(0, 5) + (animation.length > 5 ? "..." : "")
                            : animation.length > 8 
                              ? animation.substring(0, 8) + "..."
                              : animation
                          }
                        </Button>
                      );
                    })}
                  </Group>
                </Stack>

                {/* Botón para iniciar combate - ABAJO DE LOS BOTONES DE BAILE */}
                <Button
                  variant="outline"
                  size={isMobile ? "md" : "lg"}
                  onClick={() => {
                    setIsCombatMode(true);
                    initializeCombat();
                  }}
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: 700,
                    padding: "10px",
                    minHeight: "60px",
                    boxShadow: `
                      0 4px 12px rgba(252, 63, 49, 0.3),
                      0 0 5px #fc3f31,
                      0 0 10px #fc3f31
                    `,
                    textShadow: `
                      0 0 3px #fc3f31,
                      0 0 6px #fc3f31
                    `,
                    width: "90%",
                    margin: "auto",
                    marginTop: "12px",
                    backgroundColor: "transparent",
                    borderColor: "#fc3f31",
                    border: "3px solid #fc3f31",
                    borderRadius: "8px",
                    color: "#fc3f31",
                    textTransform: "uppercase"
                  }}
                >
                  👊 INICIAR COMBATE
                </Button>
              </Stack>
            </Box>
          </Affix>
        </>
      )}

      {/* Controles de combate - Solo Player 1 */}
      {isCombatMode && !isCombatOver && (
        <>
          {/* Botones de ataque - CENTRO HORIZONTAL */}
          <Affix position={{ 
            bottom: isMobile ? 55 : 75, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Box style={{ textAlign: "center" }}>
              <Stack spacing="xs" align="center">
                {/* Botones de ataque en horizontal */}
                <Group spacing={isMobile ? "sm" : "md"} position="center">
                  {attackButtons.map((attack) => {
                    const canUseAttack = canAttack(player1Stamina, attack.name, player1IsDead, player1IsBlocking);
                    const staminaCost = staminaCosts[attack.name] || 0;
                    
                    return (
                      <Button
                        key={`p1-${attack.name}`}
                        variant="outline"
                        size={isMobile ? "md" : "lg"}
                        disabled={!canUseAttack}
                        onClick={() => triggerPlayer1Attack(attack.name)}
                        style={{
                          fontSize: isMobile ? "12px" : "14px",
                          padding: isMobile ? "12px 16px" : "16px 20px",
                          opacity: !canUseAttack ? 0.5 : 1,
                          minWidth: isMobile ? "90px" : "110px",
                          width: isMobile ? "90px" : "110px",
                          height: isMobile ? "70px" : "85px",
                          backgroundColor: "transparent",
                          borderColor: "#04cbee",
                          color: "#04cbee",
                          borderWidth: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "uppercase"
                        }}
                      >
                        <Stack spacing={4} align="center">
                          <Text size={isMobile ? "xs" : "sm"} weight={600} align="center">
                            {attack.label}
                          </Text>
                          {staminaCost > 0 && (
                            <Text size="xs" color={player1Stamina < staminaCost ? "#fc3f31" : "#04cbee"} weight={600}>
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
            bottom: isMobile ? 115 : 155, 
            left: isMobile ? 20 : 30 
          }}>
            <Box>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "md"}
                disabled={!canBlock(player1Stamina, player1IsDead)}
                onClick={togglePlayer1Block}
                style={{
                  fontSize: isMobile ? "10px" : "12px",
                  padding: isMobile ? "8px 12px" : "12px 16px",
                  fontWeight: 700,
                  opacity: !canBlock(player1Stamina, player1IsDead) ? 0.5 : 1,
                  backgroundColor: player1IsBlocking ? "#04cbee" : "transparent",
                  borderColor: "#04cbee",
                  color: player1IsBlocking ? "white" : "#04cbee",
                  textTransform: "uppercase"
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
                    <Text size="xs" style={{ color: "#fc3f31" }}>
                      Sin stamina
                    </Text>
                  )}
                </Stack>
              </Button>
            </Box>
          </Affix>

          {/* Estado del combate y Reset - DERECHA */}
          <Affix position={{ 
            bottom: isMobile ? 115 : 155, 
            right: isMobile ? 20 : 30
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
                  size={isMobile ? "sm" : "md"}
                  onClick={resetHealth}
                  style={{ 
                    fontSize: isMobile ? "10px" : "12px",
                    fontWeight: 600,
                    padding: isMobile ? "8px 12px" : "12px 16px",
                    backgroundColor: "transparent",
                    borderColor: "#04cbee",
                    color: "#04cbee",
                    textTransform: "uppercase"
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
        </>
      )}
    </>
  );
};

export default Interface;
