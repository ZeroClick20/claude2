import React, { useState, useEffect } from 'react';
import { Wallet, ChevronRight, Zap } from 'lucide-react';
import WalletSidebar from './components/WalletSidebar';
import Countdown from './components/Countdown';
import Ticker from './components/Ticker';

export default function App() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Smooth Cursor & Parallax Logic
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setMousePos({ 
        x: (window.innerWidth / 2 - e.clientX) / 25, 
        y: (window.innerHeight / 2 - e.clientY) / 25 
      });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headlineWords = ["The", "Future", "of", "Web3", "Rewards"];

  return (
    <div className="relative min-h-screen w-full bg-[#1a1b23] text-[#e0e0e0] overflow-hidden font-sans selection:bg-[#00f3ff]/30">
      
      {/* Custom Cursor */}
      <div 
        className="cursor-dot"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
      />
      <div 
        className="cursor-outline"
        style={{ 
          left: `${cursorPos.x}px`, 
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isWalletOpen ? 0 : 1})`,
          opacity: isWalletOpen ? 0 : 1
        }} 
      />

      {/* 3D Parallax Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-[10%] left-[20%] w-96 h-96 bg-[#bc13fe] rounded-full blur-[120px] opacity-20 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div 
          className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#00f3ff] rounded-full blur-[140px] opacity-15 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        />
        <div 
          className="absolute top-[40%] left-[50%] w-64 h-64 bg-[#0aff60] rounded-full blur-[100px] opacity-10 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 clay-button flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Zap className="text-[#00f3ff] fill-[#00f3ff]/20 w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-wider text-clay-gradient">NEX<span className="text-[#00f3ff]">.PROTOCOL</span></span>
        </div>
        
        <button 
          onClick={() => setIsWalletOpen(true)}
          className="clay-button px-6 py-3 flex items-center gap-2 font-semibold text-sm tracking-wide text-[#e0e0e0] group"
        >
          <div className="w-2 h-2 rounded-full bg-[#0aff60] shadow-[0_0_10px_#0aff60] animate-pulse" />
          Connect Wallet
          <Wallet className="w-4 h-4 ml-2 text-[#00f3ff] group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pt-16 pb-24 flex flex-col items-center justify-center min-h-[70vh] text-center">
        
        {/* Badge */}
        <div className="clay-card px-8 py-3 mb-12 inline-flex items-center gap-3 animate-float hover:scale-105 transition-transform duration-300">
          <span className="w-2 h-2 rounded-full bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]"></span>
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#00f3ff] text-shadow-sm">System Online // Phase 1</span>
        </div>

        {/* Kinetic Typography Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight tracking-tight mb-8 perspective-1000 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {headlineWords.map((word, i) => (
            <span 
              key={i}
              className="inline-block transition-transform duration-100 ease-out text-clay-gradient drop-shadow-2xl"
              style={{ 
                transform: `translateY(${scrollY * (0.1 * (i + 1))}px) rotateX(${scrollY * 0.02}deg)`,
                opacity: Math.max(0, 1 - scrollY * 0.002)
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-light">
          Claim your NEX allocation today. Join the decentralized revolution and secure your spot in the next generation of governance.
        </p>

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-20">
          <button 
            onClick={() => setIsWalletOpen(true)}
            className="clay-button px-10 py-5 rounded-2xl font-bold text-lg hover:text-[#00f3ff] transition-colors flex items-center gap-3 group"
          >
            Check Eligibility
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Countdown */}
        <div className="clay-card p-8 md:p-12 w-full max-w-4xl mx-auto">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8 font-semibold">Claims closing in</p>
          <Countdown />
        </div>

      </main>

      {/* Footer Ticker */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Ticker />
      </div>

      {/* Wallet Sidebar */}
      <WalletSidebar 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
      />
      
    </div>
  );
}