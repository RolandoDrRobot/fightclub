import { Affix, Button, Group, Switch, Text, Stack } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

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
      {/* Toggle de modo */}
      <Affix position={{ top: 20, left: 20 }}>
        <Stack spacing="xs">
          <Switch
            checked={isCombatMode}
            onChange={handleModeChange}
            label={
              <Text size="sm" weight={500}>
                {isCombatMode ? "Modo Combate" : "Modo Sincronizado"}
              </Text>
            }
          />
        </Stack>
      </Affix>

      {/* Controles de combate */}
      {isCombatMode && (
        <Affix position={{ top: 80, left: 20 }}>
          <Stack spacing="xs">
            <Text size="sm" weight={500}>Ataques Player 1:</Text>
            <Group>
              {attackButtons.map((attack) => (
                <Button
                  key={attack.name}
                  variant="filled"
                  color="red"
                  disabled={isCombatOver}
                  onClick={() => triggerAttack(attack.name)}
                >
                  {attack.label}
                </Button>
              ))}
            </Group>
            
            {/* Estado del combate */}
            {isCombatOver && (
              <Text size="sm" color="red" weight={500}>
                {player1IsDead ? "Player 1 está muerto - usando animación de muerte" : 
                 player2IsDead ? "Player 2 está muerto - usando animación de muerte" : ""}
              </Text>
            )}
            
            {/* Botón de Reset */}
            <Button
              variant="outline"
              color="blue"
              onClick={resetHealth}
              style={{ marginTop: "10px" }}
            >
              {isCombatOver ? "Nuevo Combate" : "Reset Vida"}
            </Button>
          </Stack>
        </Affix>
      )}

      {/* Controles de animación (modo normal o sincronizado) */}
      <Affix position={{ bottom: 50, right: 20 }}>
        <Stack spacing="xs">
          <Text size="sm" weight={500}>
            {isCombatMode ? "Animaciones Sincronizadas:" : "Animaciones:"}
          </Text>
          <Group>
            {animations.map((animation, index) => (
              <Button
                key={animation}
                variant={index === animationIndex ? "filled" : "light"}
                onClick={() => 
                  isCombatMode 
                    ? triggerSyncAnimation(index)
                    : setAnimationIndex(index)
                }
              >
                {animation} {index === animations.length - 1 ? "(Muerte)" : ""}
              </Button>
            ))}
          </Group>
        </Stack>
      </Affix>
    </>
  );
};

export default Interface;
