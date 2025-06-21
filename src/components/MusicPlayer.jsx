import React, { useState, useRef, useEffect } from 'react';
import { Button, Group, Text, Box } from '@mantine/core';
import musicIcon from '../assets/music.png';

const MusicPlayer = () => {
  // Lista de canciones (usando los archivos reales del directorio music)
  const songs = [
    { id: 0, name: "Sin Música", artist: "", file: null },
    { id: 1, name: "Now That We're Dead", artist: "Metallica", file: "/music/Metallica Now That We're Dead (official audio).mp3" },
    { id: 2, name: "Lights Out", artist: "Max Styler", file: "/music/Max Styler - Lights Out (Extended Mix).mp3" },
    { id: 3, name: "Garden Of Groove", artist: "Michael Bibi", file: "/music/Michael Bibi - Garden Of Groove (Original Mix).mp3" },
    { id: 4, name: "Bow Down", artist: "Ice Cube", file: "/music/Ice Cube - Bow Down (West side connection).mp3" },
    { id: 5, name: "Nine Thou", artist: "Styles Of Beyond", file: "/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3" },
    { id: 6, name: "Another", artist: "Full On The Mouth", file: "/music/Full On The Mouth - Another.mp3" }
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Función para siguiente canción
  const nextSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(false);
    
    // Si no es "Sin Música", reproducir automáticamente
    if (songs[nextIndex].file) {
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.log('Auto-play bloqueado:', error);
                setIsPlaying(false);
              });
          }
        }
      }, 200);
    }
  };

  // Auto-reproducir cuando cambia la canción
  useEffect(() => {
    if (songs[currentSongIndex].file && audioRef.current) {
      audioRef.current.load();
      // Auto-reproducir "Nine Thou" al cargar el componente
      if (currentSongIndex === 5) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
          }
        }, 500);
      }
    }
  }, [currentSongIndex]);

  // Auto-reproducir al montar el componente
  useEffect(() => {
    // Reproducir "Nine Thou" automáticamente al cargar
    const timer = setTimeout(() => {
      if (audioRef.current && songs[5].file) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.log('Auto-play inicial bloqueado por el navegador:', error);
              // Si el auto-play es bloqueado, mostrar un mensaje o botón de play
              setIsPlaying(false);
            });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Manejar cuando termina una canción (pasar a la siguiente)
  const handleSongEnd = () => {
    nextSong();
  };

  const currentSong = songs[currentSongIndex];
  const isMobile = window.innerWidth <= 768;

  return (
    <Box style={{
      position: 'absolute',
      zIndex: 200,
      top: '65%',
      right: '2%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(4, 203, 238, 0.3)',
      width: 'fit-content',
      height: 'fit-content'
    }}>
      {/* Audio element */}
      {currentSong.file && (
        <audio
          ref={audioRef}
          src={currentSong.file}
          onEnded={handleSongEnd}
          loop={false}
          preload="metadata"
          autoPlay={true}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={() => {
            // Intentar reproducir cuando los datos estén cargados
            if (audioRef.current) {
              const playPromise = audioRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch(error => {
                    console.log('Auto-play bloqueado por el navegador:', error);
                    setIsPlaying(false);
                  });
              }
            }
          }}
        />
      )}

      {/* Solo el icono de música */}
      <Group spacing="sm" position="center" style={{ alignItems: 'center' }}>
        {/* Icono de Música */}
        <Button
          variant="unstyled"
          size="xs"
          onClick={nextSong}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            width: '28px',
            height: '28px',
            padding: '0',
            minWidth: 'unset',
            cursor: 'pointer'
          }}
        >
          <img 
            src={musicIcon} 
            alt="Music" 
            style={{ 
              width: "28px",
              height: "28px",
              objectFit: "cover",
              pointerEvents: "none"
            }} 
          />
        </Button>
      </Group>
    </Box>
  );
};

export default MusicPlayer; 