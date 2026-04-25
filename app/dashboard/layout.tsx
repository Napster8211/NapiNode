import { Shield, Globe, CreditCard, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-md hidden md:flex flex-col">
        <div className="p-6 flex items-center space-x-3 border-b border-white/10">
          <Shield className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold tracking-wider">NapiNode</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Globe />} label="Network" active />
          <NavItem icon={<CreditCard />} label="Billing & Plans" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center space-x-3 w-full p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full"></div>
        
        <div className="relative z-10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Quick helper component for the sidebar links
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center space-x-3 p-3 rounded-xl transition ${
      active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}>
      <div className="h-5 w-5">{icon}</div>
      <span className="font-medium">{label}</span>
    </a>
  );
}