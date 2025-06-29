/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

function Tyler({ player = 2, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Tyler.glb");
  const { 
    setAnimations, 
    animationIndex, 
    animations: contextAnimations,
    player1AnimationIndex,
    player2AnimationIndex,
    isCombatMode
  } = useCharacterAnimations();
  
  // Clone the scene to create independent instances
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  // Función para encontrar animación de Tyler por nombre
  const findTylerAnimationIndex = (animationName) => {
    console.log(`🔍 Tyler searching for animation: "${animationName}"`);
    console.log(`🎭 Tyler available animations:`, names);
    
    const index = names.findIndex(anim => anim === animationName);
    if (index >= 0) {
      console.log(`✅ Tyler found exact match: "${animationName}" at index ${index}`);
      return index;
    }
    
    // Si no encuentra la animación exacta, buscar por nombre similar
    const fallbackIndex = names.findIndex(anim => 
      anim.toLowerCase().includes(animationName.toLowerCase())
    );
    
    if (fallbackIndex >= 0) {
      console.log(`⚠️ Tyler found similar match: "${names[fallbackIndex]}" (index ${fallbackIndex}) for "${animationName}"`);
    } else {
      console.log(`❌ Tyler no match found for "${animationName}", using first animation: "${names[0]}" (index 0)`);
    }
    
    return fallbackIndex >= 0 ? fallbackIndex : 0; // Fallback a la primera animación
  };

  // Mapear el índice de Pete a la animación correspondiente de Tyler
  const getTylerAnimationFromPeteIndex = (peteIndex) => {
    if (!contextAnimations || contextAnimations.length === 0 || !names || names.length === 0) {
      console.log(`⚠️ Tyler: Missing data - contextAnimations: ${contextAnimations?.length || 0}, names: ${names?.length || 0}`);
      return 0;
    }

    // Obtener el nombre de la animación de Pete
    const peteAnimationName = contextAnimations[peteIndex];
    if (!peteAnimationName) {
      console.log(`❌ Tyler: No Pete animation found for index ${peteIndex}`);
      return 0;
    }

    console.log(`🔄 Tyler: Mapping Pete animation "${peteAnimationName}" (Pete index ${peteIndex})`);

    // Buscar la animación correspondiente en Tyler
    const tylerIndex = findTylerAnimationIndex(peteAnimationName);
    
    console.log(`✅ Tyler: Final mapping - Pete "${peteAnimationName}" (${peteIndex}) → Tyler "${names[tylerIndex]}" (${tylerIndex})`);
    
    return tylerIndex;
  };

  // Determinar qué animación usar Tyler basándose en el índice de Player 2
  const currentTylerAnimationIndex = useMemo(() => {
    const result = getTylerAnimationFromPeteIndex(player2AnimationIndex);
    console.log(`🎯 Tyler current animation index: ${result} (from Pete index ${player2AnimationIndex})`);
    return result;
  }, [player2AnimationIndex, contextAnimations, names]);

  // Tyler no necesita establecer las animaciones del contexto, solo usar las suyas
  useEffect(() => {
    if (names.length > 0) {
      console.log("🎭 Tyler animations loaded:", names);
      
      // Verificar si Tyler tiene las animaciones críticas de combate
      const criticalAnimations = ['idleFight', 'hurt', 'kick', 'punch', 'die', 'cover'];
      criticalAnimations.forEach(anim => {
        const hasAnim = names.some(name => name.toLowerCase().includes(anim.toLowerCase()));
        console.log(`🔍 Tyler has "${anim}": ${hasAnim ? '✅' : '❌'}`);
      });
    }
  }, [names]);

  useEffect(() => {
    if (actions && names[currentTylerAnimationIndex]) {
      const animationName = names[currentTylerAnimationIndex];
      console.log(`🎬 Tyler playing animation: "${animationName}" (Tyler index: ${currentTylerAnimationIndex}, Pete index: ${player2AnimationIndex})`);
      
      // Verificación especial para idle fight
      if (contextAnimations[player2AnimationIndex] === 'idleFight') {
        console.log(`⚔️ Tyler should be in COMBAT IDLE. Playing: "${animationName}"`);
        if (animationName.toLowerCase().includes('hurt')) {
          console.log(`❌ ERROR: Tyler is playing HURT animation instead of IDLE FIGHT!`);
        }
      }
      
      actions[animationName].reset().fadeIn(0.5).play();
      return () => {
        if (actions[animationName]) {
          actions[animationName].fadeOut(0.5);
        }
      };
    } else if (actions && names.length > 0) {
      // Fallback: si el índice no existe, usar la primera animación
      console.log(`🔄 Tyler fallback to first animation: "${names[0]}"`);
      actions[names[0]].reset().fadeIn(0.5).play();
      return () => {
        if (actions[names[0]]) {
          actions[names[0]].fadeOut(0.5);
        }
      };
    }
  }, [currentTylerAnimationIndex, actions, names, player2AnimationIndex, contextAnimations]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("./models/Tyler.glb");

export default Tyler; 