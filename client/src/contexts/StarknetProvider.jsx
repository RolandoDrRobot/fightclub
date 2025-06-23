import React, { createContext, useContext, useState, useCallback } from 'react';

// Crear contexto para el estado de Starknet
const StarknetContext = createContext();

// Mock implementation para cuando las dependencias no estén disponibles
export function StarknetProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [username, setUsername] = useState(null);

  const connect = useCallback(async () => {
    try {
      // Simulación de conexión - en producción esto usaría Cartridge Controller
      console.log('Connecting to Cartridge Controller...');
      // Simular delay de conexión
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de dirección de wallet
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setAddress(mockAddress);
      setIsConnected(true);
      setUsername('Player' + Math.floor(Math.random() * 1000));
      
      console.log('Connected successfully with address:', mockAddress);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setUsername(null);
    console.log('Disconnected from wallet');
  }, []);

  const value = {
    isConnected,
    address,
    username,
    connect,
    disconnect
  };

  return (
    <StarknetContext.Provider value={value}>
      {children}
    </StarknetContext.Provider>
  );
}

// Hooks personalizados para usar el contexto
export function useAccount() {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error('useAccount must be used within StarknetProvider');
  }
  return {
    address: context.address,
    account: context.isConnected ? {
      address: context.address
    } : null
  };
}

export function useConnect() {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error('useConnect must be used within StarknetProvider');
  }
  return {
    connect: ({ connector }) => context.connect(),
    connectors: [{ username: () => Promise.resolve(context.username) }]
  };
}

export function useDisconnect() {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error('useDisconnect must be used within StarknetProvider');
  }
  return {
    disconnect: context.disconnect
  };
} 