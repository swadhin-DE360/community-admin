import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ward18.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock network request delay for realistic interaction
    setTimeout(() => {
      localStorage.setItem('ward18_admin_logged_in', 'true');
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 relative overflow-hidden px-4">
      {/* Decorative Background Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xl relative z-10 flex flex-col items-center">
        {/* Logo and Branding */}
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
          <ShieldAlert className="text-white w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-charcoal tracking-tight text-center">
          WARD 18
        </h1>
        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-0.5 mb-8 text-center">
          Citizen Portal Admin Panel
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ward18.in"
                className="w-full bg-white border border-neutral-250 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-neutral-250 rounded-xl pl-10 pr-10 py-2.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center text-xs font-semibold text-neutral-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-neutral-300 text-primary focus:ring-primary h-4 w-4" 
              />
              Remember me
            </label>
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying Credentials...
              </>
            ) : (
              'Access Admin Portal'
            )}
          </Button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-[10px] text-neutral-400 font-medium">
          Authorized personnel only. Access logging is active.
        </div>
      </div>
    </div>
  );
}
