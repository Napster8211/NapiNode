import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <Shield className="h-20 w-20 text-blue-500 mb-8" />
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          Unblockable. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Residential Stealth.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-10 font-medium">
          NapiNode gives you a clean, dedicated residential IP. No data center flags. No Facebook shadowbans. Just pure, unrestricted access.
        </p>
        
        <Link 
          href="/dashboard"
          className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
        >
          Launch NapiNode Dashboard
        </Link>
      </div>
    </main>
  );
}