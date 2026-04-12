import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, ChevronRight, Check } from 'lucide-react';

export default function ProjectTrackerView({ projectData, isGenerating }) {
  if (isGenerating) {
    return (
      <div style={{ padding: '64px', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <div style={{ width: '48px', height: '48px', border: '2px solid #B026FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#B026FF', letterSpacing: '0.08em' }}>AI GENERATING CAPSTONE DEPLOYMENT TIMELINE...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div style={{ padding: '64px', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
        <div style={{ fontSize: '12px', color: '#FF4444', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 'bold', letterSpacing: '2px' }}>
          ACCESS_DENIED // PROTOCOL_LOCKED
        </div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', margin: '0 0 16px 0', color: '#FFF' }}>
          CAPSTONE PROJECT RESTRICTED
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', lineHeight: '1.6' }}>
          Complete your Learning Path and acquire all missing skills in the Learning Hub to gain access to the project builder.
        </p>
      </div>
    );
  }

  const { project_name, description, timeline } = projectData;

  const [completedDays, setCompletedDays] = useState([]);
  const [activeTip, setActiveTip] = useState(null);

  const toggleDay = (day) => {
    setCompletedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <div style={{ padding: '64px', minHeight: 'calc(100vh - 60px)', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <div style={{ marginBottom: '64px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: '#B026FF', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px' }}>CAPSTONE // DEPLOYMENT_PHASE</div>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '48px', margin: 0, textTransform: 'uppercase', color: '#FFF' }}>
          {project_name || 'PROJECT_ALPHA'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px', maxWidth: '600px', margin: '16px auto 0' }}>
          {description || 'Comprehensive deployment guide.'}
        </p>
      </div>

      <div style={{ position: 'relative', paddingLeft: '40px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '0px', bottom: '0px', width: '2px', backgroundColor: 'var(--border-ghost)' }} />

        {timeline?.map((node, index) => {
          const isCompleted = completedDays.includes(node.day);
          const isNext = !isCompleted && (index === 0 || completedDays.includes(timeline[index - 1].day));

          return (
            <div key={node.day} style={{ position: 'relative', marginBottom: '48px', opacity: (isCompleted || isNext) ? 1 : 0.4 }}>
              
              <div style={{
                position: 'absolute', left: '-33px', top: '24px', width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: isCompleted ? '#B026FF' : 'var(--bg-base)', border: `2px solid ${isCompleted || isNext ? '#B026FF' : 'var(--border-ghost)'}`,
                boxShadow: isCompleted ? '0 0 15px #B026FF' : 'none', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isCompleted && <Check size={10} color="#FFF" />}
              </div>

              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)', border: `1px solid ${isCompleted ? '#B026FF' : 'var(--border-ghost)'}`,
                padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#B026FF', fontFamily: "'JetBrains Mono', monospace", border: '1px solid #B026FF', padding: '6px 12px' }}>
                      {node.day.toUpperCase()}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '24px', color: '#FFF', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>{node.title}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveTip(activeTip === node.day ? null : node.day)}
                    style={{ background: activeTip === node.day ? 'var(--bg-base)' : 'var(--border-ghost)', border: '1px solid var(--border-ghost)', borderRadius: '50%', width: '40px', height: '40px', color: activeTip === node.day ? '#FFE600' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    title="Implemention Tips"
                  >
                    <Lightbulb size={20} />
                  </button>
                </div>
                
                <p style={{ color: 'var(--text-main)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{node.task}</p>

                {activeTip === node.day && (
                  <div style={{ backgroundColor: 'rgba(176,38,255,0.05)', borderLeft: '3px solid #FFE600', padding: '24px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                       <Lightbulb size={16} color="#FFE600" />
                       <span style={{ fontSize: '11px', color: '#FFE600', fontFamily: "'JetBrains Mono', monospace", fontWeight: 'bold' }}>AI IMPLEMENTATION TIP</span>
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{node.tip}</p>
                  </div>
                )}

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                  <button onClick={() => toggleDay(node.day)} style={{ background: isCompleted ? 'transparent' : '#B026FF', color: isCompleted ? '#B026FF' : '#FFF', border: isCompleted ? '1px solid #B026FF' : 'none', padding: '12px 28px', fontSize: '11px', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase' }}>
                    {isCompleted ? '✓ STAGE VERIFIED' : 'MARK STAGE COMPLETE'}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
