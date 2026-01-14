import React from 'react';

const FAKE_CLAIMS = [
  { addr: '0x71...3A2', amount: '450 NEX' },
  { addr: '0x8a...B91', amount: '1,200 NEX' },
  { addr: '0x1c...44F', amount: '320 NEX' },
  { addr: '0x99...E21', amount: '8,500 NEX' },
  { addr: '0x3d...F00', amount: '210 NEX' },
  { addr: '0xb2...11A', amount: '950 NEX' },
  { addr: '0x55...C88', amount: '5,000 NEX' },
  { addr: '0xfa...777', amount: '600 NEX' },
];

export default function Ticker() {
  return (
    <div className="w-full bg-neon-blue/5 border-y border-neon-blue/10 h-12 flex items-center overflow-hidden relative">
      <div className="flex animate-scroll whitespace-nowrap gap-12 px-4">
        {[...FAKE_CLAIMS, ...FAKE_CLAIMS, ...FAKE_CLAIMS].map((claim, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-display tracking-wider">
            <span className="text-gray-400">{claim.addr}</span>
            <span className="text-neon-blue font-bold">claimed {claim.amount}</span>
            <span className="text-xs text-gray-600 mx-2">•</span>
          </div>
        ))}
      </div>
      {/* Gradients to fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
    </div>
  );
}