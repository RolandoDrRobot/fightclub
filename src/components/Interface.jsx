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
    player1IsDead,
    player2IsDead,
    player1IsBlocking,
    player2IsBlocking,
    togglePlayer1Block,
    togglePlayer2Block
  } = useCharacterAnimations();

  // Media queries para responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Botones de ataque para modo combate
  const attackButtons = [
    { name: "punch", label: "Puñetazo" },
    { name: "kick", label: "Patada" },
    { name: "strong", label: "Golpe Fuerte" },
    { name: "uppercut", label: "Uppercut" }
  ];

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

      {/* Controles de animación - Solo en modo sincronizado */}
      {!isCombatMode && (
        <Affix position={{ 
          top: isMobile ? 50 : 70, 
          right: isMobile ? 10 : 20 
        }}>
          <Box style={{ maxWidth: isMobile ? "300px" : isTablet ? "400px" : "auto" }}>
            <Stack spacing="xs">
              <Text size={isMobile ? "xs" : "sm"} weight={500}>
                Animaciones:
              </Text>
              <Group spacing={isMobile ? "xs" : "sm"}>
                {animations.map((animation, index) => (
                  <Button
                    key={animation}
                    variant={index === animationIndex ? "filled" : "light"}
                    size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                    onClick={() => setAnimationIndex(index)}
                    style={{
                      fontSize: isMobile ? "10px" : "12px",
                      padding: isMobile ? "4px 8px" : "8px 12px"
                    }}
                  >
                    {isMobile 
                      ? animation.substring(0, 6) + (animation.length > 6 ? "..." : "")
                      : animation
                    } {index === animations.length - 1 ? "(Muerte)" : ""}
                    {index === 1 ? "(Bloqueo)" : ""}
                  </Button>
                ))}
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
                  disabled={player1IsDead}
                  onClick={togglePlayer1Block}
                  style={{
                    fontSize: isMobile ? "9px" : "11px",
                    padding: isMobile ? "4px 6px" : "6px 10px",
                    fontWeight: 700
                  }}
                >
                  🛡️ {player1IsBlocking ? "DEJAR BLOQUEO" : "BLOQUEAR"}
                </Button>
                
                <Stack spacing={isMobile ? "xs" : "sm"}>
                  {attackButtons.map((attack) => (
                    <Button
                      key={`p1-${attack.name}`}
                      variant="filled"
                      color="blue"
                      size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                      disabled={isCombatOver || player1IsBlocking}
                      onClick={() => triggerPlayer1Attack(attack.name)}
                      style={{
                        fontSize: isMobile ? "9px" : "11px",
                        padding: isMobile ? "4px 6px" : "6px 10px"
                      }}
                    >
                      {isMobile 
                        ? attack.label.substring(0, 6) + (attack.label.length > 6 ? "..." : "")
                        : attack.label
                      }
                    </Button>
                  ))}
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
                  disabled={player2IsDead}
                  onClick={togglePlayer2Block}
                  style={{
                    fontSize: isMobile ? "9px" : "11px",
                    padding: isMobile ? "4px 6px" : "6px 10px",
                    fontWeight: 700
                  }}
                >
                  🛡️ {player2IsBlocking ? "DEJAR BLOQUEO" : "BLOQUEAR"}
                </Button>
                
                <Stack spacing={isMobile ? "xs" : "sm"}>
                  {attackButtons.map((attack) => (
                    <Button
                      key={`p2-${attack.name}`}
                      variant="filled"
                      color="red"
                      size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                      disabled={isCombatOver || player2IsBlocking}
                      onClick={() => triggerPlayer2Attack(attack.name)}
                      style={{
                        fontSize: isMobile ? "9px" : "11px",
                        padding: isMobile ? "4px 6px" : "6px 10px"
                      }}
                    >
                      {isMobile 
                        ? attack.label.substring(0, 6) + (attack.label.length > 6 ? "..." : "")
                        : attack.label
                      }
                    </Button>
                  ))}
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
