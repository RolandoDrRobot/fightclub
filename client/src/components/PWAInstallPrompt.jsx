import { useState, useEffect } from 'react';
import { Button, Box, Text, Group } from '@mantine/core';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Escuchar cuando la app se instala
    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response to the install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('PWA: User accepted the install prompt');
    } else {
      console.log('PWA: User dismissed the install prompt');
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Ocultar por 24 horas
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // No mostrar si ya está instalado o si fue dismissado recientemente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - dismissedTime < twentyFourHours) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #fc3f31',
        borderRadius: '12px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <Group position="apart" align="flex-start" mb="sm">
        <Box>
          <Text 
            size="sm" 
            weight={700} 
            color="#fc3f31"
            style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            ¡Instala Fight Club!
          </Text>
          <Text size="xs" color="white" mt={4}>
            Instala la app para una experiencia completa sin conexión
          </Text>
        </Box>
        <Button
          variant="subtle"
          size="xs"
          color="gray"
          onClick={handleDismiss}
          style={{ padding: '4px 8px', minHeight: 'auto' }}
        >
          ✕
        </Button>
      </Group>
      
      <Group spacing="xs">
        <Button
          onClick={handleInstallClick}
          size="sm"
          style={{
            backgroundColor: '#fc3f31',
            color: 'white',
            border: 'none',
            '&:hover': {
              backgroundColor: '#d63326'
            }
          }}
        >
          📱 Instalar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          style={{
            color: 'white',
            borderColor: '#666',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Más tarde
        </Button>
      </Group>
    </Box>
  );
};

export default PWAInstallPrompt; 