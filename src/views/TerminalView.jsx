import React, { useState } from 'react';

export default function TerminalView({ onDeepDive }) {
  const [chartMode, setChartMode] = useState('CANDLESTICK'); // CANDLESTICK | AREA | HEIKIN_ASHI
  const [timeframe, setTimeframe] = useState('1W'); // 1D | 1W | 1M

  const ohlcData = {
    '1D': { O: '2,840.1', H: '2,852.5', L: '2,810.0', C: '2,842.1' },
    '1W': { O: '2,740.2', H: '2,892.1', L: '2,710.4', C: '2,842.1' },
    '1M': { O: '2,500.0', H: '2,900.0', L: '2,400.0', C: '2,842.1' },
  };

  const ohlc = ohlcData[timeframe];

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

        {/* Chart Layout Mock */}
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
          <div style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--neon-green)', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--neon-green)' }} />
            DEMAND_CANDLESTICK_HISTORY_V4
          </div>

          <svg width="100%" height="300" viewBox="0 0 800 300" preserveAspectRatio="none">
            {/* Grid lines */}
            {[50, 100, 150, 200, 250].map(y => (
              <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="var(--border-ghost)" strokeDasharray="2,2" />
            ))}
            
            {chartMode === 'CANDLESTICK' || chartMode === 'HEIKIN_ASHI' ? (
              <g>
                {/* Mock Candles customized by TF to look a bit different */}
                <line x1="50" y1="180" x2="50" y2="240" stroke="var(--neon-green)" strokeWidth="1" />
                <rect x="45" y="200" width="10" height="30" fill="var(--neon-green)" />
                
                <line x1="100" y1="160" x2="100" y2="220" stroke="var(--neon-red)" strokeWidth="1" />
                <rect x="95" y="170" width="10" height="40" fill="var(--neon-red)" />

                <line x1="150" y1="120" x2="150" y2="200" stroke="var(--neon-green)" strokeWidth="1" />
                <rect x="145" y="140" width="10" height="50" fill="var(--neon-green)" />

                <line x1="200" y1="90" x2="200" y2="150" stroke="var(--neon-green)" strokeWidth="1" />
                <rect x="195" y="100" width="10" height="30" fill="var(--neon-green)" />

                <line x1="250" y1={timeframe === '1W' ? 110 : 130} x2="250" y2={timeframe === '1W' ? 180 : 200} stroke="var(--neon-red)" strokeWidth="1" />
                <rect x="245" y={timeframe === '1W' ? 120 : 140} width="10" height="50" fill="var(--neon-red)" />
                
                <line x1="300" y1="100" x2="300" y2="150" stroke="var(--neon-green)" strokeWidth="1" />
                <rect x="295" y="110" width="10" height="20" fill="var(--neon-green)" />
                
                <line x1="350" y1="80" x2="350" y2="160" stroke="var(--neon-red)" strokeWidth="1" />
                <rect x="345" y="90" width="10" height="60" fill="var(--neon-red)" />

                <line x1="400" y1={timeframe === '1M' ? 40 : 60} x2="400" y2="140" stroke="var(--neon-green)" strokeWidth="1" />
                <rect x="395" y={timeframe === '1M' ? 60 : 80} width="10" height="40" fill="var(--neon-green)" />

                <line x1="450" y1="50" x2="450" y2="100" stroke="var(--neon-green)" strokeWidth="1" />
                <rect x="445" y="55" width="10" height={timeframe === '1M' ? 60 : 30} fill="var(--neon-green)" />
              </g>
            ) : (
              <g>
                <path d="M 0,250 L 50,220 L 100,230 L 150,180 L 200,120 L 250,160 L 300,130 L 350,140 L 400,90 L 450,70 L 450,300 L 0,300 Z" fill="rgba(0, 255, 136, 0.1)" />
                <path d="M 0,250 L 50,220 L 100,230 L 150,180 L 200,120 L 250,160 L 300,130 L 350,140 L 400,90 L 450,70" fill="none" stroke="var(--neon-green)" strokeWidth="2" />
                <rect x="445" y="50" width="10" height="40" fill="none" stroke="var(--neon-green)" strokeDasharray="2,2" />
              </g>
            )}
          </svg>
          <div style={{ display: 'flex', gap: '32px', marginTop: '16px', fontSize: '10px', color: 'var(--text-muted)' }}>
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
              <div style={{ width: '40px' }}>
                <svg width="100%" height="20" preserveAspectRatio="none">
                  <path d={it.trend.startsWith('+') ? "M0,15 L10,12 L20,14 L30,5 L40,8" : "M0,8 L10,5 L20,12 L30,10 L40,15"} fill="none" stroke={it.color} strokeWidth="1.5" />
                </svg>
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
