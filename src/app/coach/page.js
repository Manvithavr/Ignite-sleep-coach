'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCcw, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  "Let's build your personalized sleep plan. First, what time do you usually go to bed?",
  "Got it. What time do you typically wake up?",
  "Do you use your phone, watch TV, or look at screens within 1 hour before sleeping?",
  "Do you consume coffee, tea, or other caffeine after 2 PM?",
  "Almost done! Do you frequently feel tired, groggy, or exhausted during the day?"
];

export default function Coach() {
  const [step, setStep] = useState(0);
  const [sleepProfile, setSleepProfile] = useState({
    bedtime: '',
    waketime: '',
    screenTime: null,
    caffeine: null,
    fatigue: null,
  });
  
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: QUESTIONS[0] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const parseBooleanResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('yes') || lower.includes('yeah') || lower.includes('yep') || lower.includes('sometimes') || lower.includes('a lot')) return true;
    if (lower.includes('no') || lower.includes('nope') || lower.includes('never')) return false;
    return null; // Could not parse
  };

  const generateSleepPlan = (profile) => {
    let plan = "Here is your Personalized Sleep Improvement Plan:\n\n";
    
    // Analyze duration/schedule
    plan += "🌙 **Schedule Adjustments:**\n";
    plan += `You mentioned sleeping from ${profile.bedtime} to ${profile.waketime}. `;
    if (profile.fatigue) {
      plan += "Since you're experiencing daytime fatigue, you likely have accumulated sleep debt or poor sleep quality. Try shifting your bedtime 15-30 minutes earlier over the next week to allow for a full 7-9 hour sleep window.\n\n";
    } else {
      plan += "If this schedule gives you 7-9 hours, the most important thing is to keep it exactly consistent, even on weekends.\n\n";
    }

    // Analyze Screen Time
    plan += "📱 **Environment & Wind Down:**\n";
    if (profile.screenTime) {
      plan += "Blue light from screens is severely suppressing your natural melatonin production. Implement a strict 'Digital Sunset' 1 hour before bed. Read a physical book, stretch, or listen to a podcast instead.\n\n";
    } else {
      plan += "Great job avoiding screens before bed! To optimize further, keep your bedroom cool (around 65°F/18°C) and completely dark.\n\n";
    }

    // Analyze Caffeine
    plan += "☕ **Diet & Habits:**\n";
    if (profile.caffeine) {
      plan += "Caffeine has a quarter-life of 12 hours. Drinking it after 2 PM means it is still in your system at night, destroying your deep sleep architecture. Cut off all caffeine 10 hours before your target bedtime.\n\n";
    } else {
      plan += "You're doing great with your caffeine habits. Also remember to stop eating large meals at least 3 hours before bed so digestion doesn't raise your core body temperature.\n\n";
    }

    plan += "Stick to these adjustments for 7 days and track your progress in the Dashboard. You've got this!";
    return plan;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || planGenerated) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let nextStep = step;
      let newProfile = { ...sleepProfile };
      let reply = "";

      // Process input based on current step
      if (step === 0) {
        newProfile.bedtime = userMsg.text;
        reply = QUESTIONS[1];
        nextStep = 1;
      } else if (step === 1) {
        newProfile.waketime = userMsg.text;
        reply = QUESTIONS[2];
        nextStep = 2;
      } else if (step === 2) {
        const val = parseBooleanResponse(userMsg.text);
        if (val !== null) {
          newProfile.screenTime = val;
          reply = QUESTIONS[3];
          nextStep = 3;
        } else {
          reply = "I didn't quite catch that. Do you use screens before bed? (Yes or No)";
        }
      } else if (step === 3) {
        const val = parseBooleanResponse(userMsg.text);
        if (val !== null) {
          newProfile.caffeine = val;
          reply = QUESTIONS[4];
          nextStep = 4;
        } else {
          reply = "Please answer Yes or No: Do you consume caffeine in the afternoon or evening?";
        }
      } else if (step === 4) {
        const val = parseBooleanResponse(userMsg.text);
        if (val !== null) {
          newProfile.fatigue = val;
          reply = "Perfect. Analyzing your profile and building your custom sleep plan...";
          nextStep = 5;
        } else {
          reply = "Please answer Yes or No: Do you feel tired during the day?";
        }
      }

      setSleepProfile(newProfile);
      setStep(nextStep);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }]);
      setIsTyping(false);

      // Trigger plan generation if step 5 reached
      if (nextStep === 5) {
        setIsTyping(true);
        setTimeout(() => {
          const finalPlan = generateSleepPlan(newProfile);
          setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', text: finalPlan }]);
          setPlanGenerated(true);
          setIsTyping(false);
          // Save plan to local storage
          localStorage.setItem('ignite_sleep_plan', finalPlan);
        }, 2500);
      }

    }, 1000 + Math.random() * 800);
  };

  const restartPlan = () => {
    setStep(0);
    setSleepProfile({ bedtime: '', waketime: '', screenTime: null, caffeine: null, fatigue: null });
    setMessages([{ id: Date.now(), role: 'ai', text: QUESTIONS[0] }]);
    setPlanGenerated(false);
    setInput('');
  };

  // Format AI messages that contain markdown-like bolding and newlines
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (line === '') return <br key={i} />;
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block mb-1">
          {boldParts.map((part, j) => 
            j % 2 === 1 ? <strong key={j} className="font-semibold text-brand-accent">{part}</strong> : part
          )}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-2xl flex flex-col h-[85vh] animate-in fade-in duration-500">
      
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-semibold tracking-tight text-white mb-1">
            Nocta <span className="text-brand-purple">Coach</span>
          </h1>
          <p className="text-xs font-medium text-brand-muted uppercase tracking-widest">
            Guided Sleep Plan Generator
          </p>
        </div>
        
        {/* Progress UI */}
        {!planGenerated && (
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              Step {Math.min(step + 1, 5)} of 5
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < step ? 'w-4 bg-brand-accent' : i === step ? 'w-4 bg-brand-purple animate-pulse' : 'w-1.5 bg-white/10'}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'bg-gradient-to-br from-brand-purple to-indigo-600 text-white border border-white/10'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-[13.5px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-brand-accent to-[#5aab94] text-[#0a0f1a] rounded-tr-sm font-medium shadow-md' 
                  : 'bg-white/5 border border-white/10 text-brand-text rounded-tl-sm shadow-md'
              }`}>
                {msg.role === 'ai' ? formatMessage(msg.text) : msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-in fade-in zoom-in duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-indigo-600 text-white border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles size={16} />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-brand-purple/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-purple/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-purple/80 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Plan Complete Banner */}
        {planGenerated && (
          <div className="bg-brand-accent/10 border-t border-brand-accent/20 p-4 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-brand-accent">
              <CheckCircle2 size={18} />
              <span className="text-sm font-semibold">Sleep Plan Generated & Saved</span>
            </div>
            <button onClick={restartPlan} className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10">
              <RefreshCcw size={12} /> Restart
            </button>
          </div>
        )}

        {/* Input Area */}
        {!planGenerated && (
          <div className="p-4 bg-white/[0.02] border-t border-white/10 backdrop-blur-xl relative z-10">
            <form onSubmit={handleSend} className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-purple/50 focus:bg-white/10 transition-all shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-lg text-brand-purple hover:bg-brand-purple/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors group-focus-within:text-brand-accent"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
