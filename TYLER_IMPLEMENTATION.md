# Implementación de Tyler como Player 2

## Resumen de Cambios

Se ha implementado Tyler como Player 2 en el sistema de combate y baile, manteniendo Pete como Player 1. Esto crea un sistema de dos personajes distintos con animaciones individuales.

## Archivos Modificados

### 1. `src/components/Tyler.jsx` (NUEVO)
- Componente dedicado para Tyler basado en Pete.jsx
- Usa el modelo `Tyler.glb` 
- Siempre funciona como Player 2
- Maneja sus propias animaciones de forma independiente

### 2. `src/components/Experience.jsx`
- Importa el componente Tyler
- Player 1: Pete
- Player 2: Tyler
- Ambos mantienen posiciones y rotaciones correctas según el modo

### 3. `src/contexts/CharacterAnimations.jsx`
- Añadido `tylerAnimations` con el mismo mapeo que Pete
- Funciones actualizadas para soportar múltiples personajes:
  - `findAnimationIndex(animationName, player)` - ahora acepta parámetro de jugador
  - `getAnimationForMode(animationType, player)` - animaciones específicas por jugador
  - `getDeathAnimationIndex(player)` - muerte por jugador
  - `getBlockAnimationIndex(player)` - bloqueo por jugador
- Todas las funciones de combate actualizadas para trabajar con ambos personajes
- Logs mejorados para identificar Pete vs Tyler

### 4. `src/hooks/useModelLoader.js`
- Añadido `Tyler.glb` a la lista de modelos precargados

## Características del Sistema

### Animaciones por Personaje
- **Pete (Player 1)**: Usa animaciones de `pete.glb`
- **Tyler (Player 2)**: Usa animaciones de `Tyler.glb`
- Cada personaje puede tener diferentes animaciones para la misma acción

### Sistema de Combate
- Pete vs Tyler en modo combate
- Cada uno tiene su propio sistema de vida, stamina y animaciones
- IA controla a Tyler (Player 2) por defecto

### Sistema de Baile
- Ambos personajes pueden bailar juntos
- Cada uno usa sus propias animaciones de baile
- Sincronización mantenida entre ambos

## Animaciones Esperadas en Tyler.glb

El sistema espera que Tyler tenga las siguientes animaciones:

### Combate
- `idleFight` - Idle de combate
- `kick` - Patada
- `punch` - Puñetazo simple  
- `punches` - Combo de puñetazos
- `hurt` - Reacción al daño
- `die` - Muerte
- `cover` - Bloqueo/defensa

### Baile/Celebración
- `idle` - Idle normal
- `dance1` - `dance6` - Animaciones de baile
- `celebration` - Celebración
- `intro` - Introducción

## Uso del Sistema

### Modo Combate
```javascript
// Iniciar combate Pete vs Tyler
setIsCombatMode(true);
initializeCombat(); // Pete y Tyler hacen intro, luego idle de combate

// Ataques
triggerPlayer1Attack("punch"); // Pete ataca a Tyler
triggerPlayer2Attack("kick");  // Tyler ataca a Pete
```

### Modo Baile
```javascript
// Cambiar a modo baile
setIsCombatMode(false);

// Ambos bailan
triggerSyncAnimation("dance1"); // Pete hace dance1, Tyler hace dance2
```

## Ventajas del Nuevo Sistema

1. **Personajes Únicos**: Pete y Tyler son visualmente diferentes
2. **Animaciones Independientes**: Cada uno puede tener su propio set de animaciones
3. **Escalabilidad**: Fácil añadir más personajes siguiendo el mismo patrón
4. **Compatibilidad**: Mantiene toda la funcionalidad existente
5. **Debug Mejorado**: Logs claros identificando cada personaje

## Notas Técnicas

- Tyler siempre es Player 2, Pete siempre es Player 1
- El sistema usa SkeletonUtils.clone() para instancias independientes
- Las animaciones se mapean por índice usando el array de animaciones de Pete como referencia
- Si Tyler no tiene una animación específica, usa fallback a la primera disponible
- Sistema completamente compatible con el sistema de IA existente 