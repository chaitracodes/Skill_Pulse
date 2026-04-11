import React, { useState, useEffect } from 'react';

export default function SkillGapView({ assetId = 'Python', watchlist = [], toggleWatchlist }) {
  const isWatched = watchlist.includes(assetId);
  const actionText = isWatched ? 'SELL' : 'BUY';
  const actionColor = isWatched ? 'var(--neon-red)' : 'var(--neon-green)';
  const actionIcon = isWatched ? '✕' : '✓';

  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)', display: 'flex', gap: '32px' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--border-ghost)', paddingBottom: '24px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '16px' }}>ASSET_CLASS: PROGRAMMING_LANGUAGE / CORE_LAYER</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
              <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '80px', margin: 0, lineHeight: 1 }}>{assetId}.src</h1>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>CURRENT_INDEX</div>
                <div style={{ fontSize: '32px', color: 'var(--neon-green)', fontWeight: 'bold' }}>70.245 <span style={{ fontSize: '14px' }}>pts</span></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '48px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>30D_VOLATILITY</div>
              <div style={{ fontSize: '24px', color: 'var(--neon-red)' }}>12.4%</div>
            </div>
            <button 
              onClick={() => toggleWatchlist && toggleWatchlist(assetId)}
              style={{ 
                backgroundColor: actionColor, 
                color: '#000', 
                border: 'none', 
                padding: '16px 32px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
              <span>{actionIcon}</span> {actionText}
            </button>
          </div>
        </div>

        {/* Main Chart */}
        <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)', marginBottom: '32px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--neon-green)' }} />
              DEMAND_CANDLESTICK_HISTORY_V4
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['1H', '1D', '1W', '1M'].map(tf => (
                <span key={tf} style={{ padding: '4px 8px', border: tf === '1W' ? '1px solid var(--neon-green)' : '1px solid var(--border-ghost)', color: tf === '1W' ? 'var(--neon-green)' : 'var(--text-muted)', fontSize: '9px', cursor: 'pointer' }}>
                  {tf}
                </span>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none">
              <line x1="0" y1="125" x2="800" y2="125" stroke="var(--border-ghost)" strokeDasharray="4,4" />
              <path d="M 0,200 L 100,180 L 200,210 L 300,150 L 400,100 L 500,90 L 600,110 L 700,50 L 800,20" fill="none" stroke="var(--border-ghost)" strokeWidth="1" />
              <path d="M 300,150 L 400,100" fill="none" stroke="var(--neon-green)" strokeWidth="3" />
              {/* Highlight box */}
              <rect x="300" y="50" width="100" height="150" fill="none" stroke="var(--neon-green)" strokeWidth="1" />
            </svg>
            <div style={{ position: 'absolute', right: '0', top: '150px', backgroundColor: 'var(--neon-green)', color: '#000', fontSize: '9px', padding: '2px 6px', fontWeight: 'bold' }}>70.245 pts</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-ghost)', paddingTop: '8px', marginTop: '16px' }}>
            <span>00:00 UTC</span><span>04:00 UTC</span><span>08:00 UTC</span><span>12:00 UTC</span><span>16:00 UTC</span><span>20:00 UTC</span>
          </div>
        </div>

        {/* Bottom Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          
          <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-green)' }}>★</span> SALARY_CORRELATION
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>$132,450</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '48px' }}>MEDIAN_COMP_USD_LTM</div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>ENTRY_LVL</span><span>$84k</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--border-ghost)' }}><div style={{ width: '40%', height: '100%', backgroundColor: 'var(--text-muted)' }}/></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>EXPERT_LVL</span><span>$195k</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--border-ghost)' }}><div style={{ width: '85%', height: '100%', backgroundColor: 'var(--neon-green)' }}/></div>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-green)' }}>≡</span> INST_DEMAND_MATRIX
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { l: 'G', n: 'Google_Cloud', s: 'HIGH', c: 'var(--neon-green)' },
                { l: 'M', n: 'Meta_Platforms', s: 'MAX', c: 'var(--neon-cyan)' },
                { l: 'A', n: 'Anthropic_AI', s: 'PEAK', c: 'var(--neon-green)' },
                { l: 'O', n: 'OpenAI_Systems', s: 'CRITICAL', c: 'var(--neon-green)' },
              ].map(d => (
                <div key={d.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '24px', height: '24px', border: '1px solid var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{d.l}</div>
                    <span style={{ fontSize: '12px' }}>{d.n}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: d.c }}>{d.s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-cyan)' }}>⌘</span> RELATED_CLUSTER
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
              {['PyTorch', 'FastAPI', 'C++', 'CUDA', 'Transformers', 'Rust', 'Docker_ML'].map(t => (
                <span key={t} style={{ border: '1px solid var(--border-ghost)', padding: '6px 12px', fontSize: '10px', color: 'var(--text-muted)' }}>{t}</span>
              ))}
            </div>
            <div style={{ border: '1px solid var(--border-ghost)', padding: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>COHESION_SCORE</span>
              <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>88.4%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Right Sidebar Analysis */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ border: '1px solid var(--border-ghost)', padding: '32px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CLAUDE_ANALYSIS_V4.2</div>
            <div style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: 'var(--neon-green)', padding: '4px 8px', fontSize: '9px', border: '1px solid var(--neon-green)' }}>LIVE_SIGNAL</div>
          </div>
          
          <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '72px', color: 'var(--neon-green)', margin: '0 0 8px 0', lineHeight: 1 }}>BUY</h2>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '48px', letterSpacing: '0.05em' }}>RECOMMENDED_MARKET_STANCE</div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>PEAK_TIMING_SIGNAL</span><span style={{ color: 'var(--neon-green)' }}>94.2%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--border-ghost)' }}><div style={{ width: '94.2%', height: '100%', backgroundColor: 'var(--neon-green)' }}/></div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>SATURATION_RISK</span><span>12.8%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--border-ghost)' }}><div style={{ width: '12.8%', height: '100%', backgroundColor: 'var(--text-muted)' }}/></div>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-ghost)', padding: '32px', backgroundColor: 'var(--bg-surface-elevated)', flex: 1 }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#fff' }}>📄</span> STRUCTURAL_THESIS
          </div>
          
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            Python's consolidation above the 70.0 index mark confirms its status as the foundational layer for the current AI/ML supercycle.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            Demand velocity remains decoupled from generic engineering trends due to massive institutional re-tooling.
          </p>
          
          <div style={{ border: '1px dashed var(--neon-green)', padding: '16px', color: '#fff', fontSize: '12px', lineHeight: '1.6', marginBottom: '24px' }}>
            Expected upside: +12% over next fiscal quarter as LLM infra matures from R&D to production stages.
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Warning: Monitor saturation in entry-level segments.
          </p>
        </div>

        <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <span>ID_HASH:</span><span style={{ color: '#fff' }}>0x8F22A...BC12</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <span>LAST_REBALANCED:</span><span style={{ color: '#fff' }}>2024.05.22_12:00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <span>DATA_INTEGRITY:</span><span style={{ color: 'var(--neon-green)' }}>VERIFIED_BLOCK</span>
          </div>
        </div>

        <button style={{ border: '1px dashed var(--border-ghost)', backgroundColor: 'transparent', color: '#fff', padding: '16px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.1em' }}>
          GENERATE_FULL_DEEPDIVE_PDF
        </button>

      </div>

    </div>
  );
}
