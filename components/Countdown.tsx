import React, { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 14, mins: 32, secs: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  const TimeBox = ({ label, val }: { label: string, val: number }) => (
    <div className="flex flex-col items-center gap-3">
      <div className="clay-button w-16 h-16 md:w-24 md:h-24 flex items-center justify-center !rounded-2xl !bg-[#1e1f29]">
        <span className="text-2xl md:text-4xl font-display font-bold text-[#e0e0e0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {format(val)}
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-bold text-gray-500 tracking-[0.2em] uppercase">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-4 md:gap-8 justify-center">
      <TimeBox label="DAYS" val={timeLeft.days} />
      <div className="pt-6 md:pt-8 text-2xl font-bold text-gray-700 animate-pulse">:</div>
      <TimeBox label="HOURS" val={timeLeft.hours} />
      <div className="pt-6 md:pt-8 text-2xl font-bold text-gray-700 animate-pulse">:</div>
      <TimeBox label="MINS" val={timeLeft.mins} />
      <div className="pt-6 md:pt-8 text-2xl font-bold text-gray-700 animate-pulse">:</div>
      <TimeBox label="SECS" val={timeLeft.secs} />
    </div>
  );
}