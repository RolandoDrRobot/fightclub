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
    triggerSyncAnimation
  } = useCharacterAnimations();

  // Botones de ataque para modo combate
  const attackButtons = [
    { name: "punch", label: "Puñetazo" },
    { name: "kick", label: "Patada" },
    { name: "strong", label: "Golpe Fuerte" },
    { name: "uppercut", label: "Uppercut" }
  ];
  
  return (
    <>
      {/* Toggle de modo */}
      <Affix position={{ top: 20, left: 20 }}>
        <Stack spacing="xs">
          <Switch
            checked={isCombatMode}
            onChange={(event) => setIsCombatMode(event.currentTarget.checked)}
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
                  onClick={() => triggerAttack(attack.name)}
                >
                  {attack.label}
                </Button>
              ))}
            </Group>
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
                {animation}
              </Button>
            ))}
          </Group>
        </Stack>
      </Affix>
    </>
  );
};

export default Interface;
