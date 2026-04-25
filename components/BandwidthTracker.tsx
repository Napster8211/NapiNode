'use client';

export default function BandwidthTracker() {
  // Hardcoded for UI visualization right now
  const usedMB = 750; 
  const totalMB = 1024; // 1GB
  const percentage = (usedMB / totalMB) * 100;

  return (
    <div className="mt-6 w-full max-w-md mx-auto rounded-2xl border border-white/5 bg-black/40 p-5 backdrop-blur-md">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Taste Test Quota</p>
          <p className="text-lg font-bold text-white">{usedMB} MB <span className="text-sm font-normal text-gray-500">/ 1 GB</span></p>
        </div>
        <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition">
          Upgrade Plan
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${percentage > 85 ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {percentage > 85 && (
        <p className="text-xs text-red-400 mt-2">Approaching data limit. Upgrade to keep Sticky IP active.</p>
      )}
    </div>
  );
}