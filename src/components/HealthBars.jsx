import { Box, Progress, Text, Group, Stack } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";

const HealthBars = () => {
  const { 
    player1Health, 
    player2Health, 
    maxHealth,
    player1Stamina,
    player2Stamina,
    maxStamina,
    player1IsDead,
    player2IsDead,
    isCombatMode
  } = useCharacterAnimations();

  // Media queries para responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // No mostrar si no estamos en modo combate
  if (!isCombatMode) return null;

  // Función para obtener color de vida según porcentaje
  const getHealthColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage > 60) return "green";
    if (percentage > 30) return "yellow";
    return "red";
  };

  // Función para obtener color de stamina según porcentaje
  const getStaminaColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage > 50) return "blue";
    if (percentage > 25) return "orange";
    return "red";
  };

  // Determinar si el combate ha terminado
  const winner = player1IsDead ? "Player 2" : player2IsDead ? "Player 1" : null;

  return (
    <Box
      style={{
        position: "fixed",
        top: isMobile ? 60 : 80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: isMobile ? "8px 12px" : "12px 20px",
        borderRadius: "8px",
        minWidth: isMobile ? "280px" : isTablet ? "400px" : "500px",
      }}
    >
      <Stack spacing={isMobile ? "xs" : "sm"}>
        {/* Mensaje de victoria */}
        {winner && (
          <Text 
            align="center" 
            color="yellow" 
            weight={700}
            size={isMobile ? "sm" : "md"}
          >
            🏆 ¡{winner} Wins! 🏆
          </Text>
        )}

        {/* Barras de Player 1 */}
        <Box>
          <Group position="apart" mb={2}>
            <Text 
              color="blue" 
              weight={600}
              size={isMobile ? "xs" : "sm"}
            >
              Player 1
            </Text>
            <Text 
              size={isMobile ? "xs" : "sm"}
              color="white"
            >
              ❤️ {player1Health}/{maxHealth}
            </Text>
          </Group>
          <Progress
            value={(player1Health / maxHealth) * 100}
            color={getHealthColor(player1Health, maxHealth)}
            size={isMobile ? "sm" : "md"}
            radius="sm"
            mb="xs"
          />
          
          <Group position="apart" mb={2}>
            <Text 
              color="blue" 
              weight={500}
              size={isMobile ? "xs" : "sm"}
            >
              Stamina
            </Text>
            <Text 
              size={isMobile ? "xs" : "sm"}
              color="white"
            >
              ⚡ {Math.round(player1Stamina * 10) / 10}/{maxStamina}
            </Text>
          </Group>
          <Progress
            value={(player1Stamina / maxStamina) * 100}
            color={getStaminaColor(player1Stamina, maxStamina)}
            size={isMobile ? "xs" : "sm"}
            radius="sm"
          />
        </Box>

        {/* Separador visual */}
        <Box 
          style={{
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            margin: isMobile ? "4px 0" : "8px 0"
          }}
        />

        {/* Barras de Player 2 */}
        <Box>
          <Group position="apart" mb={2}>
            <Text 
              color="red" 
              weight={600}
              size={isMobile ? "xs" : "sm"}
            >
              Player 2
            </Text>
            <Text 
              size={isMobile ? "xs" : "sm"}
              color="white"
            >
              ❤️ {player2Health}/{maxHealth}
            </Text>
          </Group>
          <Progress
            value={(player2Health / maxHealth) * 100}
            color={getHealthColor(player2Health, maxHealth)}
            size={isMobile ? "sm" : "md"}
            radius="sm"
            mb="xs"
          />
          
          <Group position="apart" mb={2}>
            <Text 
              color="red" 
              weight={500}
              size={isMobile ? "xs" : "sm"}
            >
              Stamina
            </Text>
            <Text 
              size={isMobile ? "xs" : "sm"}
              color="white"
            >
              ⚡ {Math.round(player2Stamina * 10) / 10}/{maxStamina}
            </Text>
          </Group>
          <Progress
            value={(player2Stamina / maxStamina) * 100}
            color={getStaminaColor(player2Stamina, maxStamina)}
            size={isMobile ? "xs" : "sm"}
            radius="sm"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default HealthBars; 