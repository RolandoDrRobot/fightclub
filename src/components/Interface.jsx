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
    triggerAttack,
    triggerSyncAnimation,
    initializeCombat,
    resetHealth,
    player1Health,
    player2Health,
    player1IsDead,
    player2IsDead
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
                  </Button>
                ))}
              </Group>
            </Stack>
          </Box>
        </Affix>
      )}

      {/* Controles de combate - Solo en modo combate */}
      {isCombatMode && (
        <Affix position={{ 
          bottom: isMobile ? 10 : 20, 
          left: isMobile ? 10 : 20 
        }}>
          <Box style={{ maxWidth: isMobile ? "350px" : isTablet ? "500px" : "auto" }}>
            <Stack spacing="xs">
              <Text size={isMobile ? "xs" : "sm"} weight={500}>
                Ataques Player 1:
              </Text>
              
              <Group spacing={isMobile ? "xs" : "sm"}>
                {attackButtons.map((attack) => (
                  <Button
                    key={attack.name}
                    variant="filled"
                    color="red"
                    size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                    disabled={isCombatOver}
                    onClick={() => triggerAttack(attack.name)}
                    style={{
                      fontSize: isMobile ? "10px" : "12px",
                      padding: isMobile ? "4px 8px" : "8px 12px"
                    }}
                  >
                    {isMobile 
                      ? attack.label.substring(0, 8) + (attack.label.length > 8 ? "..." : "")
                      : attack.label
                    }
                  </Button>
                ))}
              </Group>
              
              {/* Estado del combate - Responsive */}
              {isCombatOver && (
                <Text size={isMobile ? "xs" : "sm"} color="red" weight={500}>
                  {player1IsDead ? "P1 muerto - animación muerte" : 
                   player2IsDead ? "P2 muerto - animación muerte" : ""}
                </Text>
              )}
              
              {/* Botón de Reset - Responsive */}
              <Button
                variant="outline"
                color="blue"
                size={isMobile ? "xs" : isTablet ? "sm" : "md"}
                onClick={resetHealth}
                style={{ 
                  marginTop: isMobile ? "5px" : "10px",
                  fontSize: isMobile ? "10px" : "12px"
                }}
              >
                {isCombatOver ? "Nuevo Combate" : "Reset Vida"}
              </Button>
            </Stack>
          </Box>
        </Affix>
      )}
    </>
  );
};

export default Interface;
