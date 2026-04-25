'use client'; // Add this to the top so it can handle state!

import { useState } from 'react';
import ConnectionCard from '@/components/ConnectionCard';
import BandwidthTracker from '@/components/BandwidthTracker';

export default function DashboardPage() {
  // Global dashboard state
  const [isVpnActive, setIsVpnActive] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<any>(null);

  // This function catches the data from the ConnectionCard
  const handleConnectionChange = (status: boolean, details?: any, location?: any) => {
    setIsVpnActive(status);
    setSessionDetails(details);
    setActiveNode(location);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Napster</h1>
        <p className="text-gray-400">Secure your connection and bypass restrictions instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: The Main Connection Interface */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Pass the callback to the card */}
          <ConnectionCard onConnectionChange={handleConnectionChange} />
        </div>

        {/* Right Column: Status & Bandwidth */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* DYNAMIC Active Status Box */}
          <div className={`border rounded-2xl p-6 backdrop-blur-md transition-colors duration-500 ${
            isVpnActive ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10'
          }`}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Current Session</h3>
            <div className="space-y-3">
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Assigned Node</span>
                <span className={isVpnActive ? "text-white font-mono" : "text-gray-600 font-mono"}>
                  {isVpnActive ? `Decodo Gate (${activeNode?.code})` : 'Offline'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sticky Session ID</span>
                <span className={isVpnActive ? "text-green-400 font-mono text-sm" : "text-gray-600 font-mono"}>
                  {isVpnActive ? sessionDetails?.sessionId : '---'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Protocol</span>
                <span className={isVpnActive ? "text-white" : "text-gray-600"}>
                  {isVpnActive ? 'WireGuard Stealth' : '---'}
                </span>
              </div>

            </div>
          </div>

          <BandwidthTracker />
        </div>
      </div>
    </div>
  );
}