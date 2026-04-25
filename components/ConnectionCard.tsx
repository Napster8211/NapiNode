'use client';

import { useState } from 'react';
import { Shield, ShieldAlert, Power, Download } from 'lucide-react';
import CountrySelector, { AVAILABLE_NODES, NapiNodeLocation } from './CountrySelector';

interface ConnectionCardProps {
  onConnectionChange?: (status: boolean, details?: any, location?: NapiNodeLocation) => void;
}

export default function ConnectionCard({ onConnectionChange }: ConnectionCardProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [targetNode, setTargetNode] = useState<NapiNodeLocation>(AVAILABLE_NODES[0]);
  const [tunnelDetails, setTunnelDetails] = useState<any>(null);

  const handleConnect = async () => {
    if (isConnected) {
      setIsConnecting(true);
      try {
        setIsConnected(false);
        setTunnelDetails(null);
        if (onConnectionChange) onConnectionChange(false);
      } catch (error) {
        console.error("Disconnection error:", error);
      } finally {
        setIsConnecting(false);
      }
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch('/api/vpn/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode: targetNode.code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to establish Stealth Tunnel');
      }

      setTunnelDetails(data.connection);
      setIsConnected(true);
      
      if (onConnectionChange) {
        onConnectionChange(true, data.connection, targetNode);
      }
      
    } catch (error: any) {
      console.error('Connection Exception:', error);
      alert(`NapiNode Error: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // NEW: The Config Generator Function
  const downloadConfig = () => {
    if (!tunnelDetails) return;

    const configText = `NapiNode Stealth Configuration
==============================
Target Node: ${targetNode.region}, ${targetNode.country}
Sticky Session ID: ${tunnelDetails.sessionId}

[Proxy Credentials]
Host / Server: ${tunnelDetails.proxyHost}
Port: ${tunnelDetails.proxyPort}
Username: ${tunnelDetails.proxyUsername}
Password: ${tunnelDetails.proxyPassword}
Protocol: HTTP / SOCKS5

INSTRUCTIONS:
1. Open your system proxy settings or a browser extension like FoxyProxy.
2. Enter the Host, Port, Username, and Password above.
3. Your IP is now securely masked.
`;

    const blob = new Blob([configText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NapiNode-${targetNode.code}-${tunnelDetails.sessionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl shadow-2xl max-w-md mx-auto w-full transition-all duration-500 hover:border-white/20">
      <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${isConnected ? 'bg-green-500' : 'bg-blue-600'}`}></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-8">
          {isConnected ? (
            <Shield className="h-8 w-8 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
          ) : (
            <ShieldAlert className="h-8 w-8 text-gray-500" />
          )}
          <h2 className="text-2xl font-bold tracking-wide text-white">
            {isConnected ? 'Stealth Active' : 'Unprotected'}
          </h2>
        </div>

        <CountrySelector 
          selectedNode={targetNode} 
          onSelect={setTargetNode}
          disabled={isConnected || isConnecting} 
        />

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`group relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
            isConnected 
              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-2 border-green-500/50 hover:shadow-[0_0_40px_rgba(74,222,128,0.3)]' 
              : 'bg-white/5 text-gray-300 hover:bg-white/10 border-2 border-white/10 hover:border-white/30'
          }`}
        >
          <Power className={`h-12 w-12 transition-transform duration-500 ${isConnecting ? 'animate-pulse text-blue-400' : 'group-hover:scale-110'}`} />
        </button>

        <p className={`mt-8 text-sm font-medium tracking-wide ${isConnecting ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`}>
          {isConnecting 
            ? `Routing through ${targetNode.region}...` 
            : (isConnected ? `Secured via ${targetNode.region} Node` : 'System Ready')}
        </p>

        {/* NEW: Download Config Button appears only when connected */}
        {isConnected && tunnelDetails && (
          <div className="mt-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button 
              onClick={downloadConfig}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 transition-all hover:border-white/30"
            >
              <Download className="h-4 w-4" />
              <span>Download Config</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}