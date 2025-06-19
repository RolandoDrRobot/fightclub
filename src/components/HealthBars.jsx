import { Box, Progress, Text, Group, Stack } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";

const HealthBars = () => {
  const { 
    player1Health, 
    player2Health, 
    maxHealth, 
    isCombatMode,
    player1IsDead,
    player2IsDead
  } = useCharacterAnimations();

  // Media queries para responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

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
        top: isMobile ? 90 : 120, // Ajuste para no sobreponerse con otros elementos
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.8)",
        padding: isMobile ? "12px" : "20px",
        borderRadius: "8px",
        minWidth: isMobile ? "280px" : isTablet ? "350px" : "400px",
        maxWidth: isMobile ? "90vw" : "auto",
      }}
    >
      <Stack spacing={isMobile ? "sm" : "md"}>
        {/* Player 1 Health */}
        <Box>
          <Group position="apart" mb="xs">
            <Text color="white" weight={500} size={isMobile ? "xs" : "sm"}>
              Player 1 {player1IsDead && <Text span color="red" weight={700} size={isMobile ? "xs" : "sm"}>(MUERTO)</Text>}
            </Text>
            <Text color="white" size={isMobile ? "xs" : "sm"}>{player1Health}/{maxHealth}</Text>
          </Group>
          <Progress
            value={player1Percentage}
            color={getHealthColor(player1Percentage, player1IsDead)}
            size={isMobile ? "md" : "xl"}
            radius="sm"
            animate={!player1IsDead}
          />
        </Box>

        {/* Player 2 Health */}
        <Box>
          <Group position="apart" mb="xs">
            <Text color="white" weight={500} size={isMobile ? "xs" : "sm"}>
              Player 2 {player2IsDead && <Text span color="red" weight={700} size={isMobile ? "xs" : "sm"}>(MUERTO)</Text>}
            </Text>
            <Text color="white" size={isMobile ? "xs" : "sm"}>{player2Health}/{maxHealth}</Text>
          </Group>
          <Progress
            value={player2Percentage}
            color={getHealthColor(player2Percentage, player2IsDead)}
            size={isMobile ? "md" : "xl"}
            radius="sm"
            animate={!player2IsDead}
          />
        </Box>

        {/* Game Over Message */}
        {(player1IsDead || player2IsDead) && (
          <Box style={{ textAlign: "center" }}>
            <Text color="red" weight={700} size={isMobile ? "md" : "lg"}>
              {player1IsDead ? "Player 2 Wins!" : "Player 1 Wins!"}
            </Text>
            <Text color="yellow" size={isMobile ? "xs" : "sm"} style={{ marginTop: "5px" }}>
              {isMobile ? "Animación muerte activa" : "Animación de muerte activada"}
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default HealthBars; 