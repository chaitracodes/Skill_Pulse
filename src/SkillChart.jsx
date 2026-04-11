import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { 
  LineChart, AreaChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ReferenceLine, BarChart, Bar 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Minus, Search, Bell, Sun, Moon, Upload, Plus, X, 
  ChevronRight, Activity, Zap, Target, BarChart2, BookOpen, Award, ArrowUpRight, 
  User, Settings, Home, Layers, RefreshCw, Terminal, Newspaper, Map, Lock, Circle, CheckCircle, Clock
} from 'lucide-react';

const TOKENS = {
  bg: '#0b1326',
  surfaceLow: '#131b2e',
  surface: '#171f33',
  surfaceHigh: '#222a3d',
  primary: '#a9c9f2',
  primaryContainer: '#1a3c5e',
  rising: '#4ae176',     
  stable: '#ffb95f',     
  declining: '#ffb4ab',  
  textMain: '#dae2fd',
  textMuted: '#c3c6cf',
  ghostBorder: 'rgba(67, 71, 78, 0.15)',
};

const STYLES = {
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: TOKENS.bg,
    color: TOKENS.textMain,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  mono: { fontFamily: "'JetBrains Mono', monospace" },
  display: { fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' },
  card: {
    backgroundColor: TOKENS.surface,
    borderRadius: '6px',
    padding: '24px',
    border: `1px solid ${TOKENS.ghostBorder}`
  },
  buttonPrimary: {
    background: `linear-gradient(to right, ${TOKENS.primary}, ${TOKENS.primaryContainer})`,
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  buttonGhost: {
    background: 'transparent',
    color: TOKENS.primary,
    border: `1px solid ${TOKENS.primary}`,
    padding: '12px 28px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

const generateHistory = (startScore, endScore, days, direction) => {
  const data = [];
  let current = startScore;
  const step = (endScore - startScore) / days;
  for (let i = 0; i < days; i++) {
    const noise = (Math.random() - 0.5) * 6;
    current += step + noise;
    data.push({ 
      day: i, 
      score: Math.max(0, parseFloat(current.toFixed(1))),
      volume: Math.floor(Math.random() * 500) + 100
    });
  }
  data.push({ day: days, score: endScore, volume: 450 });
  return data;
};

const SKILLS_DB = [
  { id: 'langchain', name: 'LangChain', abbr: 'LC', score: 78, demand: 85, momentum: 92, scarcity: 75, longevity: 70, salaryImpact: 18000, trend: 'rising', jobs: 4200, domain: 'AI/ML' },
  { id: 'rust', name: 'Rust', abbr: 'RS', score: 75, demand: 40, momentum: 80, scarcity: 95, longevity: 85, salaryImpact: 22000, trend: 'rising', jobs: 2100, domain: 'Systems Programming' },
  { id: 'rag', name: 'RAG', abbr: 'RAG', score: 72, demand: 78, momentum: 85, scarcity: 70, longevity: 65, salaryImpact: 15000, trend: 'rising', jobs: 3500, domain: 'AI/ML' },
  { id: 'python', name: 'Python', abbr: 'PY', score: 70, demand: 95, momentum: 0, scarcity: 20, longevity: 95, salaryImpact: 12000, trend: 'stable', jobs: 15000, domain: 'Data Engineering' },
  { id: 'react', name: 'React', abbr: 'RE', score: 71, demand: 88, momentum: 5, scarcity: 15, longevity: 80, salaryImpact: 14000, trend: 'stable', jobs: 18000, domain: 'Web Development' },
  { id: 'typescript', name: 'TypeScript', abbr: 'TS', score: 73, demand: 82, momentum: 20, scarcity: 30, longevity: 85, salaryImpact: 15000, trend: 'rising', jobs: 12000, domain: 'Web Development' },
  { id: 'flash', name: 'Flash', abbr: 'FL', score: 12, demand: 2, momentum: -80, scarcity: 5, longevity: 5, salaryImpact: -8000, trend: 'declining', jobs: 150, domain: 'Web Development' }
].map(s => ({
  ...s,
  history: generateHistory(s.score - (s.trend === 'rising' ? 15 : s.trend === 'declining' ? -20 : 2), s.score, 30, s.trend)
}));

const initialState = {
  page: 'landing', // landing, dashboard, profile, roadmap, staking, news
  darkMode: true,
  userProfile: { stream: '', domain: '', skills: [], resumeText: '' },
  activeSkill: 'langchain',
  watchlist: SKILLS_DB.filter(s => s.id !== 'flash'),
  aiOutput: { loading: false, text: '', recommendations: [] },
  onboardingPath: null,
  uploadStatus: 'idle' // idle, parsing, complete
};

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': return { ...state, page: action.payload };
    case 'SET_ACTIVE_SKILL': return { ...state, activeSkill: action.payload };
    case 'SET_PROFILE': return { ...state, userProfile: { ...state.userProfile, ...action.payload } };
    case 'SET_AI_LOADING': return { ...state, aiOutput: { ...state.aiOutput, loading: action.payload } };
    case 'SET_AI_OUTPUT': return { ...state, aiOutput: { ...state.aiOutput, text: action.payload.text, recommendations: action.payload.rec } };
    case 'SET_UPLOAD_STATUS': return { ...state, uploadStatus: action.payload };
    case 'HYDRATE': return { ...state, ...action.payload };
    default: return state;
  }
}

const callClaude = async (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "Your current profile shows a strong foundation but lacks modern architectural patterns required for senior roles. Focusing on Vector Databases and Advanced RAG architectures will yield the highest salary premium. Your historical volatility in 'React' suggests a pivot toward full-stack systems design.",
        recommendations: [
          { skill: 'Vector DBs', confidence: 92, rationale: 'Crucial for modern AI infrastructure. Current market demand outpaces supply by 4:1.', weeks: 4, yield: '+14% APY' },
          { skill: 'Kubernetes', confidence: 85, rationale: 'High demand in DevOps. Essential for orchestrating scalable micro-services.', weeks: 8, yield: '+11% APY' },
          { skill: 'GraphQL', confidence: 78, rationale: 'Standardizing API layers. Stabilizing market force with long-term enterprise lock-in.', weeks: 3, yield: '+6% APY' }
        ]
      });
    }, 2000);
  });
};

export default function SkillChart() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [initPercent, setInitPercent] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('skillpulse_state');
    if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
    
    // Inject fonts & styles
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap');
      
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: ${TOKENS.bg}; color: ${TOKENS.textMain}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
      .marquee { white-space: nowrap; overflow: hidden; display: block; position: relative; width: 100%; border-top: 1px solid ${TOKENS.ghostBorder}; border-bottom: 1px solid ${TOKENS.ghostBorder}; background: ${TOKENS.surfaceLow}; padding: 12px 0; }
      .marquee span { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${TOKENS.primary}; }
      @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      
      /* Webkit Scrollbar */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${TOKENS.bg}; }
      ::-webkit-scrollbar-thumb { background: ${TOKENS.surfaceHigh}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: ${TOKENS.primaryContainer}; }
    `;
    document.head.appendChild(style);

    const int = setInterval(() => {
      setInitPercent(p => {
        if (p >= 100) { clearInterval(int); return 100; }
        return p + Math.floor(Math.random() * 5) + 1;
      });
    }, 20);
    return () => { clearInterval(int); document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    localStorage.setItem('skillpulse_state', JSON.stringify(state));
  }, [state]);

  const activeSkillObj = SKILLS_DB.find(s => s.id === state.activeSkill) || SKILLS_DB[0];

  const doAiAnalysis = async () => {
    dispatch({ type: 'SET_AI_LOADING', payload: true });
    const res = await callClaude("Analyze profile gap");
    dispatch({ type: 'SET_AI_OUTPUT', payload: { text: res.text, rec: res.recommendations } });
    dispatch({ type: 'SET_AI_LOADING', payload: false });
  };

  const handleResumeUpload = () => {
    if (state.uploadStatus === 'parsing') return;
    dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'parsing' });
    
    setTimeout(() => {
      dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'complete' });
      dispatch({ type: 'SET_PROFILE', payload: { skills: ['python', 'react', 'typescript'] } });
      setTimeout(() => {
        dispatch({ type: 'NAVIGATE', payload: 'dashboard' });
        dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'idle' });
      }, 800);
    }, 2500);
  };

  if (initPercent < 100 && state.page === 'landing') {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: TOKENS.bg }}>
        <div style={{ ...STYLES.mono, fontSize: '72px', color: TOKENS.primary }}>{Math.min(initPercent, 100)}%</div>
        <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginTop: '16px' }}>INITIALIZING KINETIC LEDGER <span style={{ animation: 'blink 1s infinite' }}>|</span></div>
      </div>
    );
  }

  const chartTheme = activeSkillObj.trend === 'rising' ? TOKENS.rising : activeSkillObj.trend === 'declining' ? TOKENS.declining : TOKENS.stable;

  return (
    <div style={STYLES.container}>
      {/* GLOBAL TOP NAV */}
      <div style={{ height: '56px', background: 'rgba(11, 19, 38, 0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${TOKENS.ghostBorder}`, display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ ...STYLES.mono, fontSize: '14px', letterSpacing: '0.12em', color: TOKENS.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} /> SKILLPULSE
        </div>
        <div style={{ marginLeft: '48px', ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, display: 'flex', gap: '24px' }}>
          {['dashboard', 'news', 'roadmap', 'staking', 'profile'].map((nav, i) => (
            <span 
              key={nav}
              style={{ cursor: 'pointer', color: state.page === nav ? TOKENS.textMain : '', textTransform: 'uppercase' }} 
              onClick={() => dispatch({ type: 'NAVIGATE', payload: nav })}
            >
              0{i+1} {nav === 'dashboard' ? 'Terminal' : nav === 'profile' ? 'Portfolio' : nav}
            </span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Search size={16} color={TOKENS.textMuted} />
          <Bell size={16} color={TOKENS.textMuted} />
        </div>
      </div>

      {state.page === 'landing' && (
        <div style={{ flex: 1, paddingBottom: '120px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 32px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 0.6 }}>
              <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, letterSpacing: '0.2em', marginBottom: '24px' }}>THE KINETIC LEDGER</div>
              <h1 style={{ ...STYLES.display, fontSize: '80px', lineHeight: '1', marginBottom: '24px' }}>
                Track Your Skills <br/>
                <span style={{ color: TOKENS.primary }}>Like A Market</span>
              </h1>
              <p style={{ color: TOKENS.textMuted, fontSize: '18px', lineHeight: '1.6', maxWidth: '440px', marginBottom: '40px' }}>
                Real-time technical demand intelligence. Invest in your career stack before the market peaks.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={STYLES.buttonPrimary} onClick={() => dispatch({ type: 'NAVIGATE', payload: 'dashboard' })}>ENTER TERMINAL</button>
              </div>
            </div>
            <div style={{ flex: 0.4 }}>
              <div style={{ ...STYLES.card, background: 'rgba(19, 27, 46, 0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', ...STYLES.mono }}>
                  <span>LANGCHAIN ✦</span>
                  <span style={{ color: TOKENS.rising }}>78.00 ↑</span>
                </div>
                <div style={{ height: '240px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={SKILLS_DB[0].history}>
                      <defs>
                        <linearGradient id="colorRising" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TOKENS.rising} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={TOKENS.rising} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="score" stroke={TOKENS.rising} fillOpacity={1} fill="url(#colorRising)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="marquee">
            <span>{SKILLS_DB.map(s => `${s.abbr} ${s.score.toFixed(1)} `).join(' ✦ ')} ✦ {SKILLS_DB.map(s => `${s.abbr} ${s.score.toFixed(1)} `).join(' ✦ ')}</span>
          </div>

          <div style={{ maxWidth: '960px', margin: '120px auto', ...STYLES.card, background: TOKENS.surfaceLow }}>
            <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '24px' }}>01 MARKET ENTRY</div>
            <h2 style={{ ...STYLES.display, fontSize: '40px', marginBottom: '48px' }}>Identity Parsing</h2>
            
            <div style={{ display: 'flex', gap: '48px' }}>
              <div style={{ flex: 1, paddingRight: '48px', borderRight: `1px solid ${TOKENS.ghostBorder}` }}>
                <Upload size={24} color={TOKENS.primary} style={{ marginBottom: '16px' }} />
                <h3 style={{ ...STYLES.mono, marginBottom: '12px' }}>UPLOAD RESUME</h3>
                <p style={{ color: TOKENS.textMuted, fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>Drop your CV here. Our AI engine extracts technical vectors instantly.</p>
                <div 
                  onClick={handleResumeUpload}
                  style={{ 
                    border: `1px dashed ${TOKENS.ghostBorder}`, borderRadius: '6px', height: '120px', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                    cursor: state.uploadStatus === 'idle' ? 'pointer' : 'default',
                    background: state.uploadStatus === 'parsing' ? 'rgba(169, 201, 242, 0.05)' : 'transparent',
                    ...STYLES.mono, fontSize: '12px', color: state.uploadStatus === 'parsing' ? TOKENS.primary : TOKENS.textMuted 
                  }}>
                  
                  {state.uploadStatus === 'idle' && "Drag & Drop PDF or Click"}
                  {state.uploadStatus === 'parsing' && <><RefreshCw size={18} style={{ marginBottom: '8px', animation: 'spin 1.5s linear infinite' }}/> EXTRACTING VECTORS...</>}
                  {state.uploadStatus === 'complete' && <><CheckCircle size={18} color={TOKENS.rising} style={{ marginBottom: '8px' }}/> PARSE COMPLETE</>}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Layers size={24} color={TOKENS.rising} style={{ marginBottom: '16px' }} />
                <h3 style={{ ...STYLES.mono, marginBottom: '12px' }}>MANUAL CONFIG</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input placeholder="Job Title / Domain" style={{ background: TOKENS.surface, border: 'none', borderBottom: `1px solid ${TOKENS.ghostBorder}`, color: '#fff', padding: '12px', ...STYLES.mono }} />
                  <input placeholder="Years Experience" style={{ background: TOKENS.surface, border: 'none', borderBottom: `1px solid ${TOKENS.ghostBorder}`, color: '#fff', padding: '12px', ...STYLES.mono }} />
                  <button style={{ ...STYLES.buttonGhost, marginTop: '8px' }} onClick={() => dispatch({ type: 'NAVIGATE', payload: 'dashboard' })}>Initialize</button>
                </div>
              </div>
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}

      {state.page === 'dashboard' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* SIDEBAR NARROW */}
          <div style={{ width: '56px', background: TOKENS.surfaceLow, borderRight: `1px solid ${TOKENS.ghostBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: '32px' }}>
            <BarChart2 size={20} color={TOKENS.primary} />
            <Target size={20} color={TOKENS.textMuted} />
            <BookOpen size={20} color={TOKENS.textMuted} />
            <div style={{ flex: 1 }} />
            <Settings size={20} color={TOKENS.textMuted} />
          </div>

          {/* MAIN CHART PANEL */}
          <div style={{ flex: 0.7, padding: '32px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ ...STYLES.display, fontSize: '32px', marginBottom: '8px' }}>{activeSkillObj.name}</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                  <span style={{ ...STYLES.mono, fontSize: '28px', color: chartTheme }}>{activeSkillObj.score.toFixed(2)}</span>
                  <span style={{ ...STYLES.mono, fontSize: '13px', color: chartTheme }}>{activeSkillObj.trend === 'rising' ? '▲' : '▼'} {Math.abs(activeSkillObj.momentum)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted }}>
                <div>DEMAND <span style={{ color: '#fff' }}>{activeSkillObj.demand}</span></div>
                <div>SCARCITY <span style={{ color: '#fff' }}>{activeSkillObj.scarcity}</span></div>
                <div>VOLUME <span style={{ color: '#fff' }}>{activeSkillObj.jobs.toLocaleString()}</span></div>
              </div>
            </div>

            <div style={{ height: '380px', marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeSkillObj.history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartTheme} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={chartTheme} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={TOKENS.ghostBorder} vertical={false} />
                  <XAxis dataKey="day" hide />
                  <YAxis domain={['auto', 'auto']} stroke={TOKENS.textMuted} fontSize={10} fontFamily="'JetBrains Mono', monospace" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: TOKENS.surface, border: `1px solid ${TOKENS.ghostBorder}`, borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }} />
                  <Area type="monotone" dataKey="score" stroke={chartTheme} fillOpacity={1} fill="url(#chartGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ height: '80px', marginBottom: '48px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeSkillObj.history}>
                  <Bar dataKey="volume" fill={chartTheme} opacity={0.4} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* DETAILED SKILL METRICS PANEL */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div style={{ ...STYLES.card, flex: 1, background: TOKENS.surfaceLow }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '12px' }}>HISTORICAL VOLATILITY</div>
                <div style={{ ...STYLES.mono, fontSize: '20px', color: '#fff' }}>{Math.abs(activeSkillObj.momentum * 0.4).toFixed(2)}%</div>
              </div>
              <div style={{ ...STYLES.card, flex: 1, background: TOKENS.surfaceLow }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '12px' }}>DOMAIN DOMINANCE</div>
                <div style={{ ...STYLES.mono, fontSize: '20px', color: TOKENS.primary }}>{activeSkillObj.score > 70 ? 'High' : 'Moderate'}</div>
              </div>
              <div style={{ ...STYLES.card, flex: 1, background: TOKENS.surfaceLow }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '12px' }}>YIELD PREMIUM</div>
                <div style={{ ...STYLES.mono, fontSize: '20px', color: TOKENS.rising }}>+${(activeSkillObj.salaryImpact/1000).toFixed(1)}k</div>
              </div>
            </div>

            <div style={{ ...STYLES.card, background: TOKENS.surfaceLow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ ...STYLES.mono, fontSize: '12px', color: TOKENS.textMuted }}>AI SYNTHESIS</span>
                {!state.aiOutput.text && <button style={{ ...STYLES.buttonGhost, padding: '6px 16px', fontSize: '11px' }} onClick={doAiAnalysis}>GENERATE ANALYSIS</button>}
              </div>
              {state.aiOutput.loading ? (
                <div style={{ ...STYLES.mono, fontSize: '12px', color: TOKENS.primary }}>COMPUTING STRATEGY VECTORS <span style={{ animation: 'blink 1s infinite' }}>|</span></div>
              ) : state.aiOutput.text ? (
                <div style={{ fontSize: '15px', color: '#fff', lineHeight: '1.6' }}>{state.aiOutput.text}</div>
              ) : (
                <div style={{ fontSize: '14px', color: TOKENS.textMuted }}>No proactive analysis generated for this asset yet.</div>
              )}
            </div>
          </div>

          {/* RIGHT WATCHLIST */}
          <div style={{ flex: 0.3, background: TOKENS.surfaceLow, borderLeft: `1px solid ${TOKENS.ghostBorder}`, overflowY: 'auto' }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${TOKENS.ghostBorder}`, ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted }}>MARKET WATCHLIST</div>
            {state.watchlist.map((skill) => {
              const isActive = skill.id === state.activeSkill;
              const trdColor = skill.trend === 'rising' ? TOKENS.rising : skill.trend === 'declining' ? TOKENS.declining : TOKENS.stable;
              return (
                <div key={skill.id} onClick={() => dispatch({ type: 'SET_ACTIVE_SKILL', payload: skill.id })} style={{ padding: '16px 24px', borderBottom: `1px solid ${TOKENS.ghostBorder}`, display: 'flex', alignItems: 'center', cursor: 'pointer', background: isActive ? TOKENS.surfaceHigh : 'transparent' }}>
                  <div style={{ width: '3px', height: '32px', background: trdColor, marginRight: '16px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...STYLES.mono, fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{skill.name}</div>
                    <div style={{ ...STYLES.mono, fontSize: '10px', color: TOKENS.textMuted }}>{skill.domain}</div>
                  </div>
                  <div style={{ width: '80px', height: '32px', marginRight: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={skill.history}>
                        <Line type="monotone" dataKey="score" stroke={trdColor} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ textAlign: 'right', ...STYLES.mono }}>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{skill.score.toFixed(1)}</div>
                    <div style={{ fontSize: '10px', color: trdColor }}>{skill.momentum > 0 ? '+' : ''}{skill.momentum}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state.page === 'profile' && (
        <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
              <div>
                <h2 style={{ ...STYLES.display, fontSize: '36px', marginBottom: '8px' }}>Terminal Profile</h2>
                <div style={{ ...STYLES.mono, fontSize: '13px', color: TOKENS.textMuted }}>Software Engineering // AI Infrastructure</div>
              </div>
              <div style={{ display: 'flex', gap: '32px', ...STYLES.mono }}>
                <div>
                  <div style={{ fontSize: '10px', color: TOKENS.textMuted, marginBottom: '4px' }}>DOMAIN FIT</div>
                  <div style={{ fontSize: '24px', color: TOKENS.rising }}>82%</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: TOKENS.textMuted, marginBottom: '4px' }}>SKILLS HELD</div>
                  <div style={{ fontSize: '24px', color: '#fff' }}>14</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ flex: 0.5, ...STYLES.card, background: TOKENS.surfaceLow, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, alignSelf: 'flex-start', width: '100%' }}>CAPABILITY RADAR</div>
                <div style={{ width: '100%', height: '340px' }}>
                  <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                      { subject: 'AI/ML', A: 80, B: 90, fullMark: 100 },
                      { subject: 'Systems', A: 45, B: 70, fullMark: 100 },
                      { subject: 'DevOps', A: 60, B: 85, fullMark: 100 },
                      { subject: 'Web', A: 95, B: 60, fullMark: 100 },
                      { subject: 'Data', A: 70, B: 80, fullMark: 100 },
                    ]}>
                      <PolarGrid stroke={TOKENS.ghostBorder} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: TOKENS.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
                      <Radar name="My Skills" dataKey="A" stroke={TOKENS.primary} fill={TOKENS.primary} fillOpacity={0.2} />
                      <Radar name="Market Required" dataKey="B" stroke={TOKENS.ghostBorder} fill="none" strokeDasharray="3 3" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', gap: '24px', ...STYLES.mono, fontSize: '10px' }}>
                  <div style={{ color: TOKENS.primary }}>● HELD SKILLS</div>
                  <div style={{ color: TOKENS.textMuted }}>○ DOMAIN REQ</div>
                </div>
              </div>

              <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted }}>AI INVESTMENT NODES (EXPANDED)</div>
                {!state.aiOutput.recommendations.length && (
                  <div style={{ ...STYLES.card, textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{ color: TOKENS.textMuted, marginBottom: '16px' }}>Compute optimal learning pathways.</div>
                    <button style={STYLES.buttonGhost} onClick={doAiAnalysis}>MINT PATHWAY</button>
                  </div>
                )}
                {state.aiOutput.recommendations.map((rec, i) => (
                  <div key={i} style={{ ...STYLES.card, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: TOKENS.stable }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '600' }}>{rec.skill}</span>
                      <span style={{ ...STYLES.mono, fontSize: '12px', color: TOKENS.stable }}>CONF: {rec.confidence}%</span>
                    </div>
                    
                    <p style={{ color: TOKENS.textMuted, fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>{rec.rationale}</p>
                    
                    <div style={{ background: TOKENS.surfaceHigh, padding: '12px', borderRadius: '4px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{...STYLES.mono, fontSize: '10px', color: TOKENS.textMuted}}>PROJECTED YIELD</div>
                        <div style={{...STYLES.mono, fontSize: '14px', color: TOKENS.rising}}>{rec.yield}</div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{...STYLES.mono, fontSize: '10px', color: TOKENS.textMuted}}>TIMELINE</div>
                        <div style={{...STYLES.mono, fontSize: '14px', color: TOKENS.textMain}}>{rec.weeks} WKS</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: TOKENS.primary, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        VIEW MODULES <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW PAGES: ROADMAP, STAKING, NEWS */}

      {state.page === 'roadmap' && (
        <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ ...STYLES.display, fontSize: '36px', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Map size={36} color={TOKENS.primary} /> Capability Roadmap
            </h2>
            
            <div style={{ position: 'relative', paddingLeft: '48px' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '16px', width: '2px', background: TOKENS.ghostBorder }} />
              
              {[
                { time: 'Q2 2026', title: 'Vector Database Proficiency', status: 'active', sub: 'Mastering Pinecone and advanced semantic retrieval.' },
                { time: 'Q3 2026', title: 'Kubernetes Orchestration', status: 'upcoming', sub: 'Scaling microservices and distributed deployments.' },
                { time: 'Q4 2026', title: 'GraphQL Enterprise Logic', status: 'upcoming', sub: 'Unifying fragmented REST APIs into a single graph.' }
              ].map((step, i) => (
                <div key={i} style={{ marginBottom: '48px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-42px', top: '4px', background: TOKENS.bg, padding: '4px' }}>
                    <Circle size={16} fill={step.status === 'active' ? TOKENS.primary : TOKENS.surfaceHigh} color={step.status === 'active' ? TOKENS.primary : TOKENS.ghostBorder} />
                  </div>
                  <div style={{ ...STYLES.mono, fontSize: '12px', color: TOKENS.textMuted, marginBottom: '8px' }}>{step.time}</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: step.status === 'active' ? TOKENS.primary : '#fff' }}>{step.title}</h3>
                  <p style={{ color: TOKENS.textMuted, fontSize: '15px' }}>{step.sub}</p>
                  {step.status === 'active' && (
                    <div style={{ margin: '16px 0', padding: '16px', background: TOKENS.surfaceLow, borderRadius: '6px', border: `1px solid ${TOKENS.ghostBorder}` }}>
                      <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.rising, marginBottom: '8px' }}>IN PROGRESS - 45%</div>
                      <div style={{ height: '4px', background: TOKENS.surfaceHigh, width: '100%', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: '45%', background: TOKENS.rising, borderRadius: '2px' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {state.page === 'staking' && (
        <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <h2 style={{ ...STYLES.display, fontSize: '36px', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Lock size={36} color={TOKENS.stable} /> Skill Staking
            </h2>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
              <div style={{ ...STYLES.card, flex: 1, background: TOKENS.surfaceLow }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '12px' }}>TOTAL VALUE LOCKED (YIELD)</div>
                <div style={{ ...STYLES.mono, fontSize: '32px', color: '#fff' }}>$45,000</div>
              </div>
              <div style={{ ...STYLES.card, flex: 1, background: TOKENS.surfaceLow }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '12px' }}>AVERAGE PORTFOLIO APY</div>
                <div style={{ ...STYLES.mono, fontSize: '32px', color: TOKENS.primary }}>+12.4%</div>
              </div>
              <div style={{ ...STYLES.card, flex: 1, background: TOKENS.surfaceLow }}>
                <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '12px' }}>TIME LOCKED</div>
                <div style={{ ...STYLES.mono, fontSize: '32px', color: TOKENS.stable }}>1.2 YRS</div>
              </div>
            </div>

            <h3 style={{ ...STYLES.mono, fontSize: '14px', marginBottom: '24px', color: TOKENS.textMuted }}>ACTIVE STAKING CONTRACTS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {['Python', 'React', 'LangChain'].map(skill => (
                <div key={skill} style={{ ...STYLES.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>{skill}</h4>
                    <div style={{ ...STYLES.mono, fontSize: '12px', color: TOKENS.textMuted }}>Locked Protocol</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...STYLES.mono, fontSize: '16px', color: TOKENS.rising, marginBottom: '4px' }}>+8% APY</div>
                    <button style={{ ...STYLES.buttonGhost, padding: '6px 12px', fontSize: '10px' }}>UNSTAKE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {state.page === 'news' && (
        <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ ...STYLES.display, fontSize: '36px', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Newspaper size={36} color={TOKENS.primary} /> Market News
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { title: 'OpenAI Drops GPT-5, Prompt Engineering Rally Extends', time: '2h ago', impact: '+14% PROMPT', trend: 'up' },
                { title: 'Vercel Announces New Rust-Based Build Engine', time: '5h ago', impact: '+8% RUST', trend: 'up' },
                { title: 'Legacy Frameworks Face Mass Sell-Off as AI Coders Adapt', time: '12h ago', impact: '-6% LEGACY', trend: 'down' },
                { title: 'Data Science Yield Premiums Stabilize Around $15k', time: '1d ago', impact: 'STABLE', trend: 'neutral' },
              ].map((news, i) => (
                <div key={i} style={{ ...STYLES.card, background: TOKENS.surfaceLow, display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...STYLES.mono, fontSize: '11px', color: TOKENS.textMuted, marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Clock size={12} /> {news.time}
                    </div>
                    <h3 style={{ fontSize: '18px', color: '#fff', lineHeight: '1.4' }}>{news.title}</h3>
                  </div>
                  <div style={{ padding: '12px 16px', background: TOKENS.surface, borderRadius: '4px', border: `1px solid ${news.trend === 'up' ? TOKENS.rising : news.trend === 'down' ? TOKENS.declining : TOKENS.ghostBorder}` }}>
                    <div style={{ ...STYLES.mono, fontSize: '12px', color: news.trend === 'up' ? TOKENS.rising : news.trend === 'down' ? TOKENS.declining : TOKENS.stable }}>
                      {news.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
