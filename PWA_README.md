# 📱 Fight Club PWA Configuration

Esta aplicación está configurada como una **Progressive Web App (PWA)** completa, lo que permite instalarla en dispositivos móviles y de escritorio como una aplicación nativa.

## 🚀 Características PWA Implementadas

### ✅ Instalación
- **Manifest.json** configurado con metadatos de la app
- **Service Worker** para funcionalidad offline
- **Prompt de instalación** automático en navegadores compatibles
- **Iconos** optimizados para diferentes dispositivos

### ✅ Funcionalidad Offline
- Cache de archivos estáticos principales
- Funcionamiento básico sin conexión a internet
- Actualización automática de cache

### ✅ Experiencia Nativa
- **Pantalla completa** en modo standalone
- **Tema personalizado** con colores de Fight Club
- **Iconos de aplicación** en launcher/escritorio
- **Splash screen** automático

## 📋 Archivos de Configuración

### 1. `public/manifest.json`
```json
{
  "name": "Fight Club - Character Customization",
  "short_name": "Fight Club",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#fc3f31",
  "icons": [...],
  "shortcuts": [...]
}
```

### 2. `public/sw.js`
- Service Worker para cache offline
- Manejo de actualizaciones
- Notificaciones push (preparado)

### 3. `src/components/PWAInstallPrompt.jsx`
- Componente React para prompt de instalación
- Detección automática de compatibilidad
- UX optimizada para instalación

### 4. `src/utils/pwaUtils.js`
- Utilidades para funcionalidades PWA
- Manejo de notificaciones
- Detección de modo offline/online

## 🔧 Instalación y Uso

### Para Usuarios:
1. **Móvil**: Abre la app en Chrome/Safari → "Agregar a pantalla de inicio"
2. **Desktop**: Abre la app en Chrome → Icono de instalación en la barra de direcciones
3. **Automático**: Aparecerá un prompt de instalación después de usar la app

### Para Desarrolladores:
```bash
# La PWA se activa automáticamente en producción
npm run build
npm run preview

# Para desarrollo local con HTTPS (requerido para PWA):
npm run dev -- --https
```

## 🎯 Características Específicas

### Iconos y Branding
- **Logo principal**: `public/app.png` (Fight Club themed)
- **Colores**: Negro (#000000) y Rojo Fight Club (#fc3f31)
- **Tipografía**: Anton para títulos, consistente con la app

### Shortcuts de Aplicación
- **Start Battle**: Acceso directo al modo combate
- **Dance Mode**: Acceso directo al modo baile

### Notificaciones (Preparado)
- Sistema de notificaciones push configurado
- Iconos y branding consistentes
- Manejo de clicks en notificaciones

## 📱 Compatibilidad

### ✅ Totalmente Compatible:
- Chrome (Android/Desktop)
- Edge (Desktop)
- Samsung Internet
- Firefox (con limitaciones)

### ⚠️ Parcialmente Compatible:
- Safari iOS (instalación manual)
- Safari macOS (funcionalidad limitada)

### ❌ No Compatible:
- Internet Explorer
- Navegadores muy antiguos

## 🛠️ Personalización

### Cambiar Iconos:
1. Reemplaza `public/app.png` con tu nuevo icono (512x512px recomendado)
2. Opcionalmente, genera diferentes tamaños para mejor compatibilidad

### Modificar Colores:
```json
// En public/manifest.json
"background_color": "#tu_color_fondo",
"theme_color": "#tu_color_tema"
```

### Agregar Funcionalidades:
- Edita `public/sw.js` para cache personalizado
- Modifica `src/utils/pwaUtils.js` para nuevas utilidades
- Personaliza `src/components/PWAInstallPrompt.jsx` para diferentes UX

## 🔍 Testing PWA

### Chrome DevTools:
1. F12 → Application tab
2. Manifest: Verificar configuración
3. Service Workers: Estado y cache
4. Storage: Ver datos offline

### Lighthouse:
```bash
# Auditoría PWA completa
npx lighthouse http://localhost:4173 --view
```

### PWA Testing Checklist:
- [ ] Manifest válido
- [ ] Service Worker registrado
- [ ] Iconos de diferentes tamaños
- [ ] HTTPS en producción
- [ ] Funcionalidad offline básica
- [ ] Instalación en diferentes dispositivos

## 🚀 Deployment

### Consideraciones para Producción:
1. **HTTPS obligatorio** para PWA
2. **Manifest en root** del dominio
3. **Service Worker** debe estar en root
4. **Cache strategy** optimizada para tu contenido

### Verificación Post-Deploy:
```bash
# Verificar manifest
curl https://tu-dominio.com/manifest.json

# Verificar service worker
curl https://tu-dominio.com/sw.js
```

## 📊 Métricas PWA

La PWA está configurada para trackear:
- Instalaciones exitosas
- Uso en modo standalone
- Funcionalidad offline
- Actualizaciones de cache

---

**¡Tu Fight Club app ahora es una PWA completa!** 🥊📱

Los usuarios pueden instalarla como una app nativa y disfrutar de una experiencia inmersiva completa. 