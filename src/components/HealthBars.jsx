import { Box, Progress, Text, Group, Stack } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

const HealthBars = () => {
  const { 
    player1Health, 
    player2Health, 
    maxHealth, 
    isCombatMode,
    player1IsDead,
    player2IsDead
  } = useCharacterAnimations();

  // No mostrar las barras si no estamos en modo combate
  if (!isCombatMode) return null;

  // Calcular porcentajes de vida
  const player1Percentage = (player1Health / maxHealth) * 100;
  const player2Percentage = (player2Health / maxHealth) * 100;

  // Determinar colores según el nivel de vida
  const getHealthColor = (percentage, isDead) => {
    if (isDead) return "dark";
    if (percentage > 60) return "green";
    if (percentage > 30) return "yellow";
    return "red";
  };

  return (
    <Box
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "8px",
        minWidth: "400px",
      }}
    >
      <Stack spacing="md">
        {/* Player 1 Health */}
        <Box>
          <Group position="apart" mb="xs">
            <Text color="white" weight={500}>
              Player 1 {player1IsDead && <Text span color="red" weight={700}>(MUERTO)</Text>}
            </Text>
            <Text color="white" size="sm">{player1Health}/{maxHealth}</Text>
          </Group>
          <Progress
            value={player1Percentage}
            color={getHealthColor(player1Percentage, player1IsDead)}
            size="xl"
            radius="sm"
            animate={!player1IsDead}
          />
        </Box>

        {/* Player 2 Health */}
        <Box>
          <Group position="apart" mb="xs">
            <Text color="white" weight={500}>
              Player 2 {player2IsDead && <Text span color="red" weight={700}>(MUERTO)</Text>}
            </Text>
            <Text color="white" size="sm">{player2Health}/{maxHealth}</Text>
          </Group>
          <Progress
            value={player2Percentage}
            color={getHealthColor(player2Percentage, player2IsDead)}
            size="xl"
            radius="sm"
            animate={!player2IsDead}
          />
        </Box>

        {/* Game Over Message */}
        {(player1IsDead || player2IsDead) && (
          <Box style={{ textAlign: "center" }}>
            <Text color="red" weight={700} size="lg">
              {player1IsDead ? "Player 2 Wins!" : "Player 1 Wins!"}
            </Text>
            <Text color="yellow" size="sm" style={{ marginTop: "5px" }}>
              Animación de muerte activada
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default HealthBars; 