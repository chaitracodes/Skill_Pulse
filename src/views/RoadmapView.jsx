import React from 'react';
import { CheckCircle, MoreHorizontal, Lock, Gift } from 'lucide-react';

export default function RoadmapView() {
  const nodes = [
    {
      id: '01',
      title: '01_ELIGIBILITY_PROTOCOL',
      status: 'completed',
      date: '2023.10.12 // Hash: 0x8842...FF01',
      details: [
        { label: 'YEARS_EXP', value: '05+' },
        { label: 'CORE_SKILLS', value: '08/08' },
        { label: 'RECORDS', value: 'CLEAR' },
      ]
    },
    {
      id: '02',
      title: '02_APPLICATION_INTERFACE',
      status: 'in_progress',
      desc: 'Uploading neural skill-assets and project documentation for peer review.',
      progress: 68
    },
    {
      id: '03',
      title: '03_APPROVAL_QUORUM',
      status: 'locked',
      desc: 'PENDING COMPLETION OF NODE 02'
    },
    {
      id: '04',
      title: '04_BENEFITS_EXTRACTION',
      status: 'locked',
      desc: 'REWARD DISTRIBUTION PROTOCOL'
    }
  ];

  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
        <div>
          <div style={{ color: 'var(--neon-green)', fontSize: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--neon-green)' }} />
            LIVE_SCHEME: SYSTEM_ARCHITECT_LVL_4
          </div>
          <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '64px', margin: '0 0 16px 0', lineHeight: 1 }}>ROADMAP.EXE</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '400px', lineHeight: '1.6' }}>
            Sequence initiated. Follow the nodes to finalize career accreditation. System verification required at each junction.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '8px' }}>GLOBAL_PROGRESS</div>
          <div style={{ color: 'var(--neon-cyan)', fontSize: '48px', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>42.8%</div>
        </div>
      </div>

      <div style={{ paddingLeft: '32px', position: 'relative' }}>
        {/* Vertical Line */}
        <div style={{ position: 'absolute', left: '63px', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--border-ghost)', zIndex: 0 }} />

        {nodes.map((node, i) => {
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in_progress';
          const isLocked = node.status === 'locked';

          const iconColor = isCompleted ? 'var(--neon-green)' : isInProgress ? 'var(--neon-cyan)' : 'var(--border-ghost)';
          
          return (
            <div key={node.id} style={{ display: 'flex', gap: '48px', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
              
              {/* Timeline Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '64px' }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-base)',
                  border: `2px solid ${iconColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  {isCompleted && <CheckCircle size={24} color={iconColor} />}
                  {isInProgress && <MoreHorizontal size={24} color={iconColor} />}
                  {isLocked && i === 2 && <Lock size={24} color={iconColor} />}
                  {isLocked && i === 3 && <Gift size={24} color={iconColor} />}
                </div>
                <span style={{ color: iconColor, fontSize: '9px', fontWeight: 'bold' }}>{node.status.toUpperCase()}</span>
              </div>

              {/* Node Content */}
              <div style={{ flex: 1, maxWidth: '800px', border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface)', padding: '32px', opacity: isLocked ? 0.3 : 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '20px', color: '#fff', letterSpacing: '0.05em' }}>{node.title}</h2>
                  {isCompleted && (
                    <div style={{ border: '1px solid var(--neon-green)', color: 'var(--neon-green)', fontSize: '10px', padding: '4px 12px' }}>100% PASS</div>
                  )}
                  {isInProgress && (
                    <div style={{ backgroundColor: 'var(--neon-cyan)', color: '#000', fontSize: '10px', padding: '4px 12px', fontWeight: 'bold' }}>ACTIVE_NODE</div>
                  )}
                </div>

                {isCompleted && (
                  <>
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontStyle: 'italic', marginBottom: '32px' }}>Verified {node.date}</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {node.details.map(d => (
                        <div key={d.label} style={{ flex: 1, backgroundColor: 'var(--bg-surface-elevated)', padding: '16px' }}>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '16px' }}>{d.label}</div>
                          <div style={{ fontSize: '20px' }}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {isInProgress && (
                  <>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '40px' }}>{node.desc}</p>
                    <div style={{ height: '4px', backgroundColor: 'var(--bg-surface-elevated)', marginBottom: '32px' }}>
                      <div style={{ height: '100%', width: `${node.progress}%`, backgroundColor: 'var(--neon-cyan)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--neon-cyan)' }}>✓ DOCS_UPLOADED</span>
                        <span>○ PEER_VALIDATION</span>
                      </div>
                      <button style={{ backgroundColor: 'var(--neon-cyan)', color: '#000', padding: '12px 24px', border: 'none', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>
                        RESUME_SUBMISSION
                      </button>
                    </div>
                  </>
                )}

                {isLocked && (
                  <p style={{ color: 'var(--border-ghost)', fontSize: '12px', marginTop: '16px' }}>{node.desc}</p>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
