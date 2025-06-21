import { Affix, Button, Group, Switch, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import MusicPlayer from "./MusicPlayer";

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
    { name: "punch", label: "Puñetazo", emoji: "👊", shortcut: "Q" },
    { name: "kick", label: "Patada", emoji: "🦵", shortcut: "W" },
    { name: "punches", label: "Combo", emoji: "💥", shortcut: "E" }
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
  
  // CSS para la animación de countdown y efectos del pad de pelea
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
      
      @keyframes pulse {
        0% {
          opacity: 0.4;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
        100% {
          opacity: 0.4;
          transform: scale(1);
        }
      }
      
      @keyframes glow {
        0% {
          box-shadow: 0 0 5px rgba(4, 203, 238, 0.5);
        }
        50% {
          box-shadow: 0 0 20px rgba(4, 203, 238, 0.8), 0 0 30px rgba(4, 203, 238, 0.6);
        }
        100% {
          box-shadow: 0 0 5px rgba(4, 203, 238, 0.5);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
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
      {/* Reproductor de Música - Siempre visible en esquina superior derecha */}
      <Affix position={{ 
        top: isMobile ? 5 : 10, 
        right: isMobile ? 5 : 10 
      }}>
        <MusicPlayer />
      </Affix>

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
            top: isMobile ? 40 : 50, 
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

      {/* Controles de combate - PAD DE PELEA MEJORADO */}
      {isCombatMode && !isCombatOver && (
        <>
          {/* PAD DE PELEA PRINCIPAL - Diseño Arcade Profesional */}
          <Affix position={{ 
            bottom: isMobile ? 10 : 30, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Box style={{ 
              textAlign: "center",
              backgroundColor: "transparent",
              borderRadius: isMobile ? "15px" : "20px",
              padding: isMobile ? "15px" : "30px",
              border: "none",
              boxShadow: "none",
              backdropFilter: "blur(10px)",
              maxWidth: isMobile ? "95vw" : "auto",
              width: isMobile ? "95vw" : "auto"
            }}>
              <Stack spacing={isMobile ? "md" : "lg"} align="center">
                {/* Fila de Botones de Ataque - Optimizado para móvil */}
                <Group spacing={isMobile ? "xs" : "xl"} position="center" style={{
                  width: "100%",
                  justifyContent: "space-around"
                }}>
                  {attackButtons.map((attack, index) => {
                    const canUseAttack = canAttack(player1Stamina, attack.name, player1IsDead, player1IsBlocking);
                    const staminaCost = staminaCosts[attack.name] || 0;
                    
                    return (
                      <Box
                        key={`p1-${attack.name}`}
                        style={{
                          position: "relative",
                          transform: canUseAttack ? "scale(1)" : "scale(0.95)",
                          transition: "all 0.2s ease",
                          flex: isMobile ? "1" : "none"
                        }}
                      >
                        {/* Efecto de brillo cuando está disponible */}
                        {canUseAttack && (
                          <Box
                            style={{
                              position: "absolute",
                              top: "-3px",
                              left: "-3px",
                              right: "-3px",
                              bottom: "-3px",
                              background: `linear-gradient(45deg, 
                                transparent, 
                                rgba(4, 203, 238, 0.3), 
                                transparent, 
                                rgba(4, 203, 238, 0.3), 
                                transparent
                              )`,
                              borderRadius: isMobile ? "10px" : "15px",
                              animation: "pulse 2s infinite",
                              zIndex: 0
                            }}
                          />
                        )}
                        
                        <Button
                          variant="outline"
                          size={isMobile ? "md" : "xl"}
                          disabled={!canUseAttack}
                          onClick={() => triggerPlayer1Attack(attack.name)}
                          style={{
                            position: "relative",
                            zIndex: 1,
                            fontSize: isMobile ? "11px" : "16px",
                            fontWeight: 700,
                            padding: isMobile ? "10px 8px" : "25px",
                            minWidth: isMobile ? "90px" : "150px",
                            width: isMobile ? "90px" : "150px",
                            height: isMobile ? "75px" : "120px",
                            backgroundColor: canUseAttack 
                              ? "transparent" 
                              : "transparent",
                            borderColor: canUseAttack ? "#04cbee" : "#666",
                            color: canUseAttack ? "#04cbee" : "#666",
                            borderWidth: isMobile ? "2px" : "3px",
                            borderRadius: isMobile ? "8px" : "12px",
                            textTransform: "uppercase",
                            cursor: canUseAttack ? "pointer" : "not-allowed",
                            boxShadow: canUseAttack 
                              ? `
                                0 ${isMobile ? "2px" : "4px"} ${isMobile ? "8px" : "15px"} rgba(4, 203, 238, 0.3),
                                0 0 ${isMobile ? "10px" : "20px"} rgba(4, 203, 238, 0.2),
                                inset 0 ${isMobile ? "1px" : "2px"} ${isMobile ? "5px" : "10px"} rgba(4, 203, 238, 0.1)
                              `
                              : "0 2px 5px rgba(0, 0, 0, 0.3)",
                            transition: "all 0.2s ease",
                            transform: canUseAttack ? "translateY(0)" : "translateY(2px)"
                          }}
                          onTouchStart={(e) => {
                            if (canUseAttack && isMobile) {
                              e.target.style.transform = "translateY(-2px) scale(1.02)";
                              e.target.style.boxShadow = `
                                0 4px 15px rgba(4, 203, 238, 0.4),
                                0 0 20px rgba(4, 203, 238, 0.3)
                              `;
                            }
                          }}
                          onTouchEnd={(e) => {
                            if (canUseAttack && isMobile) {
                              e.target.style.transform = "translateY(0) scale(1)";
                              e.target.style.boxShadow = `
                                0 2px 8px rgba(4, 203, 238, 0.3),
                                0 0 10px rgba(4, 203, 238, 0.2)
                              `;
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (canUseAttack && !isMobile) {
                              e.target.style.transform = "translateY(-3px) scale(1.05)";
                              e.target.style.boxShadow = `
                                0 8px 25px rgba(4, 203, 238, 0.4),
                                0 0 30px rgba(4, 203, 238, 0.3)
                              `;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (canUseAttack && !isMobile) {
                              e.target.style.transform = "translateY(0) scale(1)";
                              e.target.style.boxShadow = `
                                0 4px 15px rgba(4, 203, 238, 0.3),
                                0 0 20px rgba(4, 203, 238, 0.2)
                              `;
                            }
                          }}
                        >
                          <Stack spacing={isMobile ? 2 : 6} align="center">
                            {/* Emoji del ataque */}
                            <Text size={isMobile ? "lg" : "2xl"} style={{ 
                              filter: canUseAttack ? "none" : "grayscale(1)",
                              textShadow: canUseAttack ? "0 0 10px rgba(4, 203, 238, 0.5)" : "none"
                            }}>
                              {attack.emoji}
                            </Text>
                            
                            {/* Nombre del ataque - Más corto en móvil */}
                            <Text size={isMobile ? "xs" : "md"} weight={700} align="center" style={{
                              lineHeight: 1.1
                            }}>
                              {isMobile && attack.name === "punches" ? "COMBO" : attack.label}
                            </Text>
                            
                            {/* Tecla de acceso rápido */}
                            <Box style={{
                              backgroundColor: "transparent",
                              padding: isMobile ? "1px 4px" : "2px 8px",
                              borderRadius: "3px",
                              border: `1px solid ${canUseAttack ? "#04cbee" : "#666"}`
                            }}>
                              <Text size="xs" weight={600}>
                                {attack.shortcut}
                              </Text>
                            </Box>
                            
                            {/* Costo de stamina */}
                            {staminaCost > 0 && (
                              <Text 
                                size="xs" 
                                color={player1Stamina < staminaCost ? "#fc3f31" : "#04cbee"} 
                                weight={700}
                                style={{
                                  textShadow: player1Stamina < staminaCost 
                                    ? "0 0 5px #fc3f31" 
                                    : "0 0 5px #04cbee"
                                }}
                              >
                                ⚡{staminaCost}
                              </Text>
                            )}
                            
                            {/* Indicador de stamina insuficiente - Más compacto en móvil */}
                            {!canUseAttack && player1Stamina < staminaCost && (
                              <Text size="xs" color="#fc3f31" weight={600} style={{
                                fontSize: isMobile ? "8px" : "12px"
                              }}>
                                {isMobile ? "SIN ⚡" : "SIN STAMINA"}
                              </Text>
                            )}
                          </Stack>
                        </Button>
                      </Box>
                    );
                  })}
                </Group>
              </Stack>
            </Box>
          </Affix>

          {/* Botón de Bloqueo - Estilo Arcade Mejorado */}
          <Affix position={{ 
            bottom: isMobile ? 120 : 220, 
            left: isMobile ? 10 : 40
          }}>
            <Box style={{ position: "relative" }}>
              {/* Efecto de brillo para bloqueo */}
              {player1IsBlocking && (
                <Box
                  style={{
                    position: "absolute",
                    top: isMobile ? "-4px" : "-8px",
                    left: isMobile ? "-4px" : "-8px",
                    right: isMobile ? "-4px" : "-8px",
                    bottom: isMobile ? "-4px" : "-8px",
                    background: `radial-gradient(circle, 
                      rgba(4, 203, 238, 0.4) 0%, 
                      transparent 70%
                    )`,
                    borderRadius: isMobile ? "12px" : "20px",
                    animation: "pulse 1s infinite",
                    zIndex: 0
                  }}
                />
              )}
              
              <Button
                variant="outline"
                size={isMobile ? "sm" : "xl"}
                disabled={!canBlock(player1Stamina, player1IsDead)}
                onClick={togglePlayer1Block}
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: isMobile ? "10px" : "14px",
                  fontWeight: 700,
                  padding: isMobile ? "8px 12px" : "20px 25px",
                  minWidth: isMobile ? "70px" : "120px",
                  height: isMobile ? "60px" : "100px",
                  backgroundColor: player1IsBlocking 
                    ? "transparent" 
                    : canBlock(player1Stamina, player1IsDead)
                      ? "transparent"
                      : "transparent",
                  borderColor: player1IsBlocking ? "#04cbee" : canBlock(player1Stamina, player1IsDead) ? "#04cbee" : "#666",
                  color: player1IsBlocking ? "white" : canBlock(player1Stamina, player1IsDead) ? "#04cbee" : "#666",
                  borderWidth: isMobile ? "2px" : "3px",
                  borderRadius: isMobile ? "10px" : "15px",
                  textTransform: "uppercase",
                  boxShadow: player1IsBlocking 
                    ? `
                      0 0 ${isMobile ? "10px" : "20px"} rgba(4, 203, 238, 0.6),
                      0 0 ${isMobile ? "20px" : "40px"} rgba(4, 203, 238, 0.4),
                      inset 0 0 ${isMobile ? "10px" : "20px"} rgba(4, 203, 238, 0.2)
                    `
                    : canBlock(player1Stamina, player1IsDead)
                      ? `0 ${isMobile ? "2px" : "4px"} ${isMobile ? "8px" : "15px"} rgba(4, 203, 238, 0.3)`
                      : "0 2px 5px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                <Stack spacing={isMobile ? 2 : 4} align="center">
                  <Text size={isMobile ? "md" : "xl"} style={{
                    filter: canBlock(player1Stamina, player1IsDead) ? "none" : "grayscale(1)",
                    textShadow: player1IsBlocking ? "0 0 10px rgba(255, 255, 255, 0.8)" : "none"
                  }}>
                    🛡️
                  </Text>
                  <Text size="xs" weight={700} style={{
                    fontSize: isMobile ? "8px" : "12px"
                  }}>
                    {player1IsBlocking ? (isMobile ? "ON" : "BLOQUEANDO") : (isMobile ? "BLOCK" : "BLOQUEAR")}
                  </Text>
                  {player1IsBlocking && (
                    <Text size="xs" color="yellow" weight={700} style={{
                      textShadow: "0 0 5px yellow",
                      fontSize: isMobile ? "7px" : "10px"
                    }}>
                      {isMobile ? "●" : "ACTIVO"}
                    </Text>
                  )}
                  {!canBlock(player1Stamina, player1IsDead) && (
                    <Text size="xs" style={{ 
                      color: "#fc3f31",
                      fontSize: isMobile ? "7px" : "10px"
                    }}>
                      {isMobile ? "NO ⚡" : "SIN STAMINA"}
                    </Text>
                  )}
                  {/* Indicador de tecla */}
                  <Box style={{
                    backgroundColor: "transparent",
                    padding: isMobile ? "1px 3px" : "2px 6px",
                    borderRadius: "2px",
                    border: "1px solid #04cbee"
                  }}>
                    <Text size="xs" weight={600} style={{
                      fontSize: isMobile ? "7px" : "10px"
                    }}>
                      {isMobile ? "SPC" : "SPACE"}
                    </Text>
                  </Box>
                </Stack>
              </Button>
            </Box>
          </Affix>

          {/* Panel de Control - Derecha */}
          <Affix position={{ 
            bottom: isMobile ? 120 : 220, 
            right: isMobile ? 10 : 40
          }}>
            <Stack spacing={isMobile ? "xs" : "md"} align="center">
              {/* Estado del combate */}
              {isCombatOver && (
                <Text size={isMobile ? "xs" : "md"} color="yellow" weight={700} align="center" style={{
                  textShadow: "0 0 10px yellow",
                  fontSize: isMobile ? "10px" : "16px"
                }}>
                  {player1IsDead ? "💀" : "🏆"}
                </Text>
              )}
              
              {/* Botón de Reset mejorado */}
              <Button
                variant="outline"
                size={isMobile ? "xs" : "lg"}
                onClick={resetHealth}
                style={{ 
                  fontSize: isMobile ? "9px" : "13px",
                  fontWeight: 700,
                  padding: isMobile ? "6px 8px" : "15px 20px",
                  backgroundColor: "transparent",
                  borderColor: "#04cbee",
                  color: "#04cbee",
                  borderWidth: isMobile ? "1px" : "2px",
                  borderRadius: isMobile ? "6px" : "10px",
                  textTransform: "uppercase",
                  boxShadow: `0 ${isMobile ? "2px" : "4px"} ${isMobile ? "5px" : "10px"} rgba(4, 203, 238, 0.3)`,
                  transition: "all 0.2s ease",
                  minWidth: isMobile ? "60px" : "auto",
                  height: isMobile ? "50px" : "auto"
                }}
              >
                <Stack spacing={isMobile ? 1 : 3} align="center">
                  <Text size={isMobile ? "sm" : "xl"}>
                    {isCombatOver ? "🔄" : "💚"}
                  </Text>
                  <Text size="xs" style={{
                    fontSize: isMobile ? "7px" : "12px",
                    lineHeight: 1
                  }}>
                    {isCombatOver ? (isMobile ? "NEW" : "NUEVO COMBATE") : (isMobile ? "RESET" : "RESET VIDA")}
                  </Text>
                  {/* Indicador de tecla */}
                  <Box style={{
                    backgroundColor: "transparent",
                    padding: isMobile ? "0px 2px" : "1px 4px",
                    borderRadius: "1px",
                    border: "1px solid #04cbee"
                  }}>
                    <Text size="xs" weight={600} style={{
                      fontSize: isMobile ? "6px" : "10px"
                    }}>R</Text>
                  </Box>
                </Stack>
              </Button>
            </Stack>
          </Affix>
        </>
      )}
    </>
  );
};

export default Interface;
