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
    isCombatMode,
    player1Wins,
    player1IsBlocking,
    player2IsBlocking
  } = useCharacterAnimations();

  // Log para debug del contador
  console.log(`HealthBars - Player 1 Wins: ${player1Wins}`);
  console.log(`HealthBars - Combat Mode: ${isCombatMode}, Players Dead: P1=${player1IsDead}, P2=${player2IsDead}`);

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

  // Componente de icono de escudo
  const ShieldIcon = ({ color = "#F5F5DC", size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `drop-shadow(0 0 4px ${color})`,
        animation: "shieldPulse 1.5s ease-in-out infinite alternate"
      }}
    >
      <path
        d="M12 2L4 6V11C4 16.55 7.84 21.74 12 22C16.16 21.74 20 16.55 20 11V6L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
      />
      <style>
        {`
          @keyframes shieldPulse {
            0% { opacity: 0.7; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.1); }
          }
        `}
      </style>
    </svg>
  );

  return (
    <>
      {/* TÍTULO FIGHT CLUB - CENTRO SUPERIOR SUPERPUESTO */}
      <Box
        style={{
          position: "fixed",
          top: 25,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001, // Más alto que las barras para estar superpuesto
          textAlign: "center",
          pointerEvents: "none", // Para que no interfiera con otros elementos
        }}
      >
        <div style={{
          color: "#fc3f31",
          textShadow: `
            0 0 2px #fc3f31,
            0 0 4px rgba(252, 63, 49, 0.6),
            2px 2px 4px rgba(0,0,0,0.8)
          `,
          textTransform: "uppercase",
          letterSpacing: isMobile ? "1px" : "3px",
          fontFamily: "Anton, Impact, sans-serif",
          fontSize: "30px",
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}>
          {/* Efecto de fondo sutil */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "110%",
            height: "110%",
            background: `radial-gradient(ellipse, 
              rgba(252, 63, 49, 0.05) 0%, 
              transparent 60%
            )`,
            borderRadius: "50%",
            zIndex: -1
          }} />
          
          {/* Letras individuales con efectos sutiles */}
          {"FIGHT CLUB".split("").map((letter, index) => (
            <span 
              key={index}
              style={{
                display: "inline-block",
                margin: letter === " " ? (isMobile ? "0 4px" : "0 8px") : "0",
                textShadow: `
                  0 0 3px #fc3f31,
                  0 0 6px rgba(252, 63, 49, 0.4),
                  1px 1px 2px rgba(0,0,0,0.8)
                `
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </Box>

      {/* CONTADOR DE VICTORIAS - Debajo del título */}
      <Box
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Text
          style={{
            borderRadius: "15px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "0",
            fontSize: "55px",
            color: "rgb(245, 245, 220)",
            textShadow: "rgba(245, 245, 220, 0.3) 0px 0px 2px, rgba(0, 0, 0, 0.8) 1px 1px 2px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontFamily: "Anton, Impact, sans-serif",
          }}
        >
          {player1Wins}
        </Text>
      </Box>

      {/* Player 1 - Esquina superior izquierda */}
      <Box
        style={{
          ...barStyle,
          top: 65,
          left: isMobile ? 20 : 30,
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Group spacing={4} align="center">
              <Text size="xs" color="white" weight={700}>HP</Text>
              <Text size="xs" color="white" weight={700}>PLAYER 1</Text>
              {player1IsBlocking && (
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                  <ShieldIcon color="#F5F5DC" size={14} />
                </div>
              )}
            </Group>
            <Text size="xs" color="white" weight={700}>{player1Health}</Text>
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
              <Text size="xs" weight={700} style={{ color: "#F5F5DC" }}>SP</Text>
            </Group>
            <Text size="xs" weight={700} style={{ color: "#F5F5DC" }}>{Math.round(player1Stamina)}</Text>
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
          top: 65,
          right: isMobile ? 20 : 30,
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" weight={700} style={{ color: "#fc3f31" }}>{player2Health}</Text>
            <Group spacing={4} align="center">
              {player2IsBlocking && (
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                  <ShieldIcon color="#fc3f31" size={14} />
                </div>
              )}
              <Text size="xs" weight={700} style={{ color: "#fc3f31" }}>PLAYER 2</Text>
              <Text size="xs" weight={700} style={{ color: "#fc3f31" }}>HP</Text>
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
            <Text size="xs" weight={700} style={{ color: "#fc3f31" }}>{Math.round(player2Stamina)}</Text>
            <Group spacing={4} align="center">
              <Text size="xs" weight={700} style={{ color: "#fc3f31" }}>SP</Text>
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