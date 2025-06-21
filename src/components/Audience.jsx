import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

function AudienceMember({ position, rotation, initialAnimationIndex, memberId, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/pete.glb");
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(initialAnimationIndex);
  
  // Clone the scene to create independent instances
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Get dance animations
  const danceAnimations = useMemo(() => {
    return names
      .map((name, index) => ({ name, index }))
      .filter(({ name }) => 
        name.includes('dance') || 
        name.includes('celebration') || 
        name.includes('intro')
      );
  }, [names]);

  // Change animation periodically for more dynamic audience
  useEffect(() => {
    if (danceAnimations.length === 0) return;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * danceAnimations.length);
      setCurrentAnimationIndex(danceAnimations[randomIndex].index);
    }, 3000 + Math.random() * 4000); // Change every 3-7 seconds randomly
    
    return () => clearInterval(interval);
  }, [danceAnimations]);

  // Play the current animation
  useEffect(() => {
    if (actions && names[currentAnimationIndex] && actions[names[currentAnimationIndex]]) {
      // Stop all other animations first
      Object.values(actions).forEach(action => action.stop());
      
      // Play the current animation
      actions[names[currentAnimationIndex]].reset().fadeIn(0.5).play();
      
      return () => {
        if (actions[names[currentAnimationIndex]]) {
          actions[names[currentAnimationIndex]].fadeOut(0.5);
        }
      };
    }
  }, [currentAnimationIndex, actions, names]);

  // Fallback to idle if no dance animations available
  useEffect(() => {
    if (danceAnimations.length === 0 && actions && names.length > 0) {
      // Try to find idle animation or use first available
      const idleIndex = names.findIndex(name => name.includes('idle')) || 0;
      if (actions[names[idleIndex]]) {
        actions[names[idleIndex]].reset().fadeIn(0.5).play();
      }
    }
  }, [danceAnimations.length, actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

function Audience() {
  const { animations } = useCharacterAnimations();
  
  // Generate audience positions in a circle around the main characters
  const audienceMembers = useMemo(() => {
    const members = [];
    const numMembers = 12; // Number of audience members
    const radius = 4; // Distance from center
    const centerY = -1; // Same level as main characters
    
    // Predefined dance animation indices for testing
    const testDanceIndices = [0, 1, 2, 3, 4, 5]; // Will be mapped to actual dance animations
    
    for (let i = 0; i < numMembers; i++) {
      const angle = (i / numMembers) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Use test animation index cycling through available ones
      const testAnimationIndex = testDanceIndices[i % testDanceIndices.length];
      
      // Rotation to face the center (where main characters are)
      const rotationY = Math.atan2(-x, -z);
      
      // Add some random variation to make it more natural
      const randomOffset = {
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.2
      };
      
      members.push({
        id: i,
        position: [x + randomOffset.x, centerY + randomOffset.y, z + randomOffset.z],
        rotation: [0, rotationY + (Math.random() - 0.5) * 0.2, 0],
        animationIndex: testAnimationIndex,
        scale: 0.8 + Math.random() * 0.4 // Random scale between 0.8 and 1.2
      });
    }
    
    return members;
  }, []);

  return (
    <group>
      {audienceMembers.map((member) => (
        <group key={member.id} scale={member.scale}>
          <AudienceMember
            position={member.position}
            rotation={member.rotation}
            initialAnimationIndex={member.animationIndex}
            memberId={member.id}
          />
        </group>
      ))}
    </group>
  );
}

export default Audience; 