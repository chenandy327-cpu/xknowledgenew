
import React, { useState } from 'react';
import { useApp } from '../App';
import { api } from '../services/api';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('explorer@knowledge.art');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.login(email, password);
      api.setToken(response.access_token);
      login();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Visual Section */}
      <section className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-bgDark items-center justify-center">
        <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at 40% 50%, #7f13ec 0%, #3a007d 100%)' }}></div>
        <img
          alt="Nebula"
          className="absolute inset-0 object-cover mix-blend-screen opacity-60"
          src="https://picsum.photos/id/903/1200/800"
        />
        <div className="relative z-10 text-white p-12 max-w-xl">
          <div className="mb-8 inline-block px-4 py-1 border border-primary/50 rounded-full bg-primary/10 backdrop-blur-sm">
            <span className="text-sm font-medium tracking-widest uppercase">Portfolio Evolution</span>
          </div>
          <h1 className="text-7xl font-bold mb-6 leading-tight">x²: Square your potential.</h1>
          <p className="text-xl text-white/50 font-light mb-12">Dive into the artistic knowledge nebula where ideas collide and portfolios transform into legacies.</p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-bgDark"
                  src={`https://picsum.photos/id/${60 + i}/100/100`}
                  alt="User"
                />
              ))}
            </div>
            <span className="text-sm text-white/40">+2,400 Artists joined today</span>
          </div>
        </div>
      </section>

      {/* Right Form Section */}
      <section className="w-full lg:w-2/5 flex flex-col justify-center items-center px-8 lg:px-20 bg-white dark:bg-bgDark">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <div className="text-4xl font-bold dark:text-white mb-2">x<span className="text-primary text-5xl">²</span></div>
            <h2 className="text-2xl font-bold dark:text-white">Enter the Orbit</h2>
            <p className="text-slate-500 mt-2">Welcome back to the knowledge explorer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="explorer@knowledge.art"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Launching...' : 'Launch Explorer'} <span className="material-symbols-outlined text-base">rocket_launch</span>
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              New to the nebula? <a href="#" className="text-primary font-bold hover:underline">Join the Orbit</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
