'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Tracker() {
  const router = useRouter();

  const [bHour, setBHour] = useState('10');
  const [bMin, setBMin] = useState('00');
  const [bAmPm, setBAmPm] = useState('PM');

  const [wHour, setWHour] = useState('07');
  const [wMin, setWMin] = useState('00');
  const [wAmPm, setWAmPm] = useState('AM');

  const [quality, setQuality] = useState(0);
  const [saved, setSaved] = useState(false);

  const qualityOptions = [
    { emoji: '😞', label: 'Terrible' },
    { emoji: '😕', label: 'Poor' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😌', label: 'Perfect' },
  ];

  function convertTo24(hour, min, ampm) {
    let h = parseInt(hour, 10);
    const m = parseInt(min, 10);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return { h, m };
  }

  function getHoursSlept() {
    const bed = convertTo24(bHour, bMin, bAmPm);
    const wake = convertTo24(wHour, wMin, wAmPm);
    let diff = (wake.h * 60 + wake.m) - (bed.h * 60 + bed.m);
    if (diff < 0) diff += 1440;
    return (diff / 60).toFixed(1);
  }

  function handleSave() {
    if (quality === 0) return;
    const qualityData = qualityOptions[quality - 1] || { emoji: '', label: '' };

    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      bedtime: `${bHour}:${bMin} ${bAmPm}`,
      waketime: `${wHour}:${wMin} ${wAmPm}`,
      hours,
      quality,
      emoji: qualityData.emoji
    };

    const savedLogs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
    localStorage.setItem('sleepLogs', JSON.stringify([newLog, ...savedLogs]));

    setSaved(true);
    setQuality(0);
    setTimeout(() => {
      setSaved(false);
      router.push('/dashboard');
    }, 1500);
  }

  const hours = getHoursSlept();

  let advice = "You need to log your sleep to get insights.";
  if (hours > 0 && hours < 6) advice = "You're sleep deprived. Aim for an earlier bedtime tonight.";
  else if (hours >= 6 && hours < 7) advice = "You're getting close, but 7+ hours is optimal.";
  else if (hours >= 7 && hours <= 9) advice = "Perfect duration! Keep this rhythm going.";
  else if (hours > 9) advice = "You slept a lot! Make sure you aren't oversleeping.";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-10">
        <div className="inline-block text-[10px] font-medium tracking-widest uppercase text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full mb-5">
          Sleep Coach
        </div>
        <h1 className="font-outfit text-5xl font-semibold tracking-tight mb-2">
          Log <span className="text-brand-purple">Sleep</span>
        </h1>
        <p className="text-xs font-light text-brand-muted uppercase tracking-widest">
          Build better habits tonight
        </p>
      </div>

      <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-8 shadow-xl">
        <span className="block text-[10px] font-semibold text-brand-muted tracking-widest uppercase mb-4">
          Time Entry
        </span>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Bedtime */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col">
            <label className="text-[10px] font-medium text-brand-muted uppercase tracking-widest mb-2">Bedtime</label>
            <div className="flex items-center gap-1">
              <select className="bg-transparent text-brand-text font-outfit text-xl font-medium outline-none cursor-pointer appearance-none text-center" value={bHour} onChange={e => setBHour(e.target.value)}>
                {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h} className="bg-brand-card">{h}</option>)}
              </select>
              <span className="text-brand-muted font-bold">:</span>
              <select className="bg-transparent text-brand-text font-outfit text-xl font-medium outline-none cursor-pointer appearance-none text-center" value={bMin} onChange={e => setBMin(e.target.value)}>
                {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m} className="bg-brand-card">{m}</option>)}
              </select>
              <button className="ml-auto bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 px-2 py-1 rounded text-xs font-semibold transition-colors" onClick={() => setBAmPm(bAmPm === 'AM' ? 'PM' : 'AM')}>
                {bAmPm}
              </button>
            </div>
          </div>

          {/* Waketime */}
          <div className="bg-brand-bg border border-brand-border rounded-xl p-4 flex flex-col">
            <label className="text-[10px] font-medium text-brand-muted uppercase tracking-widest mb-2">Wake up</label>
            <div className="flex items-center gap-1">
              <select className="bg-transparent text-brand-text font-outfit text-xl font-medium outline-none cursor-pointer appearance-none text-center" value={wHour} onChange={e => setWHour(e.target.value)}>
                {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h} className="bg-brand-card">{h}</option>)}
              </select>
              <span className="text-brand-muted font-bold">:</span>
              <select className="bg-transparent text-brand-text font-outfit text-xl font-medium outline-none cursor-pointer appearance-none text-center" value={wMin} onChange={e => setWMin(e.target.value)}>
                {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m} className="bg-brand-card">{m}</option>)}
              </select>
              <button className="ml-auto bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 px-2 py-1 rounded text-xs font-semibold transition-colors" onClick={() => setWAmPm(wAmPm === 'AM' ? 'PM' : 'AM')}>
                {wAmPm}
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Hours & Advice */}
        <div className="bg-brand-bg border border-brand-border rounded-xl p-6 text-center mb-6">
          <div className="font-outfit text-5xl font-light text-brand-purple leading-none mb-1">
            {hours}<span className="text-xl text-brand-muted">h</span>
          </div>
          <div className="text-[10px] text-brand-muted uppercase tracking-widest mb-3">Hours Slept</div>
          <p className="text-xs text-brand-accent/80 italic">{advice}</p>
        </div>

        <div className="h-px bg-brand-border w-full mb-6" />

        {/* Quality Selector */}
        <span className="block text-[10px] font-semibold text-brand-muted tracking-widest uppercase mb-4">
          How did you sleep?
        </span>
        <div className="flex gap-2 mb-8">
          {qualityOptions.map((q, i) => {
            const isActive = quality === i + 1;
            return (
              <button
                key={i}
                type="button"
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border transition-all duration-200 ${isActive ? 'bg-brand-accent/15 border-brand-accent/50 scale-105 shadow-[0_0_15px_rgba(109,213,184,0.2)]' : 'bg-brand-bg border-brand-border text-brand-muted hover:bg-white/5'}`}
                onClick={() => setQuality(i + 1)}
              >
                <span className="text-2xl mb-1">{q.emoji}</span>
                <span className="text-[9px] font-medium tracking-wide">{q.label}</span>
              </button>
            );
          })}
        </div>

        <button
          className="w-full relative group mt-4 bg-gradient-to-r from-brand-accent to-[#5aab94] text-[#0a0f1a] font-bold py-4 rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(109,213,184,0.4)] hover:-translate-y-0.5"
          onClick={handleSave}
          disabled={quality === 0 || saved}
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <span className="relative z-10 flex items-center justify-center tracking-wide">
            {saved ? 'Saving Insights...' : 'Log Sleep'}
          </span>
        </button>
      </div>
    </div>
  );
}
