import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// Lista de todos los modelos que necesitan ser cargados
const modelPaths = [
  './models/pete.glb',
  './models/Tyler.glb',
  './models/Chuck.glb',
  './models/Earl.glb',
  './models/Wayne.glb',
  './models/Vince.glb',
  './models/Lou.glb',
  './models/Tony.glb',
  './models/Bob.glb',
  './models/Lawrence.glb'
];

// Lista de todos los archivos de música que necesitan ser precargados
const musicPaths = [
  '/music/Metallica Now That We\'re Dead (official audio).mp3',
  '/music/Max Styler - Lights Out (Extended Mix).mp3',
  '/music/Michael Bibi - Garden Of Groove (Original Mix).mp3',
  '/music/Ice Cube - Bow Down (West side connection).mp3',
  '/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3',
  '/music/Full On The Mouth - Another.mp3',
  '/music/crowd.mp3',
  '/music/punch.mp3'
];

// Función para precargar un archivo de audio
const preloadAudio = (src) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    const handleLoad = () => {
      console.log(`🎵 Audio loaded: ${src.split('/').pop()}`);
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      resolve(audio);
    };
    
    const handleError = (error) => {
      console.error(`❌ Error loading audio: ${src}`, error);
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      resolve(null); // Resolver con null para continuar aunque falle
    };
    
    audio.addEventListener('canplaythrough', handleLoad);
    audio.addEventListener('error', handleError);
    audio.preload = 'auto';
    audio.src = src;
    audio.load();
  });
};

export const useModelLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Starting...');

  useEffect(() => {
    console.log('🎮 Starting complete asset loading...');
    
    const loadAllAssets = async () => {
      try {
        // Phase 1: Preload GLB models (0-60%)
        setLoadingStatus('Loading 3D models...');
        modelPaths.forEach((path, index) => {
          console.log(`📦 Preloading model ${index + 1}/${modelPaths.length}: ${path}`);
          useGLTF.preload(path);
        });
        
        // Simulate model progress
        const modelSteps = [
          { progress: 10, delay: 400, status: 'Loading main characters...' },
          { progress: 25, delay: 500, status: 'Loading audience...' },
          { progress: 40, delay: 600, status: 'Optimizing models...' },
          { progress: 60, delay: 400, status: 'Models ready!' }
        ];
        
        for (const step of modelSteps) {
          await new Promise(resolve => setTimeout(resolve, step.delay));
          setLoadingProgress(step.progress);
          setLoadingStatus(step.status);
          console.log(`⏳ ${step.status} (${step.progress}%)`);
        }
        
        // Phase 2: Preload music files (60-95%)
        setLoadingStatus('Loading music and sound effects...');
        console.log('🎵 Starting audio file preload...');
        
        const audioPromises = musicPaths.map((path, index) => {
          console.log(`🎶 Preparing audio ${index + 1}/${musicPaths.length}: ${path.split('/').pop()}`);
          return preloadAudio(path);
        });
        
        // Simulate audio progress while loading
        const audioSteps = [
          { progress: 70, delay: 600, status: 'Loading combat music...' },
          { progress: 80, delay: 700, status: 'Loading sound effects...' },
          { progress: 90, delay: 500, status: 'Loading crowd sounds...' },
          { progress: 95, delay: 400, status: 'Audio ready!' }
        ];
        
        let audioStepIndex = 0;
        const audioProgressInterval = setInterval(() => {
          if (audioStepIndex < audioSteps.length) {
            const step = audioSteps[audioStepIndex];
            setLoadingProgress(step.progress);
            setLoadingStatus(step.status);
            console.log(`⏳ ${step.status} (${step.progress}%)`);
            audioStepIndex++;
          } else {
            clearInterval(audioProgressInterval);
          }
        }, 600);
        
        // Wait for all audios to load
        const loadedAudios = await Promise.all(audioPromises);
        clearInterval(audioProgressInterval);
        
        const successfulAudios = loadedAudios.filter(audio => audio !== null);
        console.log(`✅ ${successfulAudios.length}/${musicPaths.length} audio files loaded successfully`);
        
        // Phase 3: Finalization (95-100%)
        setLoadingProgress(98);
        setLoadingStatus('Preparing experience...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoadingProgress(100);
        setLoadingStatus('Ready to fight!');
        console.log('✅ Complete loading of all assets');
        
        // Final delay before starting the game
        setTimeout(() => {
          setIsLoading(false);
          console.log('🚀 Starting game with all assets preloaded');
        }, 800);
        
      } catch (error) {
        console.error('❌ Error during asset loading:', error);
        setLoadingStatus('Loading error, starting anyway...');
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadAllAssets();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up complete loading hook');
    };
  }, []);

  return {
    isLoading,
    loadingProgress,
    loadingStatus
  };
}; 