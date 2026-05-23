
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'otp' | 'reset';

const GHOST_AVATAR = "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=200&h=200&auto=format&fit=crop";

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // Simulated User Registry (Mock DB)
  const [registry, setRegistry] = useState<any[]>(() => {
    const saved = localStorage.getItem('pg_registry');
    return saved ? JSON.parse(saved) : [
      { email: 'lost@void.com', password: 'password', name: 'The Nameless One', handle: 'ghost_0' }
    ];
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    handle: '',
    otp: '',
    newPassword: ''
  });

  useEffect(() => {
    localStorage.setItem('pg_registry', JSON.stringify(registry));
  }, [registry]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = registry.find(u => u.email === formData.email);
    if (exists) {
      setError("This soul is already bound to the ledger (Email already registered).");
      return;
    }

    const newUser = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      handle: formData.handle
    };

    setRegistry([...registry, newUser]);
    onAuthSuccess({
      name: formData.name,
      email: formData.email,
      bio: `A new gravedigger known as ${formData.handle}.`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rank: 'Apprentice Ghoul',
      location: 'The Threshold',
      skills: ['Code Archaeology'],
      profileImage: GHOST_AVATAR
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = registry.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      onAuthSuccess({
        name: user.name,
        email: user.email,
        bio: `The returning gravedigger ${user.handle}.`,
        joinedDate: 'Oct 2024',
        rank: 'Resurrected Spirit',
        location: 'Digital Limbo',
        skills: ['Returning'],
        profileImage: GHOST_AVATAR
      });
    } else {
      setError("Incorrect credentials. The void remains silent.");
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    const exists = registry.find(u => u.email === formData.email);
    if (exists) {
      setMode('otp');
      setMessage(`A spectral pulse (OTP) has been sent to ${formData.email}. Use code: 1234`);
      setError(null);
    } else {
      setError("That digital signal is not found in our records.");
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp === '1234') {
      setMode('reset');
      setError(null);
      setMessage(null);
    } else {
      setError("The frequency is incorrect. Try 1234.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistry(registry.map(u => 
      u.email === formData.email ? { ...u, password: formData.newPassword } : u
    ));
    setMode('login');
    setMessage("Secret Key updated. You may now return to the grave.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-violet-600/20 flex items-center justify-center border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
            <i className="fa-solid fa-ghost text-violet-400 text-4xl animate-bounce"></i>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">Project Graveyard</h1>
          <p className="mono text-[10px] uppercase tracking-[0.4em] text-stone-500">Mausoleum of Abandoned Dreams</p>
        </div>

        <div className="bg-stone-900/60 backdrop-blur-xl border border-stone-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
          
          {(mode === 'login' || mode === 'signup') && (
            <div className="flex justify-center gap-8 mb-10 border-b border-stone-800 pb-6">
              <button 
                onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
                className={`mono text-xs uppercase tracking-widest transition-all ${mode === 'signup' ? 'text-violet-400 font-black' : 'text-stone-600 hover:text-stone-400'}`}
              >
                Sign the Ledger
              </button>
              <button 
                onClick={() => { setMode('login'); setError(null); setMessage(null); }}
                className={`mono text-xs uppercase tracking-widest transition-all ${mode === 'login' ? 'text-violet-400 font-black' : 'text-stone-600 hover:text-stone-400'}`}
              >
                Return to Grave
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-900/50 text-red-400 text-[10px] mono flex items-center gap-3 animate-in slide-in-from-top-2">
              <i className="fa-solid fa-skull"></i>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 text-[10px] mono flex items-center gap-3 animate-in slide-in-from-top-2">
              <i className="fa-solid fa-sparkles"></i>
              {message}
            </div>
          )}

          <form onSubmit={
            mode === 'signup' ? handleSignup : 
            mode === 'login' ? handleLogin : 
            mode === 'forgot' ? handleForgot :
            mode === 'otp' ? handleVerifyOTP :
            handleResetPassword
          } className="space-y-6">
            
            {(mode === 'signup') && (
              <>
                <div className="space-y-2">
                  <label className="mono text-[9px] uppercase tracking-widest text-stone-500 ml-1">True Name</label>
                  <input required className="auth-input" placeholder="Victor Frankenstein" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="mono text-[9px] uppercase tracking-widest text-stone-500 ml-1">Handle</label>
                  <input required className="auth-input" placeholder="@ghost_coder" value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} />
                </div>
              </>
            )}

            {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
              <div className="space-y-2">
                <label className="mono text-[9px] uppercase tracking-widest text-stone-500 ml-1">Digital Signal (Email)</label>
                <input required type="email" className="auth-input" placeholder="your@soul.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-2">
                <label className="mono text-[9px] uppercase tracking-widest text-stone-500 ml-1">Secret Key</label>
                <input required type="password" minLength={6} className="auth-input" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            )}

            {mode === 'otp' && (
              <div className="space-y-4 text-center">
                <label className="mono text-[10px] uppercase tracking-widest text-violet-400">Enter Verification Frequency (OTP)</label>
                <input required maxLength={4} className="auth-input text-center text-2xl tracking-[1em] font-black" placeholder="0000" value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} />
              </div>
            )}

            {mode === 'reset' && (
              <div className="space-y-4">
                <label className="mono text-[9px] uppercase tracking-widest text-stone-500 ml-1">New Secret Key</label>
                <input required type="password" minLength={6} className="auth-input" placeholder="••••••••" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} />
              </div>
            )}

            <button type="submit" className="auth-btn">
              {mode === 'signup' && 'Sign the Ledger'}
              {mode === 'login' && 'Resume Ritual'}
              {mode === 'forgot' && 'Send Spectral Pulse'}
              {mode === 'otp' && 'Verify Frequency'}
              {mode === 'reset' && 'Update Record'}
              <i className="fa-solid fa-arrow-right-to-bracket text-xs"></i>
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            {mode === 'login' && (
              <button 
                onClick={() => { setMode('forgot'); setError(null); setMessage(null); }}
                className="text-[10px] mono text-stone-500 hover:text-violet-400 uppercase tracking-widest transition-colors"
              >
                Forgotten Secret Key?
              </button>
            )}
            {(mode === 'forgot' || mode === 'otp' || mode === 'reset') && (
              <button 
                onClick={() => { setMode('login'); setError(null); setMessage(null); }}
                className="text-[10px] mono text-stone-500 hover:text-violet-400 uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Return to Login
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .auth-input {
          width: 100%;
          background: rgba(10, 10, 12, 0.5);
          border: 1px solid #2d2d35;
          border-radius: 1rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          outline: none;
          transition: all 0.3s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .auth-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
        }
        .auth-btn {
          width: 100%;
          background: #7c3aed;
          color: white;
          padding: 1rem;
          border-radius: 1rem;
          font-weight: 900;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
        }
        .auth-btn:hover {
          background: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
        }
        .auth-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default AuthView;
