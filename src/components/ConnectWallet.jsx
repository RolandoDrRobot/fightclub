import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from '../contexts/StarknetProvider';

export function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const controller = connectors[0];
  const [username, setUsername] = useState();

  useEffect(() => {
    if (!address || !controller?.username) return;
    controller.username()?.then((n) => setUsername(n));
  }, [address, controller]);

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
  };

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '20px',
    borderRadius: '12px',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <div style={containerStyle}>
      {address && (
        <>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
            Account: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          {username && (
            <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>
              Username: {username}
            </p>
          )}
        </>
      )}
      {address ? (
        <button 
          style={{ ...buttonStyle, backgroundColor: '#DC2626' }} 
          onClick={() => disconnect()}
          onMouseOver={(e) => e.target.style.backgroundColor = '#B91C1C'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#DC2626'}
        >
          Disconnect
        </button>
      ) : (
        <button 
          style={buttonStyle} 
          onClick={() => connect({ connector: controller })}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4338CA'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4F46E5'}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
} 