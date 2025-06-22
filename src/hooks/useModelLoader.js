import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// Lista de todos los modelos que necesitan ser cargados
const modelPaths = [
  './models/pete.glb',
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
      console.log(`🎵 Audio cargado: ${src.split('/').pop()}`);
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      resolve(audio);
    };
    
    const handleError = (error) => {
      console.error(`❌ Error cargando audio: ${src}`, error);
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
  const [loadingStatus, setLoadingStatus] = useState('Iniciando...');

  useEffect(() => {
    console.log('🎮 Iniciando carga completa de assets...');
    
    const loadAllAssets = async () => {
      try {
        // Fase 1: Precargar modelos GLB (0-60%)
        setLoadingStatus('Cargando modelos 3D...');
        modelPaths.forEach((path, index) => {
          console.log(`📦 Precargando modelo ${index + 1}/${modelPaths.length}: ${path}`);
          useGLTF.preload(path);
        });
        
        // Simular progreso de modelos
        const modelSteps = [
          { progress: 10, delay: 400, status: 'Cargando personajes principales...' },
          { progress: 25, delay: 500, status: 'Cargando audiencia...' },
          { progress: 40, delay: 600, status: 'Optimizando modelos...' },
          { progress: 60, delay: 400, status: 'Modelos listos!' }
        ];
        
        for (const step of modelSteps) {
          await new Promise(resolve => setTimeout(resolve, step.delay));
          setLoadingProgress(step.progress);
          setLoadingStatus(step.status);
          console.log(`⏳ ${step.status} (${step.progress}%)`);
        }
        
        // Fase 2: Precargar archivos de música (60-95%)
        setLoadingStatus('Cargando música y efectos de sonido...');
        console.log('🎵 Iniciando precarga de archivos de audio...');
        
        const audioPromises = musicPaths.map((path, index) => {
          console.log(`🎶 Preparando audio ${index + 1}/${musicPaths.length}: ${path.split('/').pop()}`);
          return preloadAudio(path);
        });
        
        // Simular progreso de audio mientras se cargan
        const audioSteps = [
          { progress: 70, delay: 600, status: 'Cargando música de combate...' },
          { progress: 80, delay: 700, status: 'Cargando efectos de sonido...' },
          { progress: 90, delay: 500, status: 'Cargando sonidos de audiencia...' },
          { progress: 95, delay: 400, status: 'Audio listo!' }
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
        
        // Esperar a que todos los audios se carguen
        const loadedAudios = await Promise.all(audioPromises);
        clearInterval(audioProgressInterval);
        
        const successfulAudios = loadedAudios.filter(audio => audio !== null);
        console.log(`✅ ${successfulAudios.length}/${musicPaths.length} archivos de audio cargados exitosamente`);
        
        // Fase 3: Finalización (95-100%)
        setLoadingProgress(98);
        setLoadingStatus('Preparando experiencia...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoadingProgress(100);
        setLoadingStatus('¡Todo listo!');
        console.log('✅ Carga completa de todos los assets');
        
        // Delay final antes de iniciar el juego
        setTimeout(() => {
          setIsLoading(false);
          console.log('🚀 Iniciando juego con todos los assets precargados');
        }, 800);
        
      } catch (error) {
        console.error('❌ Error durante la carga de assets:', error);
        setLoadingStatus('Error en la carga, iniciando de todos modos...');
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    loadAllAssets();

    // Cleanup function
    return () => {
      console.log('🧹 Limpiando hook de carga completa');
    };
  }, []);

  return {
    isLoading,
    loadingProgress,
    loadingStatus
  };
}; 