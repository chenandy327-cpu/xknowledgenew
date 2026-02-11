
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  // 密码强度检查
  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) {
      setPasswordStrength('weak');
    } else if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  // 处理密码输入变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

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

          {showResetForm ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              
              if (newPassword !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
              }
              
              try {
                await api.request('/auth/reset-password', {
                  method: 'POST',
                  body: JSON.stringify({ token: resetToken, new_password: newPassword }),
                });
                alert('Password reset successfully!');
                setShowResetForm(false);
                setShowForgotPassword(false);
                setResetToken('');
                setNewPassword('');
                setConfirmPassword('');
              } catch (err) {
                setError('Failed to reset password. Please check your token and try again.');
                console.error('Reset password error:', err);
              } finally {
                setLoading(false);
              }
            }} className="space-y-6">
              <h3 className="text-xl font-bold dark:text-white mb-4">Reset Password</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reset Token</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Enter reset token"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="••••••••"
                  required
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
                {loading ? 'Resetting...' : 'Reset Password'} 
                <span className="material-symbols-outlined text-base">lock_reset</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  className="flex-1 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setShowForgotPassword(false);
                  }}
                  className="flex-1 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : showForgotPassword ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              try {
                const response = await api.request('/auth/forgot-password', {
                  method: 'POST',
                  body: JSON.stringify({ email }),
                });
                
                // For testing purposes, show the reset token
                if (response.reset_token) {
                  alert(`Password reset email sent!\nReset token: ${response.reset_token}`);
                  setResetToken(response.reset_token);
                  setShowResetForm(true);
                } else {
                  alert('Password reset email sent!');
                  setShowForgotPassword(false);
                }
              } catch (err) {
                setError('Failed to send password reset email. Please try again.');
                console.error('Forgot password error:', err);
              } finally {
                setLoading(false);
              }
            }} className="space-y-6">
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
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Reset Email'} 
                <span className="material-symbols-outlined text-base">mail</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Back to Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="flex-1 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Enter Reset Token
                </button>
              </div>
            </form>
          ) : (
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-4 pr-12 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {!isLogin && password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'strong' ? 'text-green-500' :
                        passwordStrength === 'medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {passwordStrength === 'strong' ? 'Strong' :
                         passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          passwordStrength === 'strong' ? 'bg-green-500 w-full' :
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
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
          )}

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
