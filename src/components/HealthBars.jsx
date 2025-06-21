import { Box, Progress, Text, Group } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import hpIcon from "../assets/HP.png";
import staminaIcon from "../assets/stamina.png";

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
    border: "none",
    borderRadius: "8px",
    backdropFilter: "blur(4px)",
    width: isMobile ? "160px" : isTablet ? "200px" : "250px",
  };

  return (
    <>
      {/* Player 1 - Esquina superior izquierda */}
      <Box
        style={{
          ...barStyle,
          top: isMobile ? 25 : 35,
          left: isMobile ? 20 : 30,
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Group spacing={4} align="center">
              <img 
                src={hpIcon} 
                alt="HP" 
                style={{ 
                  width: isMobile ? "14px" : "16px", 
                  height: isMobile ? "14px" : "16px",
                  objectFit: "contain"
                }} 
              />
              <Text size="xs" color="white" weight={600}>PLAYER 1</Text>
            </Group>
            <Text size="xs" color="white">{player1Health}</Text>
          </Group>
          <Progress
            value={(player1Health / maxHealth) * 100}
            size="lg"
            radius="md"
            color="#F5F5DC"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, #F5F5DC 0%, rgba(245, 245, 220, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(245, 245, 220, 0.5)',
              }
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Group position="apart" mb={2} spacing={4}>
            <Group spacing={4} align="center">
              <img 
                src={staminaIcon} 
                alt="SP" 
                style={{ 
                  width: isMobile ? "14px" : "16px", 
                  height: isMobile ? "14px" : "16px",
                  objectFit: "contain"
                }} 
              />
              <Text size="xs" weight={600} style={{ color: "#F5F5DC" }}>SP</Text>
            </Group>
            <Text size="xs" style={{ color: "#F5F5DC" }}>{Math.round(player1Stamina)}</Text>
          </Group>
          <Progress
            value={(player1Stamina / maxStamina) * 100}
            size="lg"
            radius="md"
            color="#F5F5DC"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, #F5F5DC 0%, rgba(245, 245, 220, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(245, 245, 220, 0.5)',
              }
            }}
          />
        </Box>
      </Box>

      {/* Player 2 - Esquina superior derecha */}
      <Box
        style={{
          ...barStyle,
          top: isMobile ? 25 : 35,
          right: isMobile ? 20 : 30,
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" style={{ color: "#fc3f31" }}>{player2Health}</Text>
            <Group spacing={4} align="center">
              <Text size="xs" weight={600} style={{ color: "#fc3f31" }}>PLAYER 2</Text>
              <img 
                src={hpIcon} 
                alt="HP" 
                style={{ 
                  width: isMobile ? "14px" : "16px", 
                  height: isMobile ? "14px" : "16px",
                  objectFit: "contain"
                }} 
              />
            </Group>
          </Group>
          <Progress
            value={(player2Health / maxHealth) * 100}
            size="lg"
            radius="md"
            color="#F5F5DC"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, #fc3f31 0%, rgba(252, 63, 49, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(252, 63, 49, 0.5)',
              }
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" style={{ color: "#fc3f31" }}>{Math.round(player2Stamina)}</Text>
            <Group spacing={4} align="center">
              <Text size="xs" weight={600} style={{ color: "#fc3f31" }}>SP</Text>
              <img 
                src={staminaIcon} 
                alt="SP" 
                style={{ 
                  width: isMobile ? "14px" : "16px", 
                  height: isMobile ? "14px" : "16px",
                  objectFit: "contain"
                }} 
              />
            </Group>
          </Group>
          <Progress
            value={(player2Stamina / maxStamina) * 100}
            size="lg"
            radius="md"
            color="#F5F5DC"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, #fc3f31 0%, rgba(252, 63, 49, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(252, 63, 49, 0.5)',
              }
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default HealthBars; 