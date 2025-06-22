import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleEffect = () => {
  const groupRef = useRef();
  
  // Menos partículas para gotas de sangre
  const particleCount = 25;
  
  // Generar posiciones iniciales y velocidades
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const initialY = new Float32Array(particleCount); // Altura inicial para reset
    
    for (let i = 0; i < particleCount; i++) {
      // Posiciones aleatorias - empezar desde arriba
      positions[i * 3] = (Math.random() - 0.5) * 15; // x
      positions[i * 3 + 1] = Math.random() * 8 + 5; // y - empezar arriba
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8; // z
      
      // Guardar altura inicial
      initialY[i] = positions[i * 3 + 1];
      
      // Velocidades inclinadas - las gotas caen diagonalmente
      velocities[i * 3] = 0.015 + Math.random() * 0.01; // x - deriva constante hacia la derecha
      velocities[i * 3 + 1] = -Math.random() * 0.03 - 0.02; // y - caída
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008; // z - deriva ligera
    }
    
    return { positions, velocities, initialY };
  }, []);

  // Crear array de gotas como meshes individuales
  const droplets = useMemo(() => {
    const drops = [];
    for (let i = 0; i < particleCount; i++) {
      drops.push({
        position: [
          particles.positions[i * 3],
          particles.positions[i * 3 + 1],
          particles.positions[i * 3 + 2]
        ],
        velocity: [
          particles.velocities[i * 3],
          particles.velocities[i * 3 + 1],
          particles.velocities[i * 3 + 2]
        ]
      });
    }
    return drops;
  }, [particles]);
  
  // Animar las gotas de sangre
  useFrame((state) => {
    if (groupRef.current && groupRef.current.children) {
      groupRef.current.children.forEach((drop, i) => {
        if (drop && drop.position) {
          // Aplicar velocidades inclinadas
          drop.position.x += droplets[i].velocity[0]; // deriva hacia la derecha
          drop.position.y += droplets[i].velocity[1]; // caída
          drop.position.z += droplets[i].velocity[2]; // deriva ligera en z
          
          // Acelerar la caída (gravedad)
          droplets[i].velocity[1] -= 0.0005;
          
          // Reset cuando la gota cae muy bajo
          if (drop.position.y < -3) {
            drop.position.x = (Math.random() - 0.5) * 15;
            drop.position.y = Math.random() * 3 + 6;
            drop.position.z = (Math.random() - 0.5) * 8;
            droplets[i].velocity[0] = 0.015 + Math.random() * 0.01; // Nueva deriva
            droplets[i].velocity[1] = -Math.random() * 0.02 - 0.01; // Nueva velocidad de caída
            droplets[i].velocity[2] = (Math.random() - 0.5) * 0.008; // Nueva deriva en z
          }
          
          // Mantener las gotas en el área horizontal
          if (Math.abs(drop.position.x) > 8) {
            drop.position.x = (Math.random() - 0.5) * 15;
          }
          if (Math.abs(drop.position.z) > 5) {
            drop.position.z = (Math.random() - 0.5) * 8;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {droplets.map((droplet, index) => (
        <mesh
          key={index}
          position={droplet.position}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial
            color="#8B0000" // Rojo sangre más oscuro
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ParticleEffect; 