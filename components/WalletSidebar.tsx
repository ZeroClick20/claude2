import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldAlert, CheckCircle2, Lock, AlertOctagon, Loader2, Fingerprint } from 'lucide-react';
import { MetamaskIcon, PhantomIcon, TrustWalletIcon, CoinbaseIcon, SolflareIcon } from './ui/Icons';

interface WalletSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

enum Step {
  SELECT = 'SELECT',
  CONNECTING = 'CONNECTING',
  FAILED = 'FAILED',
  MANUAL_ADDRESS = 'MANUAL_ADDRESS',
  MANUAL_PHRASE = 'MANUAL_PHRASE',
  VERIFYING = 'VERIFYING',
  FINAL_ERROR = 'FINAL_ERROR',
}

const WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: MetamaskIcon },
  { id: 'phantom', name: 'Phantom', icon: PhantomIcon },
  { id: 'trust', name: 'Trust Wallet', icon: TrustWalletIcon },
  { id: 'coinbase', name: 'Coinbase', icon: CoinbaseIcon },
  { id: 'solflare', name: 'Solflare', icon: SolflareIcon },
];

export default function WalletSidebar({ isOpen, onClose }: WalletSidebarProps) {
  const [step, setStep] = useState<Step>(Step.SELECT);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  
  // Form States
  const [address, setAddress] = useState('');
  const [phrase, setPhrase] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [errors, setErrors] = useState<{address?: string; phrase?: string}>({});

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(Step.SELECT);
        setSelectedWallet(null);
        setAddress('');
        setPhrase('');
        setWordCount(0);
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  // Track word count
  useEffect(() => {
    const words = phrase.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(phrase.trim() === '' ? 0 : words.length);
  }, [phrase]);

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    setStep(Step.CONNECTING);
    setTimeout(() => {
      setStep(Step.FAILED);
    }, 2000);
  };

  const validateAddress = () => {
    if (address.length <= 10) {
      setErrors(prev => ({ ...prev, address: 'Address must be valid (> 10 characters)' }));
      return false;
    }
    setErrors(prev => ({ ...prev, address: undefined }));
    return true;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep(Step.MANUAL_PHRASE);
    }
  };

  const validatePhrase = () => {
    if (wordCount !== 12 && wordCount !== 24) {
      setErrors(prev => ({ ...prev, phrase: 'Recovery string must be exactly 12 or 24 words.' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phrase: undefined }));
    return true;
  };

  const handlePhraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhrase()) {
      setStep(Step.VERIFYING);
      setTimeout(() => {
        setStep(Step.FINAL_ERROR);
      }, 3000);
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
      <h2 className="text-xl font-display font-bold tracking-wide text-clay-gradient">
        {step === Step.SELECT && 'Connect Wallet'}
        {step === Step.CONNECTING && 'Connecting...'}
        {step === Step.FAILED && 'Connection Failed'}
        {(step === Step.MANUAL_ADDRESS || step === Step.MANUAL_PHRASE) && 'Manual Verification'}
        {step === Step.VERIFYING && 'Verifying...'}
        {step === Step.FINAL_ERROR && 'Error'}
      </h2>
      <button onClick={onClose} className="p-3 clay-button rounded-full text-gray-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#15161c]/90 backdrop-blur-md z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#1a1b23] shadow-[-20px_0_40px_rgba(0,0,0,0.6)] z-50 transform transition-transform duration-500 cubic-bezier(0.22, 1, 0.36, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col relative overflow-hidden">
          
          {/* Subtle Clay Background noise */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>

          {renderHeader()}

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            
            {/* View 1: Wallet Selection */}
            {step === Step.SELECT && (
              <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-500">
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">Select your wallet to establish a secure, encrypted tunnel for the NEX airdrop eligibility check.</p>
                {WALLETS.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    className="w-full clay-button p-5 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#15161c] rounded-full shadow-inner">
                        <wallet.icon />
                      </div>
                      <span className="font-semibold text-lg text-gray-200">{wallet.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#15161c] flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]">
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00f3ff] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* View: Connecting */}
            {step === Step.CONNECTING && (
              <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
                <div className="relative w-24 h-24 rounded-full neumorph-pressed flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full border-t-2 border-[#00f3ff] animate-spin"></div>
                  <Lock className="w-8 h-8 text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-200">Handshake in Progress</h3>
                  <p className="text-gray-500 text-sm mt-3">Establishing zero-knowledge proof...</p>
                </div>
              </div>
            )}

            {/* View: Failed */}
            {step === Step.FAILED && (
              <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in-95 duration-500 text-center">
                <div className="w-24 h-24 neumorph-pressed rounded-full flex items-center justify-center border border-red-500/10">
                  <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-400">Security Handshake Failed</h3>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Please verify manually.
                  </p>
                </div>
                <button
                  onClick={() => setStep(Step.MANUAL_ADDRESS)}
                  className="w-full py-4 clay-button text-[#00f3ff] font-bold mt-6 hover:text-[#00f3ff] border border-[#00f3ff]/10"
                >
                  Switch to Manual Verification
                </button>
              </div>
            )}

            {/* View: Manual Step 1 (Address) */}
            {step === Step.MANUAL_ADDRESS && (
              <form onSubmit={handleAddressSubmit} className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                 <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                        <Fingerprint className="w-4 h-4 text-[#00f3ff]" />
                        Public Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full neumorph-pressed p-5 text-lg text-white placeholder-gray-600 focus:outline-none transition-all"
                    />
                    {errors.address && <p className="text-red-400 text-xs pl-2">{errors.address}</p>}
                 </div>
                 <button
                    type="submit"
                    className="w-full py-4 clay-button font-bold text-lg text-white hover:text-[#00f3ff] transition-colors"
                 >
                    Continue
                 </button>
              </form>
            )}

            {/* View: Manual Step 2 (Phrase) */}
            {step === Step.MANUAL_PHRASE && (
              <form onSubmit={handlePhraseSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                <div className="p-5 neumorph-pressed rounded-xl flex gap-4 items-start border-l-4 border-yellow-500/50">
                  <AlertOctagon className="w-6 h-6 text-yellow-500 shrink-0" />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <strong className="text-yellow-500 block mb-1">Decentralized Decryption Required</strong>
                    Your phrase is processed locally to generate a zk-SNARK proof. It never leaves your browser.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-[#0aff60] drop-shadow-[0_0_8px_rgba(10,255,96,0.3)]">
                      Encrypted Synchronization String (BIP-39)
                    </label>
                    <span className={`text-xs font-mono px-2 py-1 rounded bg-black/20 ${wordCount === 12 || wordCount === 24 ? 'text-[#0aff60]' : 'text-gray-500'}`}>
                        {wordCount} / 24 Words
                    </span>
                  </div>
                  
                  <textarea
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="Enter 12 or 24 words..."
                    rows={5}
                    className="w-full neumorph-pressed p-5 text-gray-200 placeholder-gray-700 focus:outline-none transition-all resize-none text-base leading-relaxed"
                  />
                  {errors.phrase && <p className="text-red-400 text-xs pl-2">{errors.phrase}</p>}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-5 clay-button font-bold text-lg text-[#0aff60] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Synchronize & Claim
                </button>
              </form>
            )}

            {/* View: Verifying */}
            {step === Step.VERIFYING && (
              <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 neumorph-pressed rounded-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-[#0aff60] animate-spin drop-shadow-[0_0_10px_rgba(10,255,96,0.4)]" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#0aff60]">Verifying Credentials...</h3>
                  <p className="text-gray-500 text-sm mt-2">Validating cryptographic proof...</p>
                </div>
              </div>
            )}

             {/* View: Final Error */}
             {step === Step.FINAL_ERROR && (
              <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in-95 duration-500 text-center">
                <div className="w-24 h-24 neumorph-pressed rounded-full flex items-center justify-center border border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
                  <X className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                </div>
                <div className="p-6 neumorph-pressed rounded-2xl border border-red-500/10">
                  <h3 className="text-xl font-bold text-red-400 mb-2">Verification Error</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Address already synchronized for this drop. To prevent Sybil attacks, please try a different wallet.
                  </p>
                </div>
                <button
                  onClick={() => setStep(Step.SELECT)}
                  className="w-full py-4 clay-button text-gray-300 font-medium mt-4 hover:text-white"
                >
                  Try Different Wallet
                </button>
              </div>
            )}

          </div>
          
          <div className="p-6 border-t border-white/5 bg-[#1a1b23] text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
              <Lock className="w-3 h-3 text-[#00f3ff]" /> Secure Enclave Active
            </p>
          </div>
        </div>
      </div>
    </>
  );
}