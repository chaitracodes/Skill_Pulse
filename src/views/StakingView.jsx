/**
 * StakingView.jsx
 * 
 * Gamification view simulating career 'staking' or investing in future learning paths.
 */
import React from 'react';

export default function StakingView() {
  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)', display: 'flex', gap: '32px' }}>
      
      {/* Left fixed block (SOVEREIGN Architect Level 4) mapping handled by Sidebar natively vs Page-level sidebar */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '72px', margin: '0 0 16px 0', lineHeight: 1 }}>STAKING_TERMINAL</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--neon-green)', fontSize: '10px', marginBottom: '48px', borderBottom: '1px solid var(--border-ghost)', paddingBottom: '16px' }}>
          <span>PROTOCOL VERSION 2.0.4-STABLE // ASSET_ALLOCATION_MODE: HIGH_YIELD</span>
          <span>SYNCED_AND_OPERATIONAL</span>
        </div>

        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr)', gap: '24px', marginBottom: '32px' }}>
          
          <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>TOTAL VALUE STAKED</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>1.2M</span>
              <span style={{ color: 'var(--neon-green)', fontSize: '12px', fontWeight: 'bold' }}>CRED</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--neon-green)' }}>+12.4% THIS MONTH</div>
          </div>

          <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>AVERAGE APY</div>
            <div style={{ fontSize: '32px', color: 'var(--neon-cyan)', fontWeight: 'bold', marginBottom: '16px' }}>14.82%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OPTIMIZED BY SOVEREIGN_AI</div>
          </div>

          <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>ACTIVE NODES</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>2,481</div>
            <div style={{ fontSize: '10px', color: 'var(--neon-green)' }}>✓ GLOBAL_CONSENSUS_HEALTH: 100%</div>
          </div>

        </div>

        {/* Main Columns Grid */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          
          {/* Chart */}
          <div style={{ flex: 1, border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px' }}>CREDIBILITY YIELD OVER TIME</h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '9px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--neon-green)' }}>1D</span><span>1W</span><span>1M</span><span>1Y</span><span>ALL</span>
              </div>
            </div>
            <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
              <path d="M 0,150 L 100,140 L 200,145 L 300,120 L 400,130 L 500,100 L 600,90 L 600,200 L 0,200 Z" fill="rgba(0, 255, 136, 0.05)" />
              <path d="M 0,150 L 100,140 L 200,145 L 300,120 L 400,130 L 500,100 L 600,90" fill="none" stroke="var(--neon-green)" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
            </div>
          </div>

          {/* Positions */}
          <div style={{ width: '300px', border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '24px' }}>YOUR POSITIONS</h2>
            
            <div style={{ border: '1px solid var(--border-ghost)', padding: '16px', marginBottom: '16px', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>RUST_POOL_v4</span>
                <span style={{ fontSize: '9px', color: 'var(--neon-green)' }}>ACTIVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Staked</span><span>45,000 CRED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>Unclaimed</span><span style={{ color: 'var(--neon-green)' }}>+842.12 CRED</span>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-ghost)', padding: '16px', marginBottom: '24px', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>PYTHON_DATA_VIZ</span>
                <span style={{ fontSize: '9px', color: 'var(--neon-cyan)' }}>ACTIVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Staked</span><span>12,500 CRED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>Unclaimed</span><span style={{ color: 'var(--neon-cyan)' }}>+115.04 CRED</span>
              </div>
            </div>

            <div style={{ flex: 1 }} />
            <button style={{ width: '100%', backgroundColor: '#fff', color: '#000', padding: '16px', border: 'none', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
              CLAIM ALL REWARDS
            </button>
          </div>
        </div>

        {/* Skill Staking Pools */}
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', marginBottom: '24px' }}>SKILL_STAKING_POOLS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginBottom: '32px' }}>
          
          {[
            { tag: 'RUST', yield: '12.4%', color: 'var(--neon-green)', staked: '450K', bg: 'linear-gradient(to top, var(--bg-surface-elevated), #ff6a0033)' },
            { tag: 'PYTHON', yield: '8.2%', color: 'var(--neon-cyan)', staked: '820K', bg: 'linear-gradient(to top, var(--bg-surface-elevated), #3776ab33)' },
            { tag: 'SOLIDITY', yield: '18.1%', color: 'var(--neon-green)', staked: '125K', bg: 'linear-gradient(to top, var(--bg-surface-elevated), #62688f33)' },
          ].map(pool => (
            <div key={pool.tag} style={{ border: '1px solid var(--border-ghost)', background: pool.bg, padding: '24px', display: 'flex', flexDirection: 'column', height: '240px', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{pool.tag}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', zIndex: 1 }}>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>YIELD</div>
                  <div style={{ fontSize: '18px', color: pool.color, fontWeight: 'bold' }}>{pool.yield} <span style={{ fontSize: '9px' }}>CRED</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>TOTAL STAKED</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{pool.staked} <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CRED</span></div>
                </div>
              </div>
              <button style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid var(--border-ghost)', color: '#fff', padding: '12px', fontSize: '10px', cursor: 'pointer', zIndex: 1 }}>
                STAKE ASSETS
              </button>
            </div>
          ))}

        </div>

        {/* Recent Activity */}
        <div style={{ border: '1px solid var(--border-ghost)', padding: '24px', backgroundColor: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px' }}>RECENT ACTIVITY</h2>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>AUTO-REFRESH: ENABLED</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { time: '14:22:01', action: 'STAKE_INITIATED', actionColor: 'var(--neon-green)', desc: '45,000 CRED -> RUST_POOL_v4', hash: 'TX_ID: 0x8a2f...39bc' },
              { time: '12:15:48', action: 'REWARD_CLAIMED', actionColor: 'var(--neon-cyan)', desc: '842.12 CRED from RUST_POOL_v4', hash: 'TX_ID: 0x4d1e...91aa' },
              { time: '09:30:12', action: 'STAKE_INITIATED', actionColor: 'var(--neon-green)', desc: '12,500 CRED -> PYTHON_DATA_VIZ', hash: 'TX_ID: 0x22c9...10fc' },
              { time: '08:00:00', action: 'EPOCH_SETTLED', actionColor: '#FFB95F', desc: 'Global Consensus Finalized', hash: 'TX_ID: 0x55ff...21cc' },
            ].map(tx => (
              <div key={tx.time} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', borderBottom: '1px solid var(--border-ghost)', paddingBottom: '16px' }}>
                <span style={{ color: 'var(--text-muted)', width: '80px' }}>{tx.time}</span>
                <span style={{ color: tx.actionColor, width: '120px', fontWeight: 'bold' }}>{tx.action}</span>
                <span style={{ flex: 1 }}>{tx.desc}</span>
                <span style={{ color: 'var(--text-muted)' }}>{tx.hash}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
