'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle Sign In
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        // Handle Sign Up
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // When they sign up, insert their initial profile into our custom users table
        if (data.user) {
          await supabase.from('users').insert([{ 
            id: data.user.id, 
            email: data.user.email,
            plan_tier: 'free_tier',
            total_bandwidth_used: 0
          }]);
        }
        
        // Supabase sends a confirmation email by default
        alert('Registration successful! Please check your email to verify your account.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500/10 p-3 rounded-2xl mb-4 border border-blue-500/20">
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {isLogin ? 'Access Command Center' : 'Claim Your 1GB Free Tier'}
          </h2>
          <p className="text-gray-400 text-sm mt-2 text-center">
            {isLogin ? 'Enter your credentials to manage your nodes.' : 'Create a NapiNode account to instantly bypass restrictions.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
              placeholder="admin@napster.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <span>{isLogin ? 'Initialize Session' : 'Deploy Node'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an access key?" : "Already deployed a node?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-2 text-blue-400 font-semibold hover:text-blue-300 transition"
            >
              {isLogin ? 'Register Here' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}