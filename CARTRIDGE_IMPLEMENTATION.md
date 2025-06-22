# Cartridge Controller Implementation

## Overview

Esta implementación integra el Cartridge Controller en el proyecto R3F Character Customization siguiendo la guía oficial de [Cartridge Controller React Integration](https://docs.cartridge.gg/controller/examples/react).

## Implementación Actual

Debido a limitaciones de compatibilidad con Node.js 16.20.2 (las dependencias de Cartridge requieren Node.js >= 18.0.0), se ha implementado una versión mock que simula la funcionalidad de conexión del Cartridge Controller.

### Archivos Creados/Modificados

1. **`src/contexts/StarknetProvider.jsx`** - Proveedor de contexto que simula la funcionalidad de conexión de Starknet
2. **`src/components/ConnectWallet.jsx`** - Componente para conectar/desconectar wallet
3. **`src/main.jsx`** - Actualizado para incluir StarknetProvider
4. **`src/App.jsx`** - Actualizado para incluir el componente de Cartridge
5. **`vite.config.js`** - Actualizado para soporte HTTPS con mkcert

### Funcionalidades Implementadas

- ✅ Conexión de wallet (simulada)
- ✅ Desconexión de wallet
- ✅ Visualización de dirección de cuenta
- ✅ Visualización de username
- ✅ UI integrada con el proyecto existente

### Componente UI

El componente está posicionado de manera no intrusiva:
- **ConnectWallet**: Esquina superior derecha

## Migración a Producción

Para usar el Cartridge Controller real, necesitarías:

1. **Actualizar Node.js a >= 18.0.0**
2. **Instalar dependencias reales:**
   ```bash
   yarn add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet
   ```

3. **Reemplazar `src/contexts/StarknetProvider.jsx` con la implementación real:**
   ```jsx
   import { sepolia, mainnet } from "@starknet-react/chains";
   import {
     StarknetConfig,
     jsonRpcProvider,
     starkscan,
   } from "@starknet-react/core";
   import ControllerConnector from "@cartridge/connector/controller";

   const policies = {
     // Define las políticas según tus necesidades
   };

   const connector = new ControllerConnector({
     policies,
     rpc: 'https://api.cartridge.gg/x/starknet/sepolia',
   });

   // ... resto de la implementación
   ```

4. **Actualizar imports en los componentes:**
   ```jsx
   import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
   ```

## Configuración de Desarrollo

El proyecto está configurado para usar HTTPS en desarrollo (requerido por Cartridge):

```bash
yarn dev
```

Esto iniciará el servidor con certificados SSL automáticos gracias a `vite-plugin-mkcert`.

## Testing

La implementación actual permite probar toda la funcionalidad de conexión de UI sin necesidad de conexión real a Starknet. Los logs en consola muestran las acciones simuladas.

## Notas Importantes

- La implementación actual es completamente funcional para desarrollo y testing de UI de conexión
- Las direcciones de wallet son simuladas pero realistas
- La migración a producción requiere únicamente actualizar Node.js e instalar las dependencias reales
- El diseño UI está optimizado para no interferir con la experiencia de juego existente
- Solo incluye funcionalidad de conexión/desconexión de wallet, sin transacciones 