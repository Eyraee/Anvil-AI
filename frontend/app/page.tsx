"use client";

import { useState, useEffect } from "react";
import { 
  Copy, Sparkles, UserCheck, CheckCircle2, Edit3, Loader2, Sun, Moon, 
  Cpu, Activity, Database, Lock, Unlock, Download, X, Info, ChevronDown, 
  Terminal, Eye, Code2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown"; 

// --- Block 3: Sleek Logo Typography Applied ---
const ScrambleLogo = ({ gradient }: { gradient: string }) => {
  const originalText = "Anvil AI";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
  const [text, setText] = useState(originalText);

  const triggerScramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(originalText.split("").map((l, i) => i < iteration ? originalText[i] : letters[Math.floor(Math.random()*letters.length)]).join(""));
      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
  };
  useEffect(() => triggerScramble(), []);

  return (
    <h1 
      onMouseEnter={triggerScramble} 
      className={`text-5xl font-extrabold tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-crosshair inline-block transition-transform active:scale-95 z-20 relative`}>
    
      {text}
    </h1>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"enhance" | "humanize" | "dashboard">("enhance");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [originalAiOutput, setOriginalAiOutput] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  
  const [theme, setTheme] = useState<"dark" | "light" | "alien">("dark");
  const [mounted, setMounted] = useState(false);
  
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const SECRET_PIN = "Shah@1996"; 

  const [toasts, setToasts] = useState<{id: number, msg: string, type: 'success' | 'error'}[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Normal");
  const [isPreview, setIsPreview] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, {id, msg, type}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const checkServerStatus = async () => {
    try {
      const res = await fetch("https://anvil-ai-backend.onrender.com/api/health");
      setIsOnline(res.ok);
    } catch { setIsOnline(false); }
  };

  const handleExportCSV = () => {
    window.open("https://anvil-ai-backend.onrender.com/api/export", "_blank");
    addToast("Generating CSV Export...");
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsAdminUnlocked(true);
      setPinError(false);
      setPinInput("");
      addToast("Vault Decrypted. Welcome Tushar.");
    } else {
      setPinError(true);
      setPinInput("");
      addToast("Access Denied", "error");
      setTimeout(() => setPinError(false), 1000);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true); setOutputText(""); setIsPreview(false);
    try {
      const endpoint = activeTab === "enhance" ? "enhance" : "humanize";
      const response = await fetch(`https://anvil-ai-backend.onrender.com/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone, length }),
      });
      const data = await response.json();
      if (response.ok) {
        setOutputText(data.result);
        setOriginalAiOutput(data.result);
        addToast("Forge successful!");
      } else { addToast("Rate limit or API error", "error"); }
    } catch { addToast("Backend Offline", "error"); }
    finally { setIsLoading(false); }
  };

  const handleCopyAndLearn = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    addToast("Logged to Dataset");
    fetch(`https://anvil-ai-backend.onrender.com/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_input: inputText, generated_output: originalAiOutput, user_edited_output: outputText, rating: 1, task_type: activeTab }),
    });
  };

  const templates = [
    { label: "Bug Fix", text: "Analyze and fix the logical error in this (language) code: " },
    { label: "Email", text: "Write a professional email regarding: " },
    { label: "MC Mod", text: "Create a detailed technical spec for a Minecraft Fabric mod about: " }
  ];

  const t = {
    dark: {
      bg: "bg-[#050505]", text: "text-gray-100", subText: "text-gray-400",
      headerGradient: "from-gray-100 via-gray-300 to-gray-500",
      panelBg: "bg-[#141414]/80", panelBorder: "border-white/10", cardBg: "bg-[#1a1a1a]/50",
      btnBg: "bg-white text-black hover:bg-gray-200", orb1: "bg-purple-900/50", orb2: "bg-blue-900/40", orb3: "bg-emerald-900/20",
      sparks: ["bg-purple-500", "bg-blue-500", "bg-emerald-500"], iconAccent: "text-purple-400", statusDot: "bg-emerald-500"
    },
    light: {
      bg: "bg-gray-50", text: "text-gray-900", subText: "text-gray-500",
      headerGradient: "from-gray-900 via-gray-700 to-gray-500",
      panelBg: "bg-white/70 shadow-xl", panelBorder: "border-gray-200", cardBg: "bg-gray-100/50",
      btnBg: "bg-black text-white hover:bg-gray-800", orb1: "bg-blue-400/20", orb2: "bg-purple-400/10", orb3: "bg-orange-400/10",
      sparks: ["bg-blue-400", "bg-purple-400", "bg-orange-400"], iconAccent: "text-blue-500", statusDot: "bg-emerald-600"
    },
    alien: {
      bg: "bg-[#020a04]", text: "text-green-50", subText: "text-green-600/80",
      headerGradient: "from-green-300 via-emerald-400 to-green-600",
      panelBg: "bg-[#05140a]/80 shadow-[0_0_20px_rgba(34,197,94,0.05)]", panelBorder: "border-green-500/30", cardBg: "bg-[#0a1f10]/50",
      btnBg: "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]", orb1: "bg-green-600/30", orb2: "bg-emerald-700/20", orb3: "bg-lime-600/10",
      sparks: ["bg-green-400", "bg-emerald-500", "bg-lime-400"], iconAccent: "text-green-400", statusDot: "bg-green-400"
    }
  }[theme];

  return (
    // --- Block 1: Apple-Style Font & Antialiasing Applied ---
    <div className={`min-h-screen ${t.bg} ${t.text} font-sans antialiased tracking-tight selection:bg-emerald-500/20 flex flex-col relative overflow-hidden transition-colors duration-700`}>
      
      {/* --- SEO & METADATA (Hidden) --- */}
      <title>Anvil AI | The Promt and Humanative Beast</title>
      <meta name="description" content="Professional AI Prompt Forge & Humanizer engineered by Tushar Shah." />

      {/* Toast System */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ y: -50, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0, scale: 0.9 }} className={`px-6 py-3 rounded-full border shadow-2xl flex items-center gap-3 backdrop-blur-xl pointer-events-auto ${t.panelBg} ${toast.type === 'error' ? 'border-red-500/50 text-red-400' : t.panelBorder}`}>
              {toast.type === 'error' ? <X size={16} /> : <CheckCircle2 size={16} className={t.iconAccent} />}
              <span className="text-sm font-bold tracking-tight uppercase">{toast.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Buttons */}
      <div className="absolute top-6 right-6 z-50 flex gap-3">
        <button onClick={() => setShowAbout(true)} className={`p-3 rounded-full backdrop-blur-md border transition-all ${t.panelBg} ${t.panelBorder} hover:scale-110`} title="About Anvil">
          <Info size={20} className={t.subText} />
        </button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'alien' : 'dark')} className={`p-3 rounded-full backdrop-blur-md border transition-all ${t.panelBg} ${t.panelBorder} hover:scale-110 flex items-center justify-center`}>
          {theme === "dark" && <Sun size={20} className="text-gray-300" />}
          {theme === "light" && <Cpu size={20} className="text-gray-700" />}
          {theme === "alien" && <Moon size={20} className="text-green-400 animate-pulse" />}
        </button>
      </div>

      {/* --- Block 2: Lag-Free Background Applied --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ willChange: "transform" }}
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -20, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
          className={`absolute -top-[10%] -left-[5%] w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-50 transition-colors duration-1000 ${t.orb1}`} 
        />
        <motion.div 
          style={{ willChange: "transform" }}
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 20, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }} 
          className={`absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-40 transition-colors duration-1000 ${t.orb2}`} 
        />
        <motion.div 
          style={{ willChange: "transform" }}
          animate={{ opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
          className={`absolute top-[20%] left-[25%] w-[50vw] h-[30vw] rounded-full blur-[80px] transition-colors duration-1000 ${t.orb3}`} 
        />

        {/* Reduced sparks for performance (12 instead of 25) */}
        {mounted && Array.from({ length: 12 }).map((_, i) => (
          <motion.div 
            key={`${i}-${theme}`} 
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }} 
            animate={{ y: "-10vh", opacity: [0, 0.5, 0] }} 
            transition={{ duration: Math.random() * 10 + 15, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }} 
            style={{ width: 2, height: 2 }} 
            className={`absolute rounded-full transition-colors duration-1000 ${t.sparks[i % t.sparks.length]}`} 
          />
        ))}
      </div>

      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="pt-16 pb-6 px-6 max-w-4xl mx-auto w-full text-center relative z-10">
        <ScrambleLogo gradient={t.headerGradient} />
        <p className={`mt-3 text-sm font-medium tracking-wide transition-colors duration-500 ${t.subText}`}>Advanced AI Training Engine & Studio</p>
      </motion.header>

      <main className="max-w-4xl mx-auto px-6 pb-20 w-full flex-grow relative z-10">
        
        {/* Animated Tabs */}
        <div className={`relative flex space-x-2 p-1.5 rounded-2xl mb-8 backdrop-blur-xl border transition-all duration-500 ${t.panelBg} ${t.panelBorder}`}>
          {["enhance", "humanize", "dashboard"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative flex-1 py-3.5 px-2 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 z-10 ${activeTab === tab ? t.text : t.subText} hover:opacity-80`}>
              {activeTab === tab && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-xl border shadow-sm bg-white/10 border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10 flex items-center gap-2">
                {tab === "enhance" && <Sparkles size={16} className={activeTab === tab ? t.iconAccent : ""} />}
                {tab === "humanize" && <UserCheck size={16} className={activeTab === tab ? t.iconAccent : ""} />}
                {tab === "dashboard" && <Lock size={16} className={activeTab === tab ? t.iconAccent : ""} />}
                <span className="uppercase tracking-widest">{tab === 'dashboard' ? 'Analytics' : tab}</span>
              </span>
            </button>
          ))}
        </div>

        {activeTab !== "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            {/* Control Panel */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${t.panelBg} ${t.panelBorder}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Tone</span>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
                  {["Professional", "Casual", "Academic", "Creative", "Alien"].map(o => <option key={o} value={o} className="bg-[#141414]">{o}</option>)}
                </select>
              </div>
              {activeTab === 'humanize' && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${t.panelBg} ${t.panelBorder}`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Length</span>
                  <select value={length} onChange={(e) => setLength(e.target.value)} className="bg-transparent text-xs font-bold outline-none cursor-pointer">
                    {["Short", "Normal", "Detailed"].map(o => <option key={o} value={o} className="bg-[#141414]">{o}</option>)}
                  </select>
                </div>
              )}
              {templates.map(tmp => (
                <button key={tmp.label} onClick={() => { setInputText(tmp.text); addToast(`${tmp.label} Ready`); }} className={`px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${t.panelBg} ${t.panelBorder} hover:bg-white/5`}>
                  {tmp.label}
                </button>
              ))}
            </div>

            <div className={`backdrop-blur-md border rounded-3xl p-5 transition-all relative group ${t.panelBg} ${t.panelBorder}`}>
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Strike the anvil: Type here..." className={`w-full h-36 bg-transparent ${t.text} resize-none outline-none focus:ring-0 text-lg leading-relaxed scrollbar-thin relative z-10`} />
              <div className="flex justify-between items-center mt-4 relative z-10">
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{inputText.length} chars</span>
                <button onClick={handleGenerate} disabled={isLoading || !inputText.trim()} className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold transition-all active:scale-95 ${t.btnBg} disabled:opacity-50`}>
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Terminal size={18} />} FORGE
                </button>
              </div>
            </div>

            {/* Result Box */}
            <AnimatePresence>
              {(outputText || isLoading) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`mt-6 backdrop-blur-xl border rounded-3xl p-5 relative overflow-hidden ${t.panelBg} ${t.panelBorder}`}>
                  <div className={`flex justify-between items-center mb-4 border-b pb-4 ${t.panelBorder}`}>
                    <div className="flex gap-2">
                       <button onClick={() => setIsPreview(false)} className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${!isPreview ? t.btnBg : t.subText}`}><Code2 size={14} className="inline mr-1"/> Raw</button>
                       <button onClick={() => setIsPreview(true)} className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${isPreview ? t.btnBg : t.subText}`}><Eye size={14} className="inline mr-1"/> Preview</button>
                    </div>
                    <button onClick={handleCopyAndLearn} className={`flex items-center gap-2 text-[10px] px-4 py-2 rounded-full font-bold transition-all ${t.btnBg}`}>COPY & LOG</button>
                  </div>
                  {isLoading ? (
                    <div className="h-48 flex items-center justify-center"><Loader2 size={32} className={`animate-spin ${t.subText}`} /></div>
                  ) : isPreview ? (
                    <div className="w-full h-64 overflow-y-auto text-md leading-relaxed prose prose-invert max-w-none">
                       <ReactMarkdown>{outputText}</ReactMarkdown>
                    </div>
                  ) : (
                    <textarea value={outputText} readOnly className={`w-full h-64 bg-transparent resize-none outline-none text-md leading-relaxed ${t.text}`} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className={`backdrop-blur-xl border rounded-3xl p-6 transition-all duration-500 ${t.panelBg} ${t.panelBorder}`}>
            {!isAdminUnlocked ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                 <Lock size={32} className={`mb-6 ${t.iconAccent}`} />
                 <h2 className="text-2xl font-bold mb-8 uppercase italic">Admin Vault</h2>
                 <form onSubmit={handlePinSubmit} className="flex gap-3">
                    <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="PIN..." className={`px-4 py-2 rounded-xl border bg-transparent text-center font-mono ${pinError ? 'border-red-500' : t.panelBorder}`} />
                    <button type="submit" className={`px-6 py-2 rounded-xl font-bold ${t.btnBg}`}>Unlock</button>
                 </form>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8 border-b pb-4 border-white/5">
                   <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest"><Unlock size={20} className={t.iconAccent} /> Unlocked</h3>
                   <div className="flex gap-3">
                      <button onClick={handleExportCSV} className={`px-4 py-2 rounded-full border flex items-center gap-2 text-[10px] font-bold ${t.btnBg}`}><Download size={14} /> EXPORT CSV</button>
                      <button onClick={() => setIsAdminUnlocked(false)} className={`text-[10px] font-bold uppercase opacity-50`}>Lock</button>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center uppercase tracking-widest text-[10px]">
                  <div className={`p-4 rounded-2xl border ${t.panelBorder} ${t.cardBg}`}><p>Total</p><p className="text-3xl font-bold mt-1">{dashboardData.length}</p></div>
                  <div className={`p-4 rounded-2xl border ${t.panelBorder} ${t.cardBg}`}><p>Forge</p><p className={`text-3xl font-bold mt-1 ${t.iconAccent}`}>{dashboardData.filter(d => d.task_type === 'enhance').length}</p></div>
                  <div className={`p-4 rounded-2xl border ${t.panelBorder} ${t.cardBg}`}><p>Human</p><p className="text-3xl font-bold mt-1 text-blue-500">{dashboardData.filter(d => d.task_type === 'humanize').length}</p></div>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                   {dashboardData.map((log, i) => (
                     <div key={i} className={`p-4 rounded-2xl border ${t.cardBg} ${t.panelBorder} text-xs`}>
                       <p className={`mb-2 font-bold uppercase ${log.task_type === 'enhance' ? t.iconAccent : 'text-blue-500'}`}>{log.task_type} — {new Date(log.timestamp).toLocaleDateString()}</p>
                       <p className="opacity-60 mb-1">Input: {log.original_input}</p>
                       <p className="font-bold underline">Final: {log.user_edited_output}</p>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/40">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={`max-w-lg w-full p-8 rounded-[40px] border shadow-2xl relative ${t.panelBg} ${t.panelBorder}`}>
               <button onClick={() => setShowAbout(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"><X size={20}/></button>
               <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Anvil Engineering</h2>
               <div className="space-y-4 text-sm leading-relaxed opacity-80">
                  <p>Anvil AI is a self-training LLM forge. It utilizes **Gemini 2.0 Flash** via a custom Python FastAPI backend.</p>
                  <p>Every time you click **Copy & Log**, your human edits are saved to an RLHF (Reinforcement Learning from Human Feedback) dataset, preparing the model for future fine-tuning.</p>
                  <p className="pt-4 font-bold border-t border-white/5">Designed & Developed by Tushar Shah, 2026.</p>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <footer className={`py-12 text-center border-t relative z-10 transition-colors duration-500 ${t.panelBorder}`}>
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <motion.div animate={isOnline ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }} transition={{ repeat: Infinity, duration: 2 }} className={`w-2.5 h-2.5 rounded-full ${isOnline ? t.statusDot : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{isOnline ? 'System Online' : 'System Offline'}</span>
          </div>
        </div>
        <p className="text-[11px] font-bold text-gray-500 tracking-[0.3em] uppercase">© 2026 Tushar Shah. All rights reserved.</p>
      </footer>
    </div>
  );
}