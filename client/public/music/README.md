# Reproductor de Música - Instrucciones

## Cómo agregar canciones

1. **Reemplaza los archivos placeholder** con tus canciones MP3 reales:
   - `song1.mp3` - Tu primera canción
   - `song2.mp3` - Tu segunda canción  
   - `song3.mp3` - Tu tercera canción
   - `song4.mp3` - Tu cuarta canción
   - `song5.mp3` - Tu quinta canción
   - `song6.mp3` - Tu sexta canción

2. **Formatos soportados:**
   - MP3 (recomendado)
   - WAV
   - OGG

3. **Recomendaciones:**
   - Mantén los archivos con tamaño razonable (menos de 10MB cada uno)
   - Usa nombres descriptivos si quieres cambiar los nombres en el código
   - Asegúrate de que los archivos estén en la carpeta `public/music/`

## Personalizar nombres de canciones

Para cambiar los nombres que aparecen en el reproductor, edita el archivo:
`src/components/MusicPlayer.jsx`

Busca la sección `songs` y cambia los valores de `name`:

```javascript
const songs = [
  { id: 0, name: "Sin Música", file: null },
  { id: 1, name: "Mi Canción Favorita", file: "/music/song1.mp3" },
  { id: 2, name: "Tema de Combate", file: "/music/song2.mp3" },
  // ... etc
];
```

## Funcionalidades del reproductor

- ✅ 6 canciones + opción sin música
- ✅ Navegación con botones anterior/siguiente
- ✅ Botones individuales para cada canción
- ✅ Auto-reproducción al cambiar canción
- ✅ Indicador visual de canción activa (rojo)
- ✅ Efectos neón consistentes con el tema
- ✅ Responsive design (móvil y desktop) 