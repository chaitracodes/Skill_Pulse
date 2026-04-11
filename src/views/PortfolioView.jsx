import React from 'react';

export default function PortfolioView() {
  return (
    <div style={{ marginLeft: '80px', padding: '64px', position: 'relative', minHeight: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      
      {/* Background massive text */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '-20px',
        fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
        fontSize: '200px',
        color: 'var(--border-ghost)',
        whiteSpace: 'nowrap',
        zIndex: 0,
        pointerEvents: 'none',
        lineHeight: 1
      }}>
        ADVANCED_ALGORITHMIC
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
        
        {/* Top Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px' }}>
          <div style={{ flex: 1, paddingRight: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '2px 6px', backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--neon-green)', border: '1px solid var(--neon-green)' }}>ACTIVE_NODE: 01</div>
              EDUCATION_STREAM
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '600px', marginTop: '120px' }}>
              Master the architecture of high-frequency liquidity pools and neural network integration for predictive market execution. High density training module for sovereign architects.
            </p>
          </div>
          
          {/* Progress Box */}
          <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', padding: '24px', width: '320px', marginTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '9px' }}>
              <span style={{ color: 'var(--text-muted)' }}>COMPLETION_INDEX</span>
              <span style={{ color: 'var(--neon-green)' }}>64.8%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-base)', marginBottom: '24px' }}>
              <div style={{ width: '64.8%', height: '100%', backgroundColor: 'var(--neon-green)' }} />
            </div>
            <button style={{ width: '100%', backgroundColor: 'var(--neon-green)', color: '#000', border: 'none', padding: '16px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              RESUME_MODULE
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          
          {/* Left Column */}
          <div>
            <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'rgba(10, 10, 10, 0.8)', padding: '32px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '8px' }}>CATEGORY_01</div>
                  <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px' }}>FUNDAMENTALS</h2>
                </div>
                <div style={{ border: '1px solid var(--border-ghost)', padding: '8px 16px', fontSize: '10px', color: 'var(--text-muted)', height: 'fit-content' }}>
                  04 LESSONS
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { id: '01', title: 'Liquidity Pool Mechanics', time: '18:45 MIN', tag: 'BEGINNER', state: 'done' },
                  { id: '02', title: 'Protocol Governance Standards', time: '24:10 MIN', tag: 'BEGINNER', state: 'done' },
                  { id: '03', title: 'Smart Contract Debugging (WASM)', time: '45:20 MIN', tag: 'INTERMEDIATE', state: 'active' },
                ].map(lesson => (
                  <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-elevated)', border: lesson.state === 'active' ? '1px solid var(--neon-green)' : '1px solid var(--border-ghost)', padding: '16px 24px' }}>
                    <div style={{ color: lesson.state === 'active' ? 'var(--neon-cyan)' : 'var(--neon-green)', fontSize: '10px', marginRight: '24px' }}>{lesson.id}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', marginBottom: '4px', color: lesson.state === 'done' ? 'var(--text-muted)' : '#fff' }}>{lesson.title}</div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '9px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{lesson.time}</span>
                        <span style={{ color: lesson.state === 'done' ? 'var(--neon-green)' : 'var(--text-muted)' }}>{lesson.tag}</span>
                      </div>
                    </div>
                    {lesson.state === 'done' ? (
                      <div style={{ color: 'var(--border-ghost)' }}>✓</div>
                    ) : (
                      <button style={{ backgroundColor: 'var(--neon-green)', color: '#000', border: 'none', padding: '8px 16px', fontSize: '9px', fontWeight: 'bold' }}>START</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface)', padding: '32px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '8px' }}>CATEGORY_03</div>
              <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', marginBottom: '24px' }}>SPECIALIZED</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {[
                  { title: 'MEV_EXTRACT_LOGIC', tag: 'EXPERT_LEVEL' },
                  { title: 'CROSS_CHAIN_ROUTING', tag: 'INTERMEDIATE' },
                ].map(lesson => (
                  <div key={lesson.title} style={{ border: '1px solid var(--border-ghost)', padding: '16px 24px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>{lesson.title}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{lesson.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'rgba(10, 10, 10, 0.8)', padding: '32px', marginBottom: '32px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '8px' }}>CATEGORY_02</div>
              <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', marginBottom: '16px' }}>ADVANCED</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.6', marginBottom: '32px' }}>
                Neural network modeling for arbitrage detection and low-latency execution protocols.
              </p>
              
              <div style={{ border: '1px solid var(--border-ghost)', height: '120px', marginBottom: '16px', backgroundColor: 'var(--bg-base)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,255,136,0.1), transparent)' }} />
                <svg width="100%" height="100%" preserveAspectRatio="none">
                  <path d="M0,100 L0,80 L40,90 L80,50 L120,60 L160,40 L200,60 L240,40 L280,70 L320,50 L320,100 Z" fill="none" stroke="var(--neon-green)" strokeWidth="2" />
                </svg>
              </div>

              <button style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-ghost)', padding: '16px', fontSize: '10px' }}>
                UNLOCK_MODULE_02
              </button>
            </div>

            <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface)', padding: '32px' }}>
              <div style={{ color: 'var(--neon-cyan)', fontSize: '9px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--neon-cyan)' }} />
                LIVE_SEMINAR: NEXT GEN SCALING
              </div>
              <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', lineHeight: '1', marginBottom: '32px' }}>ARCHITECTING THE PARALLEL EXECUTION LAYER</h2>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ flex: 1, backgroundColor: 'var(--neon-cyan)', color: '#000', border: 'none', padding: '12px', fontSize: '10px', fontWeight: 'bold' }}>JOIN_ROOM</button>
                <button style={{ flex: 1, backgroundColor: 'transparent', color: '#fff', border: '1px solid var(--border-ghost)', padding: '12px', fontSize: '10px' }}>RESOURCES</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
