import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Phone, MapPin, Check } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Демо данные
  const fillDemoCredentials = () => {
    setEmail('demo@aroma.com');
    setPassword('aroma12345');
    if (!isLoginTab) {
      setName('Alex Luxe');
      setPhone('+380 99 123 4567');
      setAddress('Kyiv, Khreshchatyk St 12, apt 44');
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!isLoginTab && !name) {
      setError('Please specify your name');
      return;
    }

    const storedUsersJson = localStorage.getItem('aroma_users');
    const users: User[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    if (isLoginTab) {
      // Вход
      const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (email.toLowerCase() === 'demo@aroma.com' && password === 'aroma12345') {
        const demoUser: User = {
          id: 'demo-user-id',
          email: 'demo@aroma.com',
          name: 'Alex Luxe',
          phone: '+380 99 123 4567',
          address: 'Kyiv, Khreshchatyk St 12, apt 44',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          joinedAt: new Date().toISOString(),
          loyaltyStatus: 'Silver',
          totalSpent: 4800,
        };
        if (!users.some(u => u.email === 'demo@aroma.com')) {
          users.push(demoUser);
          localStorage.setItem('aroma_users', JSON.stringify(users));
        }
        localStorage.setItem('aroma_current_user', JSON.stringify(demoUser));
        onLogin(demoUser);
        setSuccessMsg('Successfully logged in!');
        setTimeout(() => {
          onClose();
        }, 800);
        return;
      }

      if (!userFound) {
        setError('User with this email not found. Register or use Demo fill.');
        return;
      }

      localStorage.setItem('aroma_current_user', JSON.stringify(userFound));
      onLogin(userFound);
      setSuccessMsg('Welcome back!');
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      // Регистрация
      const alreadyExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (alreadyExists || email.toLowerCase() === 'demo@aroma.com') {
        setError('User with this email already exists');
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name,
        phone: phone || '',
        address: address || '',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        joinedAt: new Date().toISOString(),
        loyaltyStatus: 'Bronze',
        totalSpent: 0
      };

      users.push(newUser);
      localStorage.setItem('aroma_users', JSON.stringify(users));
      localStorage.setItem('aroma_current_user', JSON.stringify(newUser));
      onLogin(newUser);
      setSuccessMsg('Registration completed successfully!');
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            id="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            id="auth-modal-content"
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[darkblue] border border-[#d8edf1]/30 text-white shadow-2xl z-10"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#d8edf1]" />

            <div className="p-6">
              {/* Шапка */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Client Account Access</h2>
                </div>
                <button
                  id="close-auth-modal"
                  onClick={onClose}
                  className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Вкладки */}
              <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 mb-6">
                <button
                  id="tab-login"
                  type="button"
                  onClick={() => { setIsLoginTab(true); setError(''); }}
                  className={`flex-1 text-center py-2 text-sm font-medium rounded-md transition-all ${
                    isLoginTab
                      ? 'bg-[#d8edf1]/20 text-white border border-[#d8edf1]/30 font-semibold'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Log In
                </button>
                <button
                  id="tab-register"
                  type="button"
                  onClick={() => { setIsLoginTab(false); setError(''); }}
                  className={`flex-1 text-center py-2 text-sm font-medium rounded-md transition-all ${
                    !isLoginTab
                      ? 'bg-[#d8edf1]/20 text-white border border-[#d8edf1]/30 font-semibold'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Кнопка заполнения */}
              <div className="mb-4 text-center">
                <button
                  id="demo-fill-btn"
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-all font-medium inline-flex items-center gap-1.5"
                >
                  Fill Demo Credentials
                </button>
              </div>

              {/* Уведомления */}
              {error && (
                <div id="auth-error" className="mb-4 p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg text-center font-medium">
                  {error}
                </div>
              )}
              {successMsg && (
                <div id="auth-success" className="mb-4 p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {successMsg}
                </div>
              )}

              {/* Форма */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginTab && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 label-form">
                      Full Name <span className="text-[#d8edf1]">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="auth-input-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Versace"
                        className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1] focus:ring-1 focus:ring-[#d8edf1] transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 label-form">
                    Email Address <span className="text-[#d8edf1]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@aroma.com"
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1] focus:ring-1 focus:ring-[#d8edf1] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 label-form">
                    Password <span className="text-[#d8edf1]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-input-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1] focus:ring-1 focus:ring-[#d8edf1] transition-colors"
                    />
                  </div>
                </div>

                {!isLoginTab && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 label-form">
                        Phone (for Delivery)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          id="auth-input-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+380 99 999 9999"
                          className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1] focus:ring-1 focus:ring-[#d8edf1] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 label-form">
                        Shipping Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          id="auth-input-address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Kyiv, Khreshchatyk St, 1"
                          className="w-full bg-black/30 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d8edf1] focus:ring-1 focus:ring-[#d8edf1] transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  id="auth-submit-btn"
                  type="submit"
                  className="w-full mt-4 bg-[#d8edf1] hover:bg-[#b0dfe5] text-black font-semibold py-3 px-4 rounded-xl shadow-lg active:scale-98 transition-all duration-200 text-sm"
                >
                  {isLoginTab ? 'Access Dashboard' : 'Register Now'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
