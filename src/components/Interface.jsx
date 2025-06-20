import { Affix, Button, Group, Switch, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";

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
  
  return (
    <>
      {/* Toggle de modo - Responsive */}
      <Affix position={{ 
        top: isMobile ? 10 : 20, 
        left: isMobile ? 10 : 20 
      }}>
        <Box style={{ maxWidth: isMobile ? "200px" : "auto" }}>
          <Switch
            checked={isCombatMode}
            onChange={handleModeChange}
            size={isMobile ? "sm" : "md"}
            label={
              <Text size={isMobile ? "xs" : "sm"} weight={500}>
                {isCombatMode ? "Modo Combate" : "Modo Sincronizado"}
              </Text>
            }
          />
        </Box>
      </Affix>

      {/* Controles de animación de baile - Solo en modo sincronizado - ABAJO */}
      {!isCombatMode && (
        <Affix position={{ 
          bottom: isMobile ? 10 : 20, 
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
      )}

      {/* Controles de combate - Solo en modo combate */}
      {isCombatMode && (
        <>
          {/* Ataques Player 1 - Izquierda */}
          <Affix position={{ 
            bottom: isMobile ? 10 : 20, 
            left: isMobile ? 10 : 20 
          }}>
            <Box style={{ maxWidth: isMobile ? "170px" : isTablet ? "200px" : "250px" }}>
              <Stack spacing="xs">
                <Text size={isMobile ? "xs" : "sm"} weight={500} color="blue">
                  Player 1 {player1IsBlocking && <Text span color="orange" weight={700}>(BLOQUEANDO)</Text>}
                </Text>
                
                {/* Botón de bloqueo Player 1 */}
                <Button
                  variant={player1IsBlocking ? "filled" : "outline"}
                  color="orange"
                  size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                  disabled={!canBlock(player1Stamina, player1IsDead)}
                  onClick={togglePlayer1Block}
                  style={{
                    fontSize: isMobile ? "9px" : "11px",
                    padding: isMobile ? "4px 6px" : "6px 10px",
                    fontWeight: 700,
                    opacity: !canBlock(player1Stamina, player1IsDead) ? 0.5 : 1
                  }}
                >
                  🛡️ {player1IsBlocking ? "DEJAR BLOQUEO" : "BLOQUEAR"}
                  {!player1IsBlocking && player1Stamina <= 0 && !player1IsDead && (
                    <Text span size="xs" color="red" style={{ display: "block" }}>
                      Sin stamina
                    </Text>
                  )}
                </Button>
                
                <Stack spacing={isMobile ? "xs" : "sm"}>
                  {attackButtons.map((attack) => {
                    const canUseAttack = canAttack(player1Stamina, attack.name, player1IsDead, player1IsBlocking);
                    const staminaCost = staminaCosts[attack.name] || 0;
                    
                    return (
                      <Button
                        key={`p1-${attack.name}`}
                        variant="filled"
                        color="blue"
                        size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                        disabled={!canUseAttack}
                        onClick={() => triggerPlayer1Attack(attack.name)}
                        style={{
                          fontSize: isMobile ? "9px" : "11px",
                          padding: isMobile ? "4px 6px" : "6px 10px",
                          opacity: !canUseAttack ? 0.5 : 1
                        }}
                      >
                        <Stack spacing={0} align="center">
                          <Text size={isMobile ? "xs" : "sm"}>
                            {attack.emoji} {isMobile 
                              ? attack.label.substring(0, 6) + (attack.label.length > 6 ? "..." : "")
                              : attack.label
                            }
                          </Text>
                          {staminaCost > 0 && (
                            <Text size="xs" color={player1Stamina < staminaCost ? "red" : "white"}>
                              ⚡{staminaCost}
                            </Text>
                          )}
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          </Affix>

          {/* Ataques Player 2 - Derecha */}
          <Affix position={{ 
            bottom: isMobile ? 10 : 20, 
            right: isMobile ? 10 : 20 
          }}>
            <Box style={{ maxWidth: isMobile ? "170px" : isTablet ? "200px" : "250px" }}>
              <Stack spacing="xs">
                <Text size={isMobile ? "xs" : "sm"} weight={500} color="red">
                  Player 2 {player2IsBlocking && <Text span color="orange" weight={700}>(BLOQUEANDO)</Text>}
                </Text>
                
                {/* Botón de bloqueo Player 2 */}
                <Button
                  variant={player2IsBlocking ? "filled" : "outline"}
                  color="orange"
                  size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                  disabled={!canBlock(player2Stamina, player2IsDead)}
                  onClick={togglePlayer2Block}
                  style={{
                    fontSize: isMobile ? "9px" : "11px",
                    padding: isMobile ? "4px 6px" : "6px 10px",
                    fontWeight: 700,
                    opacity: !canBlock(player2Stamina, player2IsDead) ? 0.5 : 1
                  }}
                >
                  🛡️ {player2IsBlocking ? "DEJAR BLOQUEO" : "BLOQUEAR"}
                  {!player2IsBlocking && player2Stamina <= 0 && !player2IsDead && (
                    <Text span size="xs" color="red" style={{ display: "block" }}>
                      Sin stamina
                    </Text>
                  )}
                </Button>
                
                <Stack spacing={isMobile ? "xs" : "sm"}>
                  {attackButtons.map((attack) => {
                    const canUseAttack = canAttack(player2Stamina, attack.name, player2IsDead, player2IsBlocking);
                    const staminaCost = staminaCosts[attack.name] || 0;
                    
                    return (
                      <Button
                        key={`p2-${attack.name}`}
                        variant="filled"
                        color="red"
                        size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                        disabled={!canUseAttack}
                        onClick={() => triggerPlayer2Attack(attack.name)}
                        style={{
                          fontSize: isMobile ? "9px" : "11px",
                          padding: isMobile ? "4px 6px" : "6px 10px",
                          opacity: !canUseAttack ? 0.5 : 1
                        }}
                      >
                        <Stack spacing={0} align="center">
                          <Text size={isMobile ? "xs" : "sm"}>
                            {attack.emoji} {isMobile 
                              ? attack.label.substring(0, 6) + (attack.label.length > 6 ? "..." : "")
                              : attack.label
                            }
                          </Text>
                          {staminaCost > 0 && (
                            <Text size="xs" color={player2Stamina < staminaCost ? "red" : "white"}>
                              ⚡{staminaCost}
                            </Text>
                          )}
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          </Affix>

          {/* Estado del combate y Reset - Centro abajo */}
          <Affix position={{ 
            bottom: isMobile ? 10 : 20, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Box style={{ textAlign: "center" }}>
              <Stack spacing="xs">
                {/* Estado del combate */}
                {isCombatOver && (
                  <Text size={isMobile ? "xs" : "sm"} color="yellow" weight={500}>
                    {player1IsDead ? "P1 muerto - animación muerte" : 
                     player2IsDead ? "P2 muerto - animación muerte" : ""}
                  </Text>
                )}
                
                {/* Información de stamina */}
                {!isCombatOver && (
                  <Text size="xs" color="gray">
                    {isMobile ? "🛡️ 5s máx • 💥 30⚡" : "🛡️ Bloqueo: máx 5s • 💥 Golpe fuerte: 30⚡"}
                  </Text>
                )}
                
                {/* Botón de Reset */}
                <Button
                  variant="outline"
                  color="green"
                  size={isMobile ? "sm" : isTablet ? "md" : "lg"}
                  onClick={resetHealth}
                  style={{ 
                    fontSize: isMobile ? "11px" : "13px",
                    fontWeight: 600
                  }}
                >
                  {isCombatOver ? "🔄 Nuevo Combate" : "💚 Reset Vida"}
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
