import React, { useRef, useEffect, useState } from 'react';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';

const CrowdSound = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isCombatMode } = useCharacterAnimations();

  // Inicializar el audio cuando se carga
  useEffect(() => {
    if (audioRef.current) {
      // Configurar el audio para loop
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15; // Volumen inicial reducido
      audioRef.current.preload = 'auto';
      
      // Función para intentar reproducir
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log('Sonido de audiencia iniciado');
        } catch (error) {
          console.log('Auto-play de sonido de audiencia bloqueado:', error);
          setIsPlaying(false);
          
          // Intentar reproducir cuando el usuario interactúe con la página
          const enableAudioOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  console.log('Sonido de audiencia iniciado tras interacción');
                })
                .catch(console.error);
            }
            // Remover el listener después del primer uso
            document.removeEventListener('click', enableAudioOnInteraction);
            document.removeEventListener('touchstart', enableAudioOnInteraction);
          };
          
          document.addEventListener('click', enableAudioOnInteraction);
          document.addEventListener('touchstart', enableAudioOnInteraction);
        }
      };

      // Pequeño delay para asegurar que el audio esté listo
      const timer = setTimeout(() => {
        if (isLoaded) {
          playAudio();
        }
      }, 1500);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoaded, isPlaying]);

  // Ajustar volumen cuando cambia el modo - CORREGIDO
  useEffect(() => {
    if (audioRef.current) {
      // Asegurar que el audio esté reproduciéndose
      if (!isPlaying && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }

      // Volúmenes balanceados con la música principal
      const targetVolume = isCombatMode ? 0.15 : 0.2;
      
      console.log(`Cambiando volumen de crowd a ${targetVolume} (Modo: ${isCombatMode ? 'Combate' : 'Baile'})`);
      
      // Aplicar el volumen inmediatamente
      audioRef.current.volume = targetVolume;
      
      // También hacer transición suave
      const currentVolume = audioRef.current.volume;
      const volumeStep = (targetVolume - currentVolume) / 10;
      
      let step = 0;
      const volumeInterval = setInterval(() => {
        if (step < 10 && audioRef.current) {
          const newVolume = Math.max(0, Math.min(1, currentVolume + (volumeStep * step)));
          audioRef.current.volume = newVolume;
          step++;
        } else {
          clearInterval(volumeInterval);
          if (audioRef.current) {
            audioRef.current.volume = targetVolume; // Asegurar volumen final
          }
        }
      }, 50);
      
      return () => clearInterval(volumeInterval);
    }
  }, [isCombatMode]); // Remover dependencia de isPlaying para que siempre se ejecute

  const handleLoadedData = () => {
    setIsLoaded(true);
    console.log('Sonido de audiencia cargado');
  };

  const handleError = (e) => {
    console.error('Error cargando sonido de audiencia:', e);
    setIsLoaded(false);
    setIsPlaying(false);
  };

  return (
    <audio
      ref={audioRef}
      src="/music/crowd.mp3"
      loop={true}
      preload="auto"
      style={{ display: 'none' }}
      onLoadedData={handleLoadedData}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onError={handleError}
      onCanPlayThrough={() => setIsLoaded(true)}
    />
  );
};

export default CrowdSound; 