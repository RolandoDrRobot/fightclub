import { Affix, Button, Group, Switch, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import MusicPlayer from "./MusicPlayer";
import punchImg from "../assets/punch.png";
import kickImg from "../assets/kick.png";
import comboImg from "../assets/combo.png";
import coverImg from "../assets/cover.png";
import resetImg from "../assets/reset.png";
import danceImg from "../assets/dance.png";
import fightImg from "../assets/fight.png";

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
    reviveLosingPlayer,
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
    { name: "punch", label: "Puñetazo", image: punchImg, shortcut: "Q" },
    { name: "kick", label: "Patada", image: kickImg, shortcut: "W" },
    { name: "punches", label: "Combo", image: comboImg, shortcut: "E" }
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

  // Combinaciones de bailes predefinidas
  const danceCombinations = [
    { name: "COMBO 1", dances: ["dance1", "dance3", "dance5"] },
    { name: "COMBO 2", dances: ["dance2", "dance4", "dance6"] },
    { name: "COMBO 3", dances: ["dance1", "dance2", "dance3"] },
    { name: "COMBO 4", dances: ["dance4", "dance5", "dance6"] },
    { name: "COMBO 5", dances: ["dance6", "dance1", "dance4"] },
    { name: "COMBO 6", dances: ["dance3", "dance5", "dance2"] }
  ];

  // Estado para el combo actual y el baile dentro del combo
  const [currentComboIndex, setCurrentComboIndex] = React.useState(0);
  const [currentDanceInCombo, setCurrentDanceInCombo] = React.useState(0);
  const [isPlayingCombo, setIsPlayingCombo] = React.useState(false);

  // Función para alternar entre combinaciones de bailes
  const toggleDanceCombination = () => {
    if (!isPlayingCombo) {
      // Iniciar combo
      setIsPlayingCombo(true);
      setCurrentDanceInCombo(0);
      const currentCombo = danceCombinations[currentComboIndex];
      const firstDance = currentCombo.dances[0];
      const danceIndex = animations.findIndex(anim => anim === firstDance);
      if (danceIndex !== -1) {
        triggerSyncAnimation(danceIndex);
      }
    } else {
      // Continuar con el siguiente baile en el combo o siguiente combo
      const currentCombo = danceCombinations[currentComboIndex];
      const nextDanceIndex = (currentDanceInCombo + 1) % currentCombo.dances.length;
      
      if (nextDanceIndex === 0) {
        // Terminó el combo actual, pasar al siguiente
        const nextComboIndex = (currentComboIndex + 1) % danceCombinations.length;
        setCurrentComboIndex(nextComboIndex);
        setCurrentDanceInCombo(0);
        
        const nextCombo = danceCombinations[nextComboIndex];
        const nextDance = nextCombo.dances[0];
        const danceIndex = animations.findIndex(anim => anim === nextDance);
        if (danceIndex !== -1) {
          triggerSyncAnimation(danceIndex);
        }
      } else {
        // Siguiente baile en el mismo combo
        setCurrentDanceInCombo(nextDanceIndex);
        const nextDance = currentCombo.dances[nextDanceIndex];
        const danceIndex = animations.findIndex(anim => anim === nextDance);
        if (danceIndex !== -1) {
          triggerSyncAnimation(danceIndex);
        }
      }
    }
  };

  // Función para detener el combo (click derecho o botón secundario)
  const stopDanceCombo = () => {
    setIsPlayingCombo(false);
    setAnimationIndex(-1);
    setCurrentComboIndex(0);
    setCurrentDanceInCombo(0);
  };

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
      
      @keyframes neonPulse {
        0% {
          box-shadow: 
            0 0 10px #fc3f31,
            0 0 20px rgba(252, 63, 49, 0.3),
            0 4px 8px rgba(252, 63, 49, 0.2),
            inset 0 0 10px rgba(252, 63, 49, 0.05);
        }
        50% {
          box-shadow: 
            0 0 25px #fc3f31,
            0 0 50px rgba(252, 63, 49, 0.8),
            0 4px 20px rgba(252, 63, 49, 0.5),
            inset 0 0 25px rgba(252, 63, 49, 0.2);
        }
        100% {
          box-shadow: 
            0 0 10px #fc3f31,
            0 0 20px rgba(252, 63, 49, 0.3),
            0 4px 8px rgba(252, 63, 49, 0.2),
            inset 0 0 10px rgba(252, 63, 49, 0.05);
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
      <MusicPlayer />

      {/* Mensaje de Victoria - Overlay cuando termina el combate */}
      {isCombatOver && isCombatMode && (
        <Affix position={{ 
          top: "75%", 
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Box style={{
            backgroundColor: "transparent",
            padding: isMobile ? "30px 60px" : "50px 80px",
            borderRadius: "20px",
            border: "none",
            boxShadow: "none",
            textAlign: "center",
            width: isMobile ? "90vw" : "400px",
            maxWidth: isMobile ? "90vw" : "400px"
          }}>
            <Stack spacing="lg" align="center">
              <Text size={isMobile ? "xl" : "2xl"} weight={700} style={{ 
                color: player1IsDead ? "#fc3f31" : "#F5F5DC",
                textShadow: `
                  0 0 5px ${player1IsDead ? "#fc3f31" : "#F5F5DC"},
                  0 0 10px ${player1IsDead ? "#fc3f31" : "#F5F5DC"},
                  0 0 15px ${player1IsDead ? "rgba(252, 63, 49, 0.8)" : "rgba(245, 245, 220, 0.8)"}
                `
              }}>
                🏆 {player1IsDead ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!"} 🏆
              </Text>
              
              {/* Botones de acción */}
              <Group spacing="xs" position="center" style={{ width: "100%" }}>
                {/* Botón Modo Baile */}
                <img 
                  src={danceImg}
                  alt="Dance"
                  onClick={() => setIsCombatMode(false)}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    cursor: "pointer",
                    flex: 1
                  }}
                />

                {/* Botón Volver a Pelear */}
                <img 
                  src={fightImg}
                  alt="Fight"
                  onClick={() => {
                    resetHealth();
                    initializeCombat();
                  }}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    cursor: "pointer",
                    flex: 1
                  }}
                />
              </Group>

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
            <div style={{ textAlign: "center" }}>
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
              
              {/* Subtítulo con la primera regla */}
              <div style={{
                color: "#F5F5DC",
                textShadow: `
                  0 0 2px #F5F5DC,
                  0 0 4px rgba(245, 245, 220, 0.6),
                  1px 1px 2px rgba(0,0,0,0.8)
                `,
                fontFamily: "Anton, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                marginTop: "8px",
                letterSpacing: "1px"
              }}>
                You do not talk about fight club
              </div>
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
                {/* Botón único para combinaciones de bailes */}
                <Stack spacing="xs" style={{ width: "100vw", margin: "auto", padding: "15px 15px 0 15px" }}>
                  <Group spacing="md" position="right" style={{ width: "100%" }}>
                    <Button
                      variant="unstyled"
                      size="lg"
                      onClick={toggleDanceCombination}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        stopDanceCombo();
                      }}
                      style={{
                        padding: "0",
                        backgroundColor: "transparent",
                        border: "none",
                        width: isMobile ? "60px" : "80px",
                        height: isMobile ? "60px" : "80px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        borderRadius: "10px"
                      }}
                      styles={{
                        label: {
                          borderRadius: "10px"
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          e.target.style.transform = "scale(1.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.target.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <img 
                        src={danceImg}
                        alt="Dance"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                          pointerEvents: "none"
                        }}
                      />
                    </Button>
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
                    fontSize: "28px",
                    fontWeight: 700,
                    padding: "10px",
                    minHeight: "80px",
                    boxShadow: `
                      0 0 15px #fc3f31,
                      0 0 30px rgba(252, 63, 49, 0.5),
                      0 4px 12px rgba(252, 63, 49, 0.3),
                      inset 0 0 15px rgba(252, 63, 49, 0.1)
                    `,
                    textShadow: `
                      0 0 5px #fc3f31,
                      0 0 10px #fc3f31,
                      0 0 20px rgba(252, 63, 49, 0.8)
                    `,
                    width: "90%",
                    margin: "auto",
                    marginTop: "12px",
                    backgroundColor: "transparent",
                    borderColor: "#fc3f31",
                    border: "3px solid #fc3f31",
                    borderRadius: "15px",
                    color: "#fc3f31",
                    textTransform: "uppercase",
                    animation: "neonPulse 2s ease-in-out infinite"
                  }}
                >
                  START COMBAT
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
                        <Button
                          variant="outline"
                          size={isMobile ? "md" : "xl"}
                          disabled={!canUseAttack}
                          onClick={() => triggerPlayer1Attack(attack.name)}
                          style={{
                            position: "relative",
                            zIndex: 1,
                            padding: "0",
                            minHeight: "120px",
                            minWidth: "100px",
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            cursor: canUseAttack ? "pointer" : "not-allowed",
                            opacity: canUseAttack ? 1 : 0.5,
                            transition: "all 0.2s ease",
                            overflow: "hidden",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "none"
                          }}
                          onTouchStart={(e) => {
                            if (canUseAttack && isMobile) {
                              e.target.style.transform = "scale(0.95)";
                            }
                          }}
                          onTouchEnd={(e) => {
                            if (canUseAttack && isMobile) {
                              e.target.style.transform = "scale(1)";
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (canUseAttack && !isMobile) {
                              e.target.style.transform = "scale(1.05)";
                              e.target.style.boxShadow = "none";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (canUseAttack && !isMobile) {
                              e.target.style.transform = "scale(1)";
                              e.target.style.boxShadow = "none";
                            }
                          }}
                        >
                          <img 
                            src={attack.image}
                            alt={attack.label}
                            style={{
                              width: "90%",
                              height: "90%",
                              objectFit: "contain",
                              filter: canUseAttack ? "none" : "grayscale(1)",
                              pointerEvents: "none",
                              borderRadius: "4px"
                            }}
                          />
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
            bottom: isMobile ? 135 : 220, 
            left: isMobile ? 10 : 40
          }}>
            <Box style={{ position: "relative" }}>
                <Button
                variant="outline"
                size={isMobile ? "sm" : "xl"}
                disabled={!canBlock(player1Stamina, player1IsDead)}
                onClick={togglePlayer1Block}
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "0",
                  width: isMobile ? "70px" : "120px",
                  height: isMobile ? "60px" : "100px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: isMobile ? "12px" : "15px",
                  cursor: canBlock(player1Stamina, player1IsDead) ? "pointer" : "not-allowed",
                  opacity: canBlock(player1Stamina, player1IsDead) ? 1 : 0.5,
                  transition: "all 0.2s ease",
                  overflow: "hidden",
                  boxShadow: "none",
                  flexShrink: 0
                }}
              >
                <img 
                  src={coverImg}
                  alt="Block"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: canBlock(player1Stamina, player1IsDead) ? "none" : "grayscale(1)",
                    pointerEvents: "none"
                  }}
                />
                      </Button>
            </Box>
          </Affix>

          {/* Panel de Control - Derecha */}
          <Affix position={{ 
            bottom: isMobile ? 145 : 220, 
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
                  padding: "0",
                  backgroundColor: "transparent",
                  border: `2px solid #42cf52`,
                  borderRadius: isMobile ? "10px" : "15px",
                  transition: "all 0.2s ease",
                  width: isMobile ? "60px" : "120px",
                  height: isMobile ? "50px" : "100px",
                  cursor: "pointer",
                  overflow: "hidden",
                  boxShadow: "none",
                  flexShrink: 0
                }}
              >
                <img 
                  src={resetImg}
                  alt="Reset"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none"
                  }}
                />
              </Button>
              
              {/* Botón para revivir solo al jugador perdedor - Solo visible cuando hay un ganador */}
              {isCombatOver && (
                <Button
                  variant="outline"
                  size={isMobile ? "xs" : "lg"}
                  onClick={reviveLosingPlayer}
                  style={{ 
                    padding: isMobile ? "4px 8px" : "8px 12px",
                    backgroundColor: "transparent",
                    border: `3px solid #fc3f31`,
                    borderRadius: isMobile ? "10px" : "15px",
                    transition: "all 0.2s ease",
                    minWidth: isMobile ? "60px" : "120px",
                    height: isMobile ? "40px" : "80px",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: `
                      0 0 10px #fc3f31,
                      0 0 20px rgba(252, 63, 49, 0.4),
                      inset 0 0 10px rgba(252, 63, 49, 0.1)
                    `,
                    fontSize: isMobile ? "8px" : "12px",
                    fontWeight: 700,
                    color: "#fc3f31",
                    textTransform: "uppercase",
                    textShadow: "0 0 5px #fc3f31"
                  }}
                >
                  {isMobile ? "REVIVE" : "REVIVE LOSER"}
                </Button>
              )}
              </Stack>
          </Affix>
        </>
      )}
    </>
  );
};

export default Interface;
