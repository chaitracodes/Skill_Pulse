/**
 * LearningHubView.jsx
 * 
 * Dynamic AI-driven view that contrasts known skills vs required skills and provides weekly actionable roadmaps.
 */
import React, { useMemo } from 'react';

export default function LearningHubView({ jobRole, knownSkills = [], roadmap, completedCheckpoints = [], setCompletedCheckpoints }) {
  
  const matchedSkills = roadmap?.matched || knownSkills || [];
  const missingSkills = roadmap?.missing || [];
  
  const allCount = matchedSkills.length + missingSkills.length;
  // Fallbacks if backend doesn't resolve
  const finalMatched = matchedSkills.length > 0 ? matchedSkills : (allCount === 0 && jobRole ? ['Version Control', 'Agile Architecture'] : matchedSkills);
  const finalMissing = missingSkills.length > 0 ? missingSkills : (allCount === 0 && jobRole ? ['System Design', 'Cloud Deployment'] : missingSkills);

  // We combine them to create the sequential roadmap timeline
  // Let's alternate them or put missing first, then matched.
  const roadmapNodes = [
    ...finalMissing.map(skill => ({ skill, type: 'MISSING', label: 'ACQUIRE KNOWLEDGE' })),
    ...finalMatched.map(skill => ({ skill, type: 'MATCHED', label: 'REVISE & PERFECT' }))
  ];

  const totalRequired = roadmapNodes.length;
  // Check if everything specific to THIS roadmap is completed.
  const isComplete = totalRequired > 0 && roadmapNodes.every(node => completedCheckpoints.includes(node.skill));

  const handleToggle = (skill) => {
    if (completedCheckpoints.includes(skill)) {
      setCompletedCheckpoints(completedCheckpoints.filter(s => s !== skill));
    } else {
      setCompletedCheckpoints([...completedCheckpoints, skill]);
    }
  };

  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)', maxWidth: '1200px' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '64px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px' }}>NEURAL_PATHWAY // GENERATED</div>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '64px', margin: 0, textTransform: 'uppercase', textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          {jobRole || 'LEARNING ROADMAP'}
        </h1>
        <p style={{ marginTop: '16px', color: 'var(--neon-cyan)', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", maxWidth: '600px', margin: '16px auto 0', lineHeight: '1.6' }}>
          {roadmap?.recommendation || 'Follow this strictly optimized curriculum to align your theoretical knowledge with industry standard implementation.'}
        </p>
      </div>

      {/* ── ROADMAP TIMELINE ── */}
      <div style={{ position: 'relative', paddingLeft: '60px', marginBottom: '80px' }}>
        
        {/* The continuous background line */}
        <div style={{ position: 'absolute', left: '26px', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--border-ghost)' }} />

        {roadmapNodes.map((node, index) => {
          const isChecked = completedCheckpoints.includes(node.skill);
          // If the previous node is checked, the line leading up to this one glows. For index 0, it just glows if checked.
          const prevChecked = index === 0 ? true : completedCheckpoints.includes(roadmapNodes[index - 1].skill);
          
          const accentColor = node.type === 'MISSING' ? '#FF4444' : '#00D4FF'; // Red for acquire, Blue for revise
          const statusColor = isChecked ? '#00FF88' : 'var(--border-ghost)'; // Green if done

          return (
            <div key={index} style={{ position: 'relative', marginBottom: '64px' }}>
              
              {/* Glowing Line Segment (connecting from previous to current if previous is checked) */}
              {prevChecked && (
                <div style={{
                  position: 'absolute', left: '-34px', top: '-64px', bottom: 'calc(100% - 32px)', width: '2px',
                  backgroundColor: '#00FF88', boxShadow: '0 0 10px #00FF88', zIndex: 1
                }} />
              )}
              {/* Trail segment if current is checked (glow goes down) */}
              {isChecked && (
                <div style={{
                  position: 'absolute', left: '-34px', top: '32px', bottom: '-64px', width: '2px',
                  backgroundColor: '#00FF88', boxShadow: '0 0 10px #00FF88', zIndex: 1
                }} />
              )}

              {/* Timeline Node Dot */}
              <div style={{
                position: 'absolute', left: '-42px', top: '24px', width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: isChecked ? '#00FF88' : 'var(--bg-base)',
                border: `2px solid ${isChecked ? '#00FF88' : accentColor}`,
                boxShadow: isChecked ? '0 0 15px #00FF88' : `0 0 10px ${accentColor}40`,
                zIndex: 2, transition: 'all 0.4s ease'
              }} />

              {/* Content Card */}
              <div style={{
                backgroundColor: isChecked ? 'rgba(0, 255, 136, 0.03)' : 'var(--bg-surface)',
                border: `1px solid ${isChecked ? '#00FF88' : 'var(--border-ghost)'}`,
                transition: 'all 0.3s ease',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: isChecked ? '0 0 30px rgba(0, 255, 136, 0.05)' : 'none'
              }}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {/* Left: Multimedia Box */}
                  <div style={{ 
                    flex: '1 1 300px', minHeight: '200px', position: 'relative', 
                    background: `linear-gradient(135deg, #111, ${accentColor}20)`,
                    borderRight: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    
                    {/* Fake Play Button Overlay */}
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: `rgba(0,0,0,0.6)`, border: `1px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: '24px', cursor: 'pointer', zIndex: 2, backdropFilter: 'blur(4px)' }}>
                      ▶
                    </div>
                  </div>

                  {/* Right: Info Box */}
                  <div style={{ flex: '2 1 400px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '10px', color: accentColor, marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace", padding: '4px 8px', border: `1px solid ${accentColor}`, display: 'inline-block', alignSelf: 'flex-start' }}>
                      {node.label}
                    </div>
                    
                    <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', margin: '0 0 16px 0', color: isChecked ? '#00FF88' : '#FFF' }}>
                      {node.skill}
                    </h2>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', marginBottom: '32px' }}>
                      {node.type === 'MISSING' 
                        ? `You have a gap in this area. Master the core principles, syntax, and architectural patterns of ${node.skill} to align with industry requirements.` 
                        : `You have previous experience here. Review this rapid refresher to ensure your knowledge scales to enterprise-level architecture.`}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                       <a href={`https://www.youtube.com/results?search_query=${node.skill}`} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#FFF', textDecoration: 'none', borderBottom: '1px solid var(--text-muted)', paddingBottom: '2px', fontFamily: "'JetBrains Mono', monospace" }}>
                         VIEW COURSE →
                       </a>
                       <a href={`https://dev.to/search?q=${node.skill}`} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#FFF', textDecoration: 'none', borderBottom: '1px solid var(--text-muted)', paddingBottom: '2px', fontFamily: "'JetBrains Mono', monospace" }}>
                         READ DOCUMENTATION →
                       </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div style={{ backgroundColor: 'var(--bg-base)', borderTop: '1px solid var(--border-ghost)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    STATUS: {isChecked ? <span style={{color: '#00FF88'}}>VERIFIED</span> : <span style={{color: '#FF4444'}}>PENDING</span>}
                  </div>
                  <button 
                    onClick={() => handleToggle(node.skill)}
                    style={{
                      backgroundColor: isChecked ? 'transparent' : accentColor,
                      color: isChecked ? '#00FF88' : '#000',
                      border: isChecked ? '1px solid #00FF88' : 'none',
                      padding: '10px 24px',
                      fontSize: '11px', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace",
                      cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase'
                    }}
                  >
                    {isChecked ? '✓ KNOWLEDGE ACQUIRED' : 'MARK AS COMPLETE'}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ── PROJECT RECOMMENDATION (Unlocks on 100%) ── */}
      <div style={{ 
        opacity: isComplete ? 1 : 0.3, 
        pointerEvents: isComplete ? 'all' : 'none',
        transform: isComplete ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: 'var(--bg-surface-elevated)', border: `1px solid ${isComplete ? '#B026FF' : 'var(--border-ghost)'}`, padding: '48px', position: 'relative', overflow: 'hidden' 
      }}>
        {isComplete && <div style={{ position: 'absolute', right: '-40px', top: '-40px', opacity: 0.1, fontSize: '200px' }}>🚀</div>}
        <div style={{ fontSize: '10px', color: isComplete ? '#B026FF' : 'var(--text-muted)', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 'bold' }}>
          {isComplete ? 'ALL STAGES CLEARED // ACCESS GRANTED' : 'LOCKED // COMPLETE ROADMAP'}
        </div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '42px', marginBottom: '16px', color: isComplete ? '#FFF' : 'var(--text-muted)' }}>CAPSTONE PROJECT</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '600px', marginBottom: '32px' }}>
          Integrate everything you've learned. Build a massive portfolio piece demonstrating true industry readiness for <b>{jobRole || 'this role'}</b>.
        </p>
        
        {isComplete && (
          <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', color: '#B026FF', margin: '0 0 16px 0' }}>Scalable {jobRole || 'Application'} Architecture</h3>
            <ul style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '2.0', margin: 0, paddingLeft: '20px' }}>
              <li>Implement robust CI/CD pipelines and load balancing.</li>
              <li>Integrate <b>{roadmapNodes.map(n=>n.skill).slice(0, 3).join(', ')}</b> efficiently.</li>
              <li>Deploy using containerization strategies (Docker/Kubernetes).</li>
              <li>Write comprehensive integration tests covering 90% of business logic.</li>
            </ul>
            <div style={{ marginTop: '32px' }}>
              <button style={{ backgroundColor: '#B026FF', color: '#fff', border: 'none', padding: '16px 32px', fontSize: '12px', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', boxShadow: '0 0 20px rgba(176,38,255,0.4)' }}>
                INITIALIZE BUILD SEQUENCE →
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
