'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Moon, Flame, Target, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLogs = JSON.parse(localStorage.getItem('sleepLogs') || '[]');
      
      // Robust sanitization
      const sanitized = savedLogs.map(log => ({
        ...log,
        hours: Number(log.hours) || 0,
        emoji: log.emoji || '😐',
        date: log.date || 'Unknown Date',
        id: log.id || Date.now() + Math.random()
      })).filter(log => log.hours > 0); // Only keep valid logs
      
      setLogs(sanitized);
    } catch (e) {
      setLogs([]);
    }
  }, []);

  if (!mounted) return null;

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-20">
        <div className="w-24 h-24 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
          <Moon className="w-10 h-10 text-brand-purple" />
        </div>
        <h2 className="text-3xl font-outfit font-semibold mb-3">No sleep data yet</h2>
        <p className="text-brand-muted text-sm max-w-sm mb-6">Start tracking your sleep to unlock deep insights, streaks, and AI coaching.</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/tracker" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all">
            + Add Log
          </Link>
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-left max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={18} className="text-brand-purple" />
              <div className="font-semibold">Nocta — Your AI Sleep Coach</div>
            </div>
            <p className="text-xs text-brand-muted">Ask personalized sleep questions, get tips, and nightly coaching tailored to your logs.</p>
            <div className="mt-3">
              <Link href="/coach" className="bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple px-4 py-2 rounded-xl text-sm font-medium transition-all">
                Open Nocta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe Calculations
  const totalHours = logs.reduce((acc, log) => acc + log.hours, 0);
  const avgHours = logs.length > 0 ? (totalHours / logs.length).toFixed(1) : '0.0';
  
  // Calculate Streak (consecutive days with hours >= 7)
  let streak = 0;
  for (let log of logs) {
    if (log.hours >= 7) streak++;
    else break;
  }

  // Generate chart data (last 7 logs)
  const chartData = [...logs].slice(0, 7).reverse().map((log, index) => {
    // Safely parse name for X-axis
    let dayName = `Day ${index + 1}`;
    if (log.date && log.date.includes(',')) {
      dayName = log.date.split(',')[0].slice(0, 3);
    } else if (log.date && log.date !== 'Unknown Date') {
      dayName = log.date.slice(0, 3);
    }

    return {
      name: dayName,
      hours: log.hours,
      emoji: log.emoji,
      fullDate: log.date
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121622] border border-brand-border p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div>
            <p className="text-xs text-brand-muted font-medium mb-1">{data.fullDate}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-outfit text-white">{data.hours}<span className="text-lg text-brand-muted">h</span></span>
            </div>
          </div>
          <div className="text-4xl">{data.emoji}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-4 text-brand-accent text-xs font-medium uppercase tracking-widest">
            <TrendingUp size={14} /> Performance
          </div>
          <h1 className="font-outfit text-5xl font-semibold tracking-tight text-white mb-2">
            Your Insights
          </h1>
          <p className="text-sm font-light text-brand-muted uppercase tracking-widest">
            Based on your last {logs.length} logged nights
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/coach" className="bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple/20 text-brand-purple px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
            <Sparkles size={16} /> Nocta
          </Link>
          <Link href="/tracker" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center">
            + Add Log
          </Link>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <Moon className="w-5 h-5 text-brand-accent mb-4" />
          <div className="font-outfit text-4xl text-white font-light mb-1">{avgHours}<span className="text-xl text-brand-muted ml-1">h</span></div>
          <div className="text-[11px] text-brand-muted font-medium uppercase tracking-widest">Avg Sleep</div>
        </div>
        
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-orange-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <Flame className={`w-5 h-5 mb-4 ${streak > 0 ? 'text-orange-400' : 'text-brand-muted'}`} />
          <div className="font-outfit text-4xl text-white font-light mb-1">{streak}</div>
          <div className="text-[11px] text-brand-muted font-medium uppercase tracking-widest">7h+ Day Streak</div>
        </div>
        
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <Target className="w-5 h-5 text-blue-400 mb-4" />
          <div className="font-outfit text-4xl text-white font-light mb-1">{logs.length}</div>
          <div className="text-[11px] text-brand-muted font-medium uppercase tracking-widest">Total Logs</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="md:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-xl relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-widest">Sleep Duration Trend</h3>
            <span className="text-xs text-brand-muted bg-white/5 px-3 py-1 rounded-full">Last 7 Days</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
                <Bar dataKey="hours" radius={[8, 8, 8, 8]} maxBarSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.hours >= 7 ? '#6dd5b8' : '#b8a8e8'} 
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6dd5b8]"></span><span className="text-xs text-brand-muted">Optimal (7h+)</span></div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#b8a8e8]"></span><span className="text-xs text-brand-muted">Suboptimal (&lt;7h)</span></div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col h-[430px] shadow-xl">
          <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-widest mb-6">Recent Logbook</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {logs.slice(0, 10).map((log, i) => (
              <div key={log.id || i} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all rounded-2xl p-4 flex items-center justify-between group cursor-default">
                <div>
                  <div className="text-xs font-semibold text-white mb-1 group-hover:text-brand-purple transition-colors">{log.date}</div>
                  <div className="text-[10px] text-brand-muted font-mono">{log.bedtime} - {log.waketime}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm font-outfit font-medium text-brand-accent">{Number(log.hours).toFixed(1)}h</div>
                  <div className="text-lg leading-none">{log.emoji}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
