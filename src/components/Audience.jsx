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

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Pete crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Pete, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Donnie audience member with crowd animation
function DonnieAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/donnie.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Donnie crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Donnie, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Chuck audience member with crowd animation
function ChuckAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Chuck.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Chuck crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Chuck, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Earl audience member with crowd animation
function EarlAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Earl.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Earl crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Earl, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Wayne audience member with crowd animation
function WayneAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Wayne.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Wayne crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Wayne, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Carl audience member with crowd animation
function CarlAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Carl.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Carl crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Carl, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Vince audience member with crowd animation
function VinceAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Vince.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Vince crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Vince, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Lou audience member with crowd animation
function LouAudience({ position, rotation, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Lou.glb");
  
  // Clone the scene to create independent instance
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Find and play the "crowd" animation in loop
  useEffect(() => {
    if (actions && names.length > 0) {
      // Find the crowd animation
      const crowdAnimationName = names.find(name => name.toLowerCase().includes('crowd'));
      
      if (crowdAnimationName && actions[crowdAnimationName]) {
        console.log(`Playing Lou crowd animation: ${crowdAnimationName}`);
        
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the crowd animation in loop
        actions[crowdAnimationName].reset().fadeIn(0.5).play();
        actions[crowdAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[crowdAnimationName]) {
            actions[crowdAnimationName].fadeOut(0.5);
          }
        };
      } else {
        console.warn('Crowd animation not found for Lou, available animations:', names);
        // Fallback to first available animation if crowd not found
        if (actions[names[0]]) {
          actions[names[0]].reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} position={position} rotation={rotation} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

function Audience() {
  const { animations } = useCharacterAnimations();
  
  // Create a unified audience circle around the main characters
  const audienceMembers = useMemo(() => {
    const members = [];
    const audienceTypes = [
      { component: 'Earl', model: 'Earl.glb', name: 'Earl' },
      { component: 'Vince', model: 'Vince.glb', name: 'Vince' },
      { component: 'Chuck', model: 'Chuck.glb', name: 'Chuck' },
      { component: 'Donnie', model: 'donnie.glb', name: 'Donnie' },
      { component: 'Wayne', model: 'Wayne.glb', name: 'Wayne' },
      { component: 'Carl', model: 'Carl.glb', name: 'Carl' },
      { component: 'Lou', model: 'Lou.glb', name: 'Lou' }
    ];
    
    const numMembers = audienceTypes.length; // 7 audience members
    const radius = 3.0; // Closer distance from center where the fighters are
    const centerY = -1; // Same level as main characters
    
    audienceTypes.forEach((type, i) => {
      // Distribute evenly around the circle
      const angle = (i / numMembers) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Rotation to face the center (where main characters are)
      const rotationY = Math.atan2(-x, -z);
      
      // Add some random variation to make it more natural
      const randomOffset = {
        x: (Math.random() - 0.5) * 0.15,
        z: (Math.random() - 0.5) * 0.15,
        y: (Math.random() - 0.5) * 0.1
      };
      
      members.push({
        id: `${type.name.toLowerCase()}-${i}`,
        type: type.component,
        name: type.name,
        position: [x + randomOffset.x, centerY + randomOffset.y, z + randomOffset.z],
        rotation: [0, rotationY + (Math.random() - 0.5) * 0.1, 0],
        scale: 0.85 + Math.random() * 0.3 // Random scale between 0.85 and 1.15
      });
    });
    
    return members;
  }, []);

  return (
    <group>
      {audienceMembers.map((member) => {
        // Render the appropriate component based on type
        switch (member.type) {
          case 'Earl':
            return (
              <group key={member.id} scale={member.scale}>
                <EarlAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Vince':
            return (
              <group key={member.id} scale={member.scale}>
                <VinceAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Chuck':
            return (
              <group key={member.id} scale={member.scale}>
                <ChuckAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Donnie':
            return (
              <group key={member.id} scale={member.scale}>
                <DonnieAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Wayne':
            return (
              <group key={member.id} scale={member.scale}>
                <WayneAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Carl':
            return (
              <group key={member.id} scale={member.scale}>
                <CarlAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          case 'Lou':
            return (
              <group key={member.id} scale={member.scale}>
                <LouAudience
                  position={member.position}
                  rotation={member.rotation}
                />
              </group>
            );
          default:
            return null;
        }
      })}
    </group>
  );
}

// Preload all models
useGLTF.preload("./models/pete.glb");
useGLTF.preload("./models/donnie.glb");
useGLTF.preload("./models/Chuck.glb");
useGLTF.preload("./models/Earl.glb");
useGLTF.preload("./models/Wayne.glb");
useGLTF.preload("./models/Carl.glb");
useGLTF.preload("./models/Vince.glb");
useGLTF.preload("./models/Lou.glb");

export default Audience; 