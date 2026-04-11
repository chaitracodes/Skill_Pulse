import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ComposedChart, Bar, Cell, BarChart
} from 'recharts';

// ── OHLC Generator ──────────────────────────────────────────────────────────
function generateOHLC(count, startValue = 70, startDate = null) {
  const data = [];
  let price = startValue;
  const now = startDate || new Date();

  for (let i = 0; i < count; i++) {
    const open = price + (Math.random() - 0.5) * 4;
    const close = open + (Math.random() - 0.5) * 6;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    const volume = Math.round(1000 + Math.random() * 4000);
    const d = new Date(now);
    d.setDate(d.getDate() - (count - i));
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume,
    });
    price = close;
  }
  return data;
}

function generateIntraday() {
  const data = [];
  let price = 70;
  const hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
  for (const h of hours) {
    const open = price + (Math.random() - 0.5) * 2;
    const close = open + (Math.random() - 0.5) * 3;
    const high = Math.max(open, close) + Math.random() * 1.5;
    const low = Math.min(open, close) - Math.random() * 1.5;
    data.push({ date: h, open: +open.toFixed(2), close: +close.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), volume: Math.round(500 + Math.random() * 2000) });
    price = close;
  }
  return data;
}

const ALL_DATA = generateOHLC(365);

const TIMEFRAME_SLICES = {
  '1D': generateIntraday(),
  '1W': ALL_DATA.slice(-7),
  '1M': ALL_DATA.slice(-30),
  '3M': ALL_DATA.slice(-90),
  '1Y': ALL_DATA.slice(-365),
  'ALL': ALL_DATA,
};

// ── Custom Candlestick Bar ───────────────────────────────────────────────────
const CandleShape = (props) => {
  const { x, y, width, height, open, close, high, low, index, payload } = props;
  if (!payload) return null;
  const { open: o, close: c, high: h, low: l } = payload;
  const bullish = c >= o;
  const color = bullish ? '#00FF88' : '#FF4444';

  // We receive recharts bar y/height for the body range. But we need to
  // compute wick positions from the chart's scale. We use a trick:
  // recharts passes yAxis info via the 'background' or we compute manually.
  // Better: use the full bar background height to derive scale.
  // Actually the simplest: use the raw values and rely on recharts scaling.
  // The Bar dataKey="bodyHeight" gives us pixel dimensions already scaled.
  // We'll just draw using those.
  const bodyTop = Math.min(y, y + height);
  const bodyBot = Math.max(y, y + height);
  const cx = x + width / 2;

  return (
    <g>
      {/* Wick */}
      <line x1={cx} y1={y - 8} x2={cx} y2={bodyTop} stroke={color} strokeWidth={1} />
      <line x1={cx} y1={bodyBot} x2={cx} y2={bodyBot + 8} stroke={color} strokeWidth={1} />
      {/* Body */}
      <rect
        x={x + 1}
        y={bodyTop}
        width={Math.max(width - 2, 1)}
        height={Math.max(Math.abs(height), 1)}
        fill={bullish ? '#00FF88' : '#FF4444'}
        stroke={color}
        strokeWidth={0.5}
      />
    </g>
  );
};

export default function TerminalView({ onDeepDive, watchlist = [] }) {
  const [chartType, setChartType] = useState('CANDLE'); // CANDLE | LINE
  const [timeframe, setTimeframe] = useState('1W');
  const [chartOpacity, setChartOpacity] = useState(1);

  const rawData = TIMEFRAME_SLICES[timeframe] || TIMEFRAME_SLICES['1W'];

  // Area chart data derived from close prices
  const lineData = rawData.map(d => ({ time: d.date, value: d.close }));

  // Candlestick: we pass bodyHigh and bodyLow; recharts Bar will stack them
  // We use a "range bar" trick: have two Bar stacked, first invisible offset, second body
  const candleData = rawData.map(d => {
    const bullish = d.close >= d.open;
    const bodyLow = Math.min(d.open, d.close);
    const bodyHigh = Math.max(d.open, d.close);
    return {
      ...d,
      bullish,
      bodyLow,
      bodyHeight: parseFloat((bodyHigh - bodyLow).toFixed(2)),
    };
  });

  const ohlc = rawData.length > 0 ? rawData[rawData.length - 1] : { open: 0, high: 0, low: 0, close: 0 };

  const switchChart = (type) => {
    setChartOpacity(0);
    setTimeout(() => {
      setChartType(type);
      setChartOpacity(1);
    }, 150);
  };

  const switchTimeframe = (tf) => {
    setChartOpacity(0);
    setTimeout(() => {
      setTimeframe(tf);
      setChartOpacity(1);
    }, 100);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', marginLeft: '80px', overflow: 'hidden' }}>

      {/* ── Main Chart Area ── */}
      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-ghost)', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              MARKET_AGGREGATE // TECH_INDEX
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--neon-green)' }} />
            </div>
            <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '48px', margin: 0 }}>OVERVIEW</h1>
          </div>

          {/* Chart Type Toggle */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-ghost)', padding: '4px', borderRadius: '4px' }}>
            {['CANDLE', 'LINE'].map(type => (
              <button
                key={type}
                onClick={() => switchChart(type)}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '2px',
                  background: chartType === type ? '#1F1F1F' : 'transparent',
                  color: chartType === type ? '#F0F0F0' : '#3A3A3A',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.2s'
                }}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(tf => (
            <span
              key={tf}
              onClick={() => switchTimeframe(tf)}
              style={{
                fontSize: '10px',
                color: timeframe === tf ? 'var(--neon-green)' : 'var(--text-muted)',
                border: timeframe === tf ? '1px solid var(--neon-green)' : '1px solid var(--border-ghost)',
                padding: '4px 12px',
                cursor: 'pointer',
                backgroundColor: timeframe === tf ? 'rgba(0,255,136,0.1)' : 'transparent',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.2s'
              }}>
              {tf}
            </span>
          ))}

          {/* OHLC display */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px', fontSize: '10px', alignItems: 'center' }}>
            {[['O', ohlc.open], ['H', ohlc.high], ['L', ohlc.low], ['C', ohlc.close]].map(([k, v]) => (
              <span key={k} style={{ color: 'var(--text-muted)' }}>
                {k}: <span style={{ color: '#fff', textShadow: '0 0 6px rgba(255,255,255,0.5)', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div style={{ transition: 'opacity 0.3s', opacity: chartOpacity }}>
          {chartType === 'CANDLE' ? (
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={candleData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="1 6" stroke="#1A1A1A" />
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: '#3A3A3A' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  orientation="right"
                  domain={['auto', 'auto']}
                  tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: '#3A3A3A' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1F1F1F', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
                  formatter={(val, name) => [val, name]}
                  labelStyle={{ color: 'var(--neon-green)' }}
                />
                {/* Invisible baseline bar to offset body position */}
                <Bar dataKey="bodyLow" stackId="candle" fill="transparent" isAnimationActive={true} animationDuration={600} />
                {/* Body bar */}
                <Bar dataKey="bodyHeight" stackId="candle" isAnimationActive={true} animationDuration={600} radius={0}>
                  {candleData.map((entry, i) => (
                    <Cell key={i} fill={entry.bullish ? '#00FF88' : '#FF4444'} stroke={entry.bullish ? '#00FF88' : '#FF4444'} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 6" stroke="#1A1A1A" />
                <XAxis dataKey="time" tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: '#3A3A3A' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis orientation="right" domain={['auto', 'auto']} tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: '#3A3A3A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #00FF88', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }} itemStyle={{ color: '#00FF88' }} />
                <Area type="monotone" dataKey="value" stroke="#00FF88" fill="url(#lineGrad)" isAnimationActive={true} animationDuration={600} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Volume Bar Chart */}
        <div style={{ marginTop: '8px', transition: 'opacity 0.3s', opacity: chartOpacity }}>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>VOLUME</div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={candleData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barCategoryGap="20%">
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Bar dataKey="volume" isAnimationActive={true} animationDuration={600} radius={0}>
                {candleData.map((entry, i) => (
                  <Cell key={i} fill={entry.bullish ? '#00FF8866' : '#FF444466'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector mini-charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px', marginBottom: '24px' }}>
          {[
            { label: 'AI_ML', value: '+4.8%', color: 'var(--neon-green)' },
            { label: 'INFRA_OPS', value: '-1.2%', color: 'var(--neon-red)' },
            { label: 'SECURITY', value: '+2.1%', color: 'var(--neon-green)' },
            { label: 'DATA_SCI', value: '0.0%', color: 'var(--text-muted)' },
          ].map(c => (
            <div key={c.label} style={{ border: '1px solid var(--border-ghost)', padding: '16px', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{c.label}</span>
                <span style={{ color: c.color }}>{c.value}</span>
              </div>
              <svg width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
                <path d={c.value.startsWith('+') ? "M0,25 L30,20 L60,12 L90,8 L120,3" : "M0,5 L30,8 L60,15 L90,22 L120,27"}
                  fill="none" stroke={c.color} strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>

        {/* Top Gainers / Losers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ borderLeft: '2px solid var(--neon-green)', paddingLeft: '8px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>TOP_GAINERS_24H</div>
            {[{ name: 'RUST_PROGRAMMING', val: '+12.4%' }, { name: 'PYTORCH_EXP', val: '+8.2%' }].map(r => (
              <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(0,255,136,0.05)', border: '1px solid var(--border-ghost)', marginBottom: '8px' }}>
                <span>{r.name}</span>
                <span style={{ color: 'var(--neon-green)' }}>{r.val}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ borderLeft: '2px solid var(--neon-red)', paddingLeft: '8px', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>TOP_LOSERS_24H</div>
            {[{ name: 'LEGACY_JAVA_EE', val: '-15.2%' }, { name: 'PERL_SCRIPTING', val: '-9.4%' }].map(r => (
              <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(255,51,102,0.05)', border: '1px solid var(--border-ghost)', marginBottom: '8px' }}>
                <span>{r.name}</span>
                <span style={{ color: 'var(--neon-red)' }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Sidebar ── */}
      <div style={{ width: '320px', padding: '32px', backgroundColor: 'var(--bg-surface-elevated)', overflowY: 'auto' }}>

        <div style={{ border: '1px solid var(--neon-green)', borderRadius: '50%', width: '160px', height: '160px', margin: '0 auto 24px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRightColor: 'rgba(0,255,136,0.2)', borderBottomColor: 'rgba(0,255,136,0.2)', transform: 'rotate(-45deg)' }}>
          <div style={{ transform: 'rotate(45deg)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', color: '#fff', fontWeight: 'bold' }}>82%</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>COMPATIBILITY</div>
          </div>
        </div>

        <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px', lineHeight: '1.6' }}>
          NEURAL MAPPING INDICATES HIGH RESONANCE WITH <span style={{ color: 'var(--neon-green)' }}>82%</span> OF TIER-1 MANDATES.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '9px', color: 'var(--text-muted)' }}>
          <span>MARKET_WATCHLIST</span>
          <span>≡</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { tag: 'PY', name: 'PYTHON', desc: 'CORE_STACK', val: '76.2', trend: '+0.4%', color: 'var(--neon-green)' },
            { tag: 'TS', name: 'TYPESCRIPT', desc: 'FRONT_ENGINE', val: '84.9', trend: '-1.2%', color: 'var(--neon-red)' },
            { tag: 'RS', name: 'RUST', desc: 'SYS_LEVEL', val: '62.1', trend: '+5.2%', color: 'var(--neon-green)' },
            { tag: 'GO', name: 'GOLANG', desc: 'CLOUD_NATIVE', val: '55.8', trend: '+2.1%', color: 'var(--neon-green)' },
          ].map(it => (
            <div
              key={it.tag}
              onClick={() => onDeepDive(it.name)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: '-8px', top: 0, bottom: 0, width: '2px', backgroundColor: it.color }} />
                <div style={{ border: '1px solid var(--border-ghost)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>
                  {it.tag}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px' }}>{it.name}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{it.desc}</div>
              </div>
              <div style={{ width: '40px', height: '20px', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineData.slice(-6)}>
                    <Area type="monotone" dataKey="value" stroke={it.color} fill="none" strokeWidth={1.5} isAnimationActive={true} animationDuration={600} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: 'right', width: '44px', flexShrink: 0 }}>
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
