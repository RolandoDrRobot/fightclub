import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import * as THREE from "three";

export const CameraControls = () => {
  const { isCombatMode } = useCharacterAnimations();
  const { camera } = useThree();
  const orbitControlsRef = useRef();
  const timeRef = useRef(0);
  const initialCameraPosition = useRef(null);
  
  // Store initial camera position
  useEffect(() => {
    if (!initialCameraPosition.current) {
      initialCameraPosition.current = camera.position.clone();
    }
  }, [camera]);

  // Auto-orbit camera in sync mode with diagonal movement
  useFrame((state, delta) => {
    if (!isCombatMode && orbitControlsRef.current) {
      timeRef.current += delta;
      
      // Camera orbits around the characters with diagonal movement
      const baseRadius = 4; // Base distance from center (reduced from 6 to 4)
      const speed = 0.2; // Horizontal rotation speed
      const verticalSpeed = 0.15; // Vertical oscillation speed
      const diagonalSpeed = 0.25; // Diagonal movement speed
      
      // Horizontal circular movement
      const horizontalAngle = timeRef.current * speed;
      
      // Vertical oscillation (up and down movement)
      const baseHeight = 2.5;
      const heightVariation = 1.5;
      const height = baseHeight + Math.sin(timeRef.current * verticalSpeed) * heightVariation;
      
      // Diagonal radius variation (closer and farther)
      const radiusVariation = 1; // Reduced from 1.5 to 1 for closer movement
      const radius = baseRadius + Math.cos(timeRef.current * diagonalSpeed) * radiusVariation;
      
      // Additional diagonal tilt
      const tiltAngle = Math.sin(timeRef.current * diagonalSpeed * 0.7) * 0.3;
      
      // Calculate new camera position with diagonal movement
      const x = Math.cos(horizontalAngle) * radius;
      const z = Math.sin(horizontalAngle) * radius;
      const y = height + Math.sin(horizontalAngle * 2) * 0.5; // Additional height variation
      
      // Set camera position
      camera.position.x = x;
      camera.position.y = y;
      camera.position.z = z;
      
      // Dynamic look-at target with slight movement
      const targetX = Math.sin(timeRef.current * 0.1) * 0.2;
      const targetY = Math.cos(timeRef.current * 0.08) * 0.3;
      const targetZ = Math.cos(timeRef.current * 0.12) * 0.2;
      
      // Make camera look at the center with slight movement
      camera.lookAt(targetX, targetY, targetZ);
      
      // Add subtle camera roll for more dynamic effect
      camera.rotation.z = tiltAngle;
      
      // Update orbit controls target
      orbitControlsRef.current.target.set(targetX, targetY, targetZ);
      orbitControlsRef.current.update();
    }
  });

  // Reset camera when switching modes
  useEffect(() => {
    if (isCombatMode && initialCameraPosition.current) {
      // Reset to initial position for combat mode
      camera.position.copy(initialCameraPosition.current);
      camera.rotation.z = 0; // Reset roll
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, 0, 0);
        orbitControlsRef.current.update();
      }
    }
  }, [isCombatMode, camera]);

  return (
    <>
      <OrbitControls 
        ref={orbitControlsRef}
        enabled={isCombatMode} // Only enable manual controls in combat mode
        enablePan={true}
        enableZoom={true}
        enableRotate={isCombatMode}
        minDistance={3}
        maxDistance={5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};
