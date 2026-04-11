import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TerminalView({ onDeepDive, watchlist = [] }) {
  const [chartMode, setChartMode] = useState('AREA'); // CANDLESTICK | AREA | HEIKIN_ASHI
  const [timeframe, setTimeframe] = useState('1W'); // 1D | 1W | 1M

  const ohlcData = {
    '1D': { O: '2,840.1', H: '2,852.5', L: '2,810.0', C: '2,842.1' },
    '1W': { O: '2,740.2', H: '2,892.1', L: '2,710.4', C: '2,842.1' },
    '1M': { O: '2,500.0', H: '2,900.0', L: '2,400.0', C: '2,842.1' },
  };

  const ohlc = ohlcData[timeframe];

  // Dynamic animated datasets based on timeframe
  const datasets = {
    '1D': [
      { time: '00:00', value: 2840 }, { time: '04:00', value: 2810 }, { time: '08:00', value: 2835 },
      { time: '12:00', value: 2820 }, { time: '16:00', value: 2852 }, { time: '20:00', value: 2842 }
    ],
    '1W': [
      { time: 'Mon', value: 2740 }, { time: 'Tue', value: 2710 }, { time: 'Wed', value: 2800 },
      { time: 'Thu', value: 2892 }, { time: 'Fri', value: 2880 }, { time: 'Sat', value: 2842 }
    ],
    '1M': [
      { time: 'W1', value: 2500 }, { time: 'W2', value: 2700 }, { time: 'W3', value: 2400 },
      { time: 'W4', value: 2900 }, { time: 'W5', value: 2842 }, { time: 'W6', value: 2842 }
    ]
  };

  const chartData = datasets[timeframe];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', marginLeft: '80px', overflow: 'hidden' }}>
      
      {/* Main Chart Area */}
      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-ghost)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              MARKET_AGGREGATE // TECH_INDEX <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--neon-green)' }} />
            </div>
            <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '48px', margin: 0 }}>OVERVIEW</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['CANDLESTICK', 'AREA', 'HEIKIN_ASHI'].map(mode => (
              <span 
                key={mode} 
                onClick={() => setChartMode(mode)}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: chartMode === mode ? 'var(--bg-surface-elevated)' : 'transparent', 
                  border: chartMode === mode ? '1px solid var(--border-ghost)' : '1px transparent', 
                  fontSize: '10px', 
                  color: chartMode === mode ? '#fff' : 'var(--text-muted)', 
                  cursor: 'pointer' 
                }}>
                {mode}
              </span>
            ))}
          </div>
        </div>

        {/* Chart Layout */}
        <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid var(--border-ghost)', marginBottom: '32px' }}>
          
          <div style={{ position: 'absolute', right: '16px', top: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
            {['1D', '1W', '1M'].map(tf => (
              <span 
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  fontSize: '9px',
                  color: timeframe === tf ? 'var(--neon-green)' : 'var(--text-muted)',
                  border: timeframe === tf ? '1px solid var(--neon-green)' : '1px solid var(--border-ghost)',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  backgroundColor: timeframe === tf ? 'rgba(0,255,136,0.1)' : 'transparent'
                }}>
                {tf}
              </span>
            ))}
          </div>
          <div style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--neon-green)', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--neon-green)' }} />
            DEMAND_CANDLESTICK_HISTORY_V4
          </div>

          <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 50, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-ghost)" />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--neon-green)', fontSize: '10px' }}
                  itemStyle={{ color: 'var(--neon-green)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--neon-green)" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  isAnimationActive={true}
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ position: 'absolute', bottom: '-28px', display: 'flex', gap: '32px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span>OPEN: <span style={{ color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{ohlc.O}</span></span>
            <span>HIGH: <span style={{ color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{ohlc.H}</span></span>
            <span>LOW: <span style={{ color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{ohlc.L}</span></span>
            <span>CLOSE: <span style={{ color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{ohlc.C}</span></span>
          </div>
        </div>

        {/* Small Area Charts fixed to show liquidity lines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'AI_ML', value: '+4.8%', color: 'var(--neon-green)', path: "M0,25 Q15,20 30,22 T60,15 T90,8 T120,5" },
            { label: 'INFRA_OPS', value: '-1.2%', color: 'var(--neon-red)', path: "M0,5 Q20,8 40,6 T80,15 T120,25" },
            { label: 'SECURITY', value: '+2.1%', color: 'var(--neon-green)', path: "M0,20 Q30,18 60,15 T120,5" },
            { label: 'DATA_SCI', value: '0.0%', color: 'var(--text-muted)', path: "M0,15 L120,15" },
          ].map(c => (
            <div key={c.label} style={{ border: '1px solid var(--border-ghost)', padding: '16px', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{c.label}</span>
                <span style={{ color: c.color }}>{c.value}</span>
              </div>
              <svg width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
                <path d={c.path} fill="none" stroke={c.color} strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>

        {/* Gainers / Losers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ borderLeft: '2px solid var(--neon-green)', paddingLeft: '8px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>TOP_GAINERS_24H</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(0, 255, 136, 0.05)', border: '1px solid var(--border-ghost)' }}>
                <span>RUST_PROGRAMMING</span>
                <span style={{ color: 'var(--neon-green)' }}>+12.4%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-surface)' }}>
                <span>PYTORCH_EXP</span>
                <span style={{ color: 'var(--neon-green)' }}>+8.2%</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ borderLeft: '2px solid var(--neon-red)', paddingLeft: '8px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>TOP_LOSERS_24H</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(255, 51, 102, 0.05)', border: '1px solid var(--border-ghost)' }}>
                <span>LEGACY_JAVA_EE</span>
                <span style={{ color: 'var(--neon-red)' }}>-15.2%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-surface)' }}>
                <span>PERL_SCRIPTING</span>
                <span style={{ color: 'var(--neon-red)' }}>-9.4%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar */}
      <div style={{ width: '320px', padding: '32px', backgroundColor: 'var(--bg-surface-elevated)' }}>
        
        <div style={{ border: '1px solid var(--neon-green)', borderRadius: '50%', width: '180px', height: '180px', margin: '0 auto 32px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRightColor: 'rgba(0,255,136,0.2)', borderBottomColor: 'rgba(0,255,136,0.2)', transform: 'rotate(-45deg)' }}>
          <div style={{ transform: 'rotate(45deg)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: '#fff', fontWeight: 'bold' }}>82%</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>COMPATIBILITY</div>
          </div>
        </div>

        <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '48px', lineHeight: '1.6' }}>
          NEURAL MAPPING INDICATES HIGH RESONANCE WITH <span style={{ color: 'var(--neon-green)' }}>82%</span> OF TIER-1 SECTOR MANDATES.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '9px', color: 'var(--text-muted)' }}>
          <span>MARKET_WATCHLIST</span>
          <span>≡</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { tag: 'PY', name: 'PYTHON', desc: 'CORE_STACK', val: '76.2', trend: '+0.4%', color: 'var(--neon-green)' },
            { tag: 'TS', name: 'TYPESCRIPT', desc: 'FRONT_ENGINE', val: '84.9', trend: '-1.2%', color: 'var(--neon-red)' },
            { tag: 'RS', name: 'RUST', desc: 'SYS_LEVEL', val: '62.1', trend: '+5.2%', color: 'var(--neon-green)' },
            { tag: 'GO', name: 'GOLANG', desc: 'CLOUD_NATIVE', val: '55.8', trend: '+2.1%', color: 'var(--neon-green)' },
          ].map(it => (
            <div 
              key={it.tag} 
              onClick={() => onDeepDive('PYTHON')}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
              title="Click to deep dive asset"
            >
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-8px', top: '0', bottom: '0', width: '2px', backgroundColor: it.color }} />
                <div style={{ border: '1px solid var(--border-ghost)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                  {it.tag}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px' }}>{it.name}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{it.desc}</div>
              </div>
              <div style={{ width: '40px', height: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={
                    // Generate a quick stable mock array depending on timeframe string
                    Array.from({length: 6}).map((_, i) => ({ val: Math.random() * (timeframe === '1D' ? 10 : timeframe === '1W' ? 20 : 50) + (it.trend.startsWith('+') ? i : 6-i) }))
                  }>
                    <Area type="monotone" dataKey="val" stroke={it.color} fill="none" strokeWidth={1.5} isAnimationActive={true} animationDuration={600} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: 'right', width: '40px' }}>
                <div style={{ fontSize: '12px' }}>{it.val}</div>
                <div style={{ fontSize: '9px', color: it.color }}>{it.trend}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
