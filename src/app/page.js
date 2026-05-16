'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Moon } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');

  // Set dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 18) setGreeting("Good afternoon");
    else if (hour >= 18 && hour < 22) setGreeting("Good evening");
    else setGreeting("Still awake?");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) return; 

    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      localStorage.setItem('ignite_user', email);
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#050B14] via-[#0A0B1A] to-[#120B2E]">
      
      {/* Background Elements */}
      {/* Glowing Moon/Orb */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[5000ms]" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Animated Stars / Particles (Simulated with CSS) */}
      <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] animate-ping duration-[3000ms]" />
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white/50 rounded-full shadow-[0_0_5px_1px_rgba(255,255,255,0.4)] animate-pulse duration-[2000ms]" />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-brand-purple/80 rounded-full shadow-[0_0_10px_2px_rgba(184,168,232,0.8)] animate-pulse duration-[4000ms]" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-md mx-4 relative z-10">
        
        {/* Dynamic Greeting */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-brand-purple text-xs font-medium uppercase tracking-widest">
            <Moon size={14} />
            {greeting}
          </div>
          <h1 className="font-outfit text-4xl font-semibold tracking-tight text-white mb-2">
            Welcome back to Ignite
          </h1>
          <p className="text-sm text-brand-muted/80">
            Let's improve your sleep tonight
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col gap-6 relative overflow-hidden">
          
          {/* Subtle inner card highlight */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Floating Label Inputs */}
          <div className="flex flex-col gap-5 mt-2">
            
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-transparent border-b-2 border-white/10 px-0 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors placeholder-transparent"
                placeholder="you@example.com"
                required
              />
              <label 
                htmlFor="email" 
                className="absolute left-0 top-3 text-brand-muted text-sm transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-brand-accent peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/70 pointer-events-none"
              >
                Email Address
              </label>
            </div>

            {/* Password Input */}
            <div className="relative mt-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-transparent border-b-2 border-white/10 px-0 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors placeholder-transparent"
                placeholder="Password"
              />
              <label 
                htmlFor="password" 
                className="absolute left-0 top-3 text-brand-muted text-sm transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-brand-accent peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/70 pointer-events-none"
              >
                Password
              </label>
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-end w-full mt-2">
            <a href="#" className="text-[11px] text-brand-muted hover:text-brand-purple transition-colors">
              Forgot password?
            </a>
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full relative group mt-2 bg-gradient-to-r from-brand-accent to-[#5aab94] text-[#0a0f1a] font-semibold py-4 rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(109,213,184,0.4)]"
          >
            {/* Button subtle inner glow */}
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            
            <span className="relative flex items-center justify-center gap-2 tracking-wide">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0a0f1a]/30 border-t-[#0a0f1a] rounded-full animate-spin" />
              ) : (
                <>
                  Continue your sleep journey
                  <Sparkles size={16} className="opacity-80" />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center text-[12px] text-brand-muted">
          Don't have an account?{' '}
          <a href="#" className="text-white hover:text-brand-accent transition-colors underline decoration-white/20 underline-offset-4">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
