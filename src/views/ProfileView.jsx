import React from 'react';

export default function ProfileView({ jobRole, knownSkills, roadmap }) {
  
  const matched = roadmap?.matched || knownSkills || [];
  const missing = roadmap?.missing || [];
  const timeline = roadmap?.roadmap || [];

  return (
    <div style={{ marginLeft: '80px', padding: '48px 64px', minHeight: 'calc(100vh - 60px)', maxWidth: '1100px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>USER_NODE // LEARNING_HUB</div>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '56px', margin: 0, textTransform: 'uppercase' }}>
          {jobRole || 'LEARNING HUB'}
        </h1>
        {roadmap?.recommendation && (
          <p style={{ marginTop: '16px', color: 'var(--neon-cyan)', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", borderLeft: '2px solid var(--neon-cyan)', paddingLeft: '16px', lineHeight: '1.6' }}>
            {roadmap.recommendation}
          </p>
        )}
      </div>

      {/* ── What You Already Know (Video Revision UI) ── */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', borderLeft: '2px solid #00FF88', paddingLeft: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
          SKILL_REVISION // MAINTAIN YOUR EDGE
        </div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '28px', marginBottom: '24px' }}>WHAT YOU ALREADY KNOW</h2>
        
        {matched.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>No matching prior skills identified.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {matched.map((skill, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-ghost)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#00FF88'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-ghost)'}>
                <div style={{ height: '140px', backgroundColor: '#1A1A1A', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at 2px 2px, #00FF88 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid #00FF88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FF88' }}>
                    ▶
                  </div>
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '2px 6px', fontSize: '10px', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
                    {Math.floor(Math.random() * 8) + 4}:{Math.floor(Math.random() * 50) + 10}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '9px', color: '#00FF88', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>RAPID REFRESHER</div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>Advanced {skill} Interview Concepts</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Keep your {skill} knowledge sharp. Review highly-tested topics.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── What You Need To Learn (Missing Skills Overview) ── */}
      <section style={{ marginBottom: '64px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-ghost)', padding: '40px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', borderLeft: '2px solid #00D4FF', paddingLeft: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
          SKILL_GAP_ANALYSIS // TARGET ACQUISITION
        </div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '28px', marginBottom: '24px' }}>WHAT YOU NEED TO LEARN</h2>
        
        {missing.length === 0 ? (
          <div style={{ color: 'var(--neon-green)', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace" }}>You are 100% theoretically matched for this role!</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {missing.map(skill => (
              <span key={skill} style={{ backgroundColor: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF', padding: '10px 20px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Learning Roadmap ── */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', borderLeft: '2px solid #B026FF', paddingLeft: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
          LEARNING_ROADMAP // WEEK_BY_WEEK
        </div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '28px', marginBottom: '40px' }}>YOUR PREPARATION TIMELINE</h2>

        {timeline.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
            Start the onboarding flow to generate your AI-crafted learning roadmap.
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '16px', width: '1px', backgroundColor: 'var(--border-ghost)' }} />

            {timeline.map((w, i) => {
              const isActive = i === 0;
              const isUpcoming = i > 0;
              
              return (
                <div key={i} style={{ position: 'relative', marginBottom: '36px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  {/* Node dot */}
                  <div style={{
                    position: 'absolute', left: '-28px', top: '4px',
                    width: '14px', height: '14px', borderRadius: '50%',
                    backgroundColor: isActive ? '#B026FF' : 'var(--bg-surface-elevated)',
                    border: isActive ? '2px solid #B026FF' : '2px solid var(--border-ghost)',
                    boxShadow: isActive ? '0 0 10px rgba(176,38,255,0.5)' : 'none',
                  }} />

                  <div style={{ flex: 1, backgroundColor: isActive ? 'rgba(176,38,255,0.05)' : 'var(--bg-surface)', border: `1px solid ${isActive ? '#B026FF' : 'var(--border-ghost)'}`, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>WEEK {w.week}</span>
                        <h3 style={{ fontSize: '18px', margin: '4px 0 0', color: isActive ? '#B026FF' : 'var(--text-muted)' }}>{w.topic}</h3>
                      </div>
                      <span style={{
                        fontSize: '9px', padding: '4px 10px',
                        backgroundColor: isActive ? 'rgba(176,38,255,0.1)' : 'var(--bg-base)',
                        color: isActive ? '#B026FF' : 'var(--text-muted)',
                        border: `1px solid ${isActive ? '#B026FF' : 'var(--border-ghost)'}`,
                        fontFamily: "'JetBrains Mono', monospace"
                      }}>
                        {isActive ? 'ACTIVE' : 'UPCOMING'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>{w.task}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
