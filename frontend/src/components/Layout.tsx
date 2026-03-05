import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Trophy, BarChart3, Users } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-neutral-950/50 backdrop-blur-xl border-b border-white/5">
      {/* IMPROVED LOGO: Clickable to Home */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-3 group transition-transform hover:scale-105"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-red-600 flex items-center justify-center font-black italic text-xl skew-x-[-12deg] group-hover:bg-white group-hover:text-red-600 transition-colors duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            F1
          </div>
          <div className="absolute -inset-1 bg-red-600/20 blur-lg group-hover:bg-white/20 transition-colors" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white">Vision</span>
          <span className="text-[8px] font-bold text-red-500 tracking-[0.3em] uppercase opacity-80">Intelligence System</span>
        </div>
      </button>

      {/* DESKTOP NAV */}
      <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {[
          { name: 'Home', path: '/' },
          { name: 'Teams', path: '/teams' },
          { name: 'Drivers', path: '/drivers' },
          { name: 'Track Viewer', path: '/track' },
          { name: 'Live Feed', path: '/dashboard' }
        ].map((link) => (
          <button 
            key={link.name}
            onClick={() => navigate(link.path)} 
            className="hover:text-white transition-all relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all group-hover:w-full" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* CONNECT API: Functional */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="hidden md:flex items-center gap-2 bg-white text-black px-5 py-2.5 text-[10px] font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95"
        >
          <Zap size={14} fill="currentColor" />
          Connect Live API
        </button>

        {/* MOBILE MENU TOGGLE */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-white"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-neutral-950 z-[90] flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {[
              { name: 'Home', path: '/' },
              { name: 'Teams', path: '/teams' },
              { name: 'Drivers', path: '/drivers' },
              { name: 'Track Viewer', path: '/track' },
              { name: 'Dashboard', path: '/dashboard' }
            ].map((link) => (
              <button 
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setIsMenuOpen(false);
                }}
                className="text-4xl font-black italic uppercase text-neutral-500 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 md:gap-8">
      {[
        { icon: <Trophy size={18} />, label: "Standings", path: '/dashboard' },
        { icon: <BarChart3 size={18} />, label: "Analytics", path: '/dashboard' },
        { icon: <Users size={18} />, label: "Community", path: '/' },
        { icon: <Zap size={18} />, label: "Live", path: '/track' }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + (i * 0.1) }}
          className="group relative flex items-center"
        >
          <button 
            onClick={() => navigate(item.path)}
            className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/5 text-neutral-500 group-hover:text-white group-hover:border-red-600/50 group-hover:bg-neutral-800 transition-all cursor-pointer shadow-xl active:scale-90"
          >
            {item.icon}
          </button>
          <span className="absolute left-full ml-4 px-3 py-1 bg-red-600 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-lg">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export { Navbar, Sidebar };
