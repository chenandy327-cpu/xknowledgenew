
import React, { useState } from 'react';
import { useApp } from '../App';
import { api } from '../src/services/api';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login logic
        const response = await api.login(email, password);
        api.setToken(response.access_token);
        login();
      } else {
        // Register logic
        const response = await api.register(email, password, name);
        api.setToken(response.access_token);
        login();
      }
    } catch (err) {
      setError(isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.');
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, err);
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
            <h2 className="text-2xl font-bold dark:text-white">{isLogin ? 'Enter the Orbit' : 'Join the Nebula'}</h2>
            <p className="text-slate-500 mt-2">{isLogin ? 'Welcome back to the knowledge explorer.' : 'Create your account to start exploring.'}</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-8 border-b border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center font-bold transition-colors ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center font-bold transition-colors ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (only for registration) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="explorer@knowledge.art"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Launch Explorer' : 'Join the Orbit')} 
              <span className="material-symbols-outlined text-base">{isLogin ? 'rocket_launch' : 'person_add'}</span>
            </button>
          </form>

          {/* Switch Between Login/Register */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? 'New to the nebula?' : 'Already have an account?'} 
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'Join the Orbit' : 'Launch Explorer'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
