import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ComposedChart, Bar, Cell, BarChart
} from 'recharts';
import { fetchTrends } from '../utils/trendsApi';
import { getTrendKeyword, ALL_ROLES } from '../utils/jobRoleKeywords';

// ── Watchlist item component ─────────────────────────────────────────────────
function WatchlistItem({ role, isActive, onClick }) {
  return (
    <div
      onClick={() => onClick(role)}
      style={{
        padding: '14px 16px',
        borderLeft: isActive ? '2px solid #00FF88' : '2px solid transparent',
        backgroundColor: isActive ? 'rgba(0,255,136,0.06)' : 'transparent',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-ghost)',
        transition: 'all 0.15s'
      }}
    >
      <div style={{ fontSize: '12px', color: isActive ? '#00FF88' : '#fff', marginBottom: '2px' }}>{role}</div>
      <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace' " }}>
        {getTrendKeyword(role)}
      </div>
    </div>
  );
}

// ── Searchable role adder ────────────────────────────────────────────────────
function RoleSearch({ onAdd, existing }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = ALL_ROLES.filter(r =>
    r.toLowerCase().includes(query.toLowerCase()) && !existing.includes(r)
  ).slice(0, 12);

  return (
    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-ghost)', position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search job roles..."
        style={{
          width: '100%', boxSizing: 'border-box',
          background: '#111', border: '1px solid #1F1F1F', borderRadius: '2px',
          color: '#F0F0F0', padding: '9px 12px', fontSize: '11px',
          outline: 'none', fontFamily: "'JetBrains Mono', monospace"
        }}
      />
      {open && query && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: '12px', right: '12px',
          background: '#111', border: '1px solid #1F1F1F', zIndex: 50,
          maxHeight: '200px', overflowY: 'auto'
        }}>
          {filtered.map(r => (
            <div
              key={r}
              onMouseDown={() => { onAdd(r); setQuery(''); setOpen(false); }}
              style={{ padding: '10px 14px', fontSize: '11px', color: '#F0F0F0', cursor: 'pointer', borderBottom: '1px solid #1a1a1a' }}
              onMouseOver={e => e.currentTarget.style.background = '#1a1a1a'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function TerminalView({
  onDeepDive,
  watchlist1 = [], // AI predicted
  watchlist2 = [], setWatchlist2,
  watchlist3 = [], setWatchlist3,
}) {
  const [chartType, setChartType] = useState('CANDLE');
  const [timeframe, setTimeframe] = useState('1M');
  const [chartOpacity, setChartOpacity] = useState(1);
  const [activeRole, setActiveRole] = useState(null);
  const [activeWL, setActiveWL] = useState(1); // 1 | 2 | 3
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('mock');

  // Set default active role when watchlist1 loads
  useEffect(() => {
    if (watchlist1.length > 0 && !activeRole) {
      setActiveRole(watchlist1[0]);
    }
  }, [watchlist1]);

  // ── Fetch live Google Trends for the active job role ─────────────────────
  const loadData = useCallback(async () => {
    if (!activeRole) return;
    setIsLoading(true);
    setChartOpacity(0.4);
    const keyword = getTrendKeyword(activeRole);
    const { candles, source } = await fetchTrends(keyword, timeframe);
    setRawData(candles);
    setDataSource(source);
    setIsLoading(false);
    setChartOpacity(1);
  }, [activeRole, timeframe]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Derived chart arrays ─────────────────────────────────────────────────
  const lineData = rawData.map(d => ({ time: d.date, value: d.close }));
  const candleData = rawData.map(d => {
    const bullish = d.close >= d.open;
    return {
      ...d, bullish,
      bodyLow: Math.min(d.open, d.close),
      bodyHeight: parseFloat(Math.abs(d.close - d.open).toFixed(2)),
    };
  });
  const ohlc = rawData.length > 0 ? rawData[rawData.length - 1] : { open: 0, high: 0, low: 0, close: 0 };

  const switchChart = (t) => { setChartOpacity(0); setTimeout(() => { setChartType(t); setChartOpacity(1); }, 150); };

  const sourceColor = dataSource === 'google_trends' ? '#00FF88' : dataSource === 'cache' ? '#00D4FF' : 'var(--text-muted)';
  const sourceLabel = dataSource === 'google_trends' ? '● LIVE: Google Trends' : dataSource === 'cache' ? '◆ CACHED' : '○ MOCK DATA';

  // Active watchlist data
  const activeList = activeWL === 1 ? watchlist1 : activeWL === 2 ? watchlist2 : watchlist3;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', marginLeft: '80px', overflow: 'hidden' }}>

      {/* ── Main Chart Area ── */}
      <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-ghost)', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace", display: 'flex', gap: '12px' }}>
              <span>MARKET_AGGREGATE // JOB_DEMAND_INDEX</span>
              <span style={{ color: sourceColor }}>{sourceLabel}</span>
            </div>
            <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '42px', margin: 0 }}>
              {activeRole ? activeRole.toUpperCase() : 'SELECT A ROLE'}
            </h1>
            {activeRole && (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                TREND KEYWORD: "{getTrendKeyword(activeRole)}"
              </div>
            )}
          </div>

          {/* Chart type toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-ghost)', padding: '4px', borderRadius: '4px', flexShrink: 0 }}>
            {['CANDLE', 'LINE'].map(t => (
              <button key={t} onClick={() => switchChart(t)} style={{
                padding: '7px 18px', border: 'none', borderRadius: '2px',
                background: chartType === t ? '#1F1F1F' : 'transparent',
                color: chartType === t ? '#F0F0F0' : '#3A3A3A',
                fontSize: '10px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace"
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', alignItems: 'center' }}>
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(tf => (
            <span key={tf} onClick={() => setTimeframe(tf)} style={{
              fontSize: '10px', padding: '4px 10px', cursor: 'pointer',
              color: timeframe === tf ? '#00FF88' : 'var(--text-muted)',
              border: timeframe === tf ? '1px solid #00FF88' : '1px solid var(--border-ghost)',
              background: timeframe === tf ? 'rgba(0,255,136,0.08)' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.15s'
            }}>{tf}</span>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', fontSize: '10px', alignItems: 'center' }}>
            {[['O', ohlc.open], ['H', ohlc.high], ['L', ohlc.low], ['C', ohlc.close]].map(([k, v]) => (
              <span key={k} style={{ color: 'var(--text-muted)' }}>
                {k}: <span style={{ color: '#fff', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace", textShadow: '0 0 6px rgba(255,255,255,0.4)' }}>{v}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px', fontSize: '10px', color: '#00FF88', fontFamily: "'JetBrains Mono', monospace" }}>
            FETCHING GOOGLE TRENDS DATA...
          </div>
        )}

        {/* Main chart */}
        <div style={{ transition: 'opacity 0.3s', opacity: chartOpacity }}>
          {!activeRole ? (
            <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-ghost)', color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
              SELECT A JOB ROLE FROM THE WATCHLIST TO VIEW TRENDS →
            </div>
          ) : chartType === 'CANDLE' ? (
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={candleData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="1 6" stroke="#1A1A1A" />
                <XAxis dataKey="date" tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: '#3A3A3A' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis orientation="right" domain={['auto', 'auto']} tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: '#3A3A3A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1F1F1F', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }} labelStyle={{ color: '#00FF88' }} />
                <Bar dataKey="bodyLow" stackId="c" fill="transparent" isAnimationActive={true} animationDuration={600} />
                <Bar dataKey="bodyHeight" stackId="c" isAnimationActive={true} animationDuration={600}>
                  {candleData.map((e, i) => <Cell key={i} fill={e.bullish ? '#00FF88' : '#FF4444'} />)}
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
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #00FF88', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }} itemStyle={{ color: '#00FF88' }} />
                <Area type="monotone" dataKey="value" stroke="#00FF88" fill="url(#lineGrad)" isAnimationActive={true} animationDuration={600} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Volume bars */}
        {activeRole && candleData.length > 0 && (
          <div style={{ marginTop: '8px', transition: 'opacity 0.3s', opacity: chartOpacity }}>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>SEARCH VOLUME (RELATIVE)</div>
            <ResponsiveContainer width="100%" height={72}>
              <BarChart data={candleData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barCategoryGap="20%">
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Bar dataKey="volume" isAnimationActive={true} animationDuration={600}>
                  {candleData.map((e, i) => <Cell key={i} fill={e.bullish ? '#00FF8866' : '#FF444466'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sector mini cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '24px' }}>
          {['AI/ML', 'DEVOPS', 'DATA_ENG', 'WEB_DEV'].map((s, i) => {
            const vals = ['+4.8%', '+1.2%', '+3.1%', '-0.4%'];
            const pos = vals[i].startsWith('+');
            return (
              <div key={s} style={{ border: '1px solid var(--border-ghost)', padding: '14px', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s}</span>
                  <span style={{ color: pos ? '#00FF88' : '#FF4444' }}>{vals[i]}</span>
                </div>
                <svg width="100%" height="28" viewBox="0 0 120 28" preserveAspectRatio="none">
                  <path d={pos ? "M0,24 L30,18 L60,10 L90,6 L120,2" : "M0,4 L30,8 L60,14 L90,20 L120,25"} fill="none" stroke={pos ? '#00FF88' : '#FF4444'} strokeWidth="1.5" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Sidebar: 3 Watchlists ── */}
      <div style={{ width: '310px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-surface-elevated)' }}>

        {/* Watchlist Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-ghost)' }}>
          {[1, 2, 3].map(n => (
            <div key={n} onClick={() => setActiveWL(n)} style={{
              flex: 1, padding: '14px 0', textAlign: 'center', fontSize: '10px',
              color: activeWL === n ? '#00FF88' : 'var(--text-muted)',
              borderBottom: activeWL === n ? '2px solid #00FF88' : '2px solid transparent',
              cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.15s'
            }}>
              WL{n}{n === 1 ? ' (AI)' : ''}
            </div>
          ))}
        </div>

        {/* WL description */}
        <div style={{ padding: '10px 16px', fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", borderBottom: '1px solid var(--border-ghost)' }}>
          {activeWL === 1
            ? 'AI-PREDICTED ROLES FROM YOUR RÉSUMÉ'
            : activeWL === 2
            ? 'YOUR CUSTOM WATCHLIST 2'
            : 'YOUR CUSTOM WATCHLIST 3'}
        </div>

        {/* Search bar for WL2/WL3 */}
        {activeWL !== 1 && (
          <RoleSearch
            existing={activeWL === 2 ? watchlist2 : watchlist3}
            onAdd={(role) => {
              if (activeWL === 2) setWatchlist2(prev => prev.includes(role) ? prev : [...prev, role]);
              else setWatchlist3(prev => prev.includes(role) ? prev : [...prev, role]);
            }}
          />
        )}

        {/* Role list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeList.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.8' }}>
              {activeWL === 1
                ? 'Upload your résumé on the\nLanding page to auto-populate\nyour predicted job roles.'
                : 'Search and add job roles\nabove to start tracking\ntheir market trends.'}
            </div>
          ) : (
            activeList.map(role => (
              <WatchlistItem
                key={role}
                role={role}
                isActive={activeRole === role}
                onClick={(r) => setActiveRole(r)}
              />
            ))
          )}
        </div>

        {/* Remove button for WL2/WL3 */}
        {activeWL !== 1 && activeRole && activeList.includes(activeRole) && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-ghost)' }}>
            <button
              onClick={() => {
                if (activeWL === 2) setWatchlist2(prev => prev.filter(r => r !== activeRole));
                else setWatchlist3(prev => prev.filter(r => r !== activeRole));
                setActiveRole(null);
              }}
              style={{ width: '100%', padding: '10px', background: 'rgba(255,68,68,0.1)', border: '1px solid #FF4444', color: '#FF4444', fontSize: '10px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}
            >
              ✕ REMOVE "{activeRole}" FROM WL{activeWL}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
