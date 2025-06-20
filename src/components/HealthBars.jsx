import { Box, Progress, Text, Group } from "@mantine/core";
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

  // Determinar si el combate ha terminado
  const winner = player1IsDead ? "Player 2" : player2IsDead ? "Player 1" : null;

  // Estilos comunes para las barras
  const barStyle = {
    position: "fixed",
    zIndex: 1000,
    padding: isMobile ? "8px" : "12px",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "4px",
    backdropFilter: "blur(4px)",
    width: isMobile ? "160px" : isTablet ? "200px" : "250px",
  };

  return (
    <>
      {/* Player 1 - Esquina superior izquierda */}
      <Box
        style={{
          ...barStyle,
          top: isMobile ? 10 : 20,
          left: isMobile ? 10 : 20,
        }}
      >
        {/* Nombre del jugador */}
        <Text 
          weight={700}
          size={isMobile ? "sm" : "md"}
          mb={4}
          style={{ textShadow: "1px 1px 2px black", color: "#04cbee" }}
        >
          PLAYER 1
        </Text>
        
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" color="white" weight={600}>HP</Text>
            <Text size="xs" color="white">{player1Health}</Text>
          </Group>
          <Progress
            value={(player1Health / maxHealth) * 100}
            color="#04cbee"
            size={isMobile ? "md" : "lg"}
            radius={2}
            style={{
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" weight={600} style={{ color: "#04cbee" }}>SP</Text>
            <Text size="xs" style={{ color: "#04cbee" }}>{Math.round(player1Stamina)}</Text>
          </Group>
          <Progress
            value={(player1Stamina / maxStamina) * 100}
            color="#04cbee"
            size={isMobile ? "sm" : "md"}
            radius={2}
            style={{
              border: `1px solid rgba(4, 203, 238, 0.4)`,
            }}
          />
        </Box>
      </Box>

      {/* Player 2 - Esquina superior derecha */}
      <Box
        style={{
          ...barStyle,
          top: isMobile ? 10 : 20,
          right: isMobile ? 10 : 20,
        }}
      >
        {/* Nombre del jugador */}
        <Text 
          weight={700}
          size={isMobile ? "sm" : "md"}
          mb={4}
          align="right"
          style={{ textShadow: "1px 1px 2px black", color: "#fc3f31" }}
        >
          PLAYER 2
        </Text>
        
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" color="white">{player2Health}</Text>
            <Text size="xs" color="white" weight={600}>HP</Text>
          </Group>
          <Progress
            value={(player2Health / maxHealth) * 100}
            color="#fc3f31"
            size={isMobile ? "md" : "lg"}
            radius={2}
            style={{
              border: "1px solid rgba(255,255,255,0.4)",
              transform: "scaleX(-1)", // Invertir dirección para Player 2
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" style={{ color: "#fc3f31" }}>{Math.round(player2Stamina)}</Text>
            <Text size="xs" weight={600} style={{ color: "#fc3f31" }}>SP</Text>
          </Group>
          <Progress
            value={(player2Stamina / maxStamina) * 100}
            color="#fc3f31"
            size={isMobile ? "sm" : "md"}
            radius={2}
            style={{
              border: `1px solid rgba(252, 63, 49, 0.4)`,
              transform: "scaleX(-1)", // Invertir dirección para Player 2
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default HealthBars; 