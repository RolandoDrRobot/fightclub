import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleEffect = () => {
  const meshRef = useRef();
  
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
      
      // Velocidades - principalmente caída con algo de deriva
      velocities[i * 3] = (Math.random() - 0.5) * 0.01; // x - deriva lenta
      velocities[i * 3 + 1] = -Math.random() * 0.03 - 0.02; // y - caída
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01; // z - deriva lenta
    }
    
    return { positions, velocities, initialY };
  }, []);
  
  // Animar las gotas de sangre
  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        // Aplicar gravedad y movimiento
        positions[i * 3] += particles.velocities[i * 3]; // deriva x
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1]; // caída y
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2]; // deriva z
        
        // Acelerar la caída (gravedad)
        particles.velocities[i * 3 + 1] -= 0.0005;
        
        // Reset cuando la gota cae muy bajo
        if (positions[i * 3 + 1] < -3) {
          positions[i * 3] = (Math.random() - 0.5) * 15;
          positions[i * 3 + 1] = Math.random() * 3 + 6;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
          particles.velocities[i * 3 + 1] = -Math.random() * 0.02 - 0.01;
        }
        
        // Mantener las gotas en el área horizontal
        if (Math.abs(positions[i * 3]) > 8) {
          positions[i * 3] = (Math.random() - 0.5) * 15;
        }
        if (Math.abs(positions[i * 3 + 2]) > 5) {
          positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8B0000" // Rojo sangre más oscuro
        size={0.25} // Más grandes para parecer gotas
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8} // Más opacas
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleEffect; 