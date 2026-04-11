import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function ProfileView({ knownSkills = [], completedCheckpoints = [] }) {
  
  // Create a stunning aggregate Spider Web (Radar Chart) looking at ALL skills tracked.
  const chartData = useMemo(() => {
    // We want a solid multi-point star to make the UI look complex and advanced.
    const baselineAxes = ['System Architecture', 'Logic Patterning', 'Performance Tuning', 'Security Protocols', 'Data Structures'];
    
    // Add dynamic skills from user tracking
    const dynamicSkills = [...new Set([...knownSkills, ...completedCheckpoints])].slice(0, 5); // Take top 5
    
    const combinedAxes = [...baselineAxes, ...dynamicSkills];

    return combinedAxes.map(skill => {
      // Base level mapping
      let acquiredScore = 15; // baseline noise
      let knownScore = 15;

      if (completedCheckpoints.includes(skill)) {
        acquiredScore = 100;
        knownScore = 100;
      } else if (knownSkills.includes(skill)) {
        knownScore = 80;
        acquiredScore = 30; // Not actively trained here, but known
      }

      // If it's a baseline axis, give it some progress based on overall app usage.
      if (baselineAxes.includes(skill)) {
         const overallProgress = completedCheckpoints.length * 10; 
         acquiredScore = Math.min(100, acquiredScore + overallProgress);
         knownScore = Math.min(100, knownScore + overallProgress + 20);
      }

      return {
        subject: skill,
        Acquired: acquiredScore,
        Baseline: knownScore,
        fullMark: 100,
      };
    });
  }, [knownSkills, completedCheckpoints]);

  const totalPoints = knownSkills.length + completedCheckpoints.length;
  // Let's invent a "Neural Capacity Level" metric
  const neuralLevel = Math.floor(Math.sqrt(totalPoints * 10)) + 1;

  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)', maxWidth: '1200px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px' }}>GLOBAL_TRACKING // OVERALL_SYNTHESIS</div>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '64px', margin: 0, textTransform: 'uppercase', textShadow: '0 0 30px rgba(176,38,255,0.4)' }}>
          NEURAL PROFILE
        </h1>
        <p style={{ marginTop: '16px', color: '#B026FF', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", borderLeft: '2px solid #B026FF', paddingLeft: '16px', lineHeight: '1.6', maxWidth: '600px' }}>
          This visualizer amalgamates all theoretical and functional checkpoints across your entire journey, forming your absolute capability fingerprint.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 1fr) 400px', gap: '64px' }}>
        
        {/* ── LEFT: Chart Area ── */}
        <section style={{ 
          backgroundColor: 'var(--bg-surface-elevated)', 
          border: '1px solid var(--border-ghost)', 
          padding: '48px', 
          position: 'relative',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
        }}>
          {/* Cyberpunk framing elements */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid #00D4FF', borderLeft: '2px solid #00D4FF' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid #00D4FF', borderRight: '2px solid #00D4FF' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid #00D4FF', borderLeft: '2px solid #00D4FF' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid #00D4FF', borderRight: '2px solid #00D4FF' }} />

          <div style={{ position: 'absolute', top: '32px', left: '32px' }}>
             <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '24px', margin: 0, color: '#FFF' }}>CAPABILITY MATRIX</h2>
          </div>

          <div style={{ height: '500px', marginTop: '48px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid stroke="#333" strokeDasharray="3 3" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#A0A0A0', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} 
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid #B026FF', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#FFF' }}
                   itemStyle={{ color: '#00D4FF' }}
                />
                
                {/* Background Shadow Radar (Baseline / Known) */}
                <Radar 
                  name="Foundational" 
                  dataKey="Baseline" 
                  stroke="#555" 
                  strokeWidth={1}
                  fill="#555" 
                  fillOpacity={0.1} 
                  isAnimationActive={true}
                />
                
                {/* Foreground Neon Radar (Acquired / Mastery) */}
                <Radar 
                  name="Mastery Sync" 
                  dataKey="Acquired" 
                  stroke="#00FF88" 
                  strokeWidth={3}
                  fill="url(#neonGradient)" 
                  fillOpacity={0.4} 
                  isAnimationActive={true}
                />
                
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>

              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── RIGHT: Stats Area ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Level Info */}
          <div style={{ backgroundColor: 'rgba(0, 212, 255, 0.05)', border: '1px solid #00D4FF', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -40, bottom: -40, fontSize: '150px', opacity: 0.05 }}>🧠</div>
            <div style={{ fontSize: '10px', color: '#00D4FF', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace" }}>NEURAL LEVEL CAPACITY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', color: '#FFF' }}>
              <span style={{ fontSize: '72px', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", color: '#00D4FF', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
                LVL {neuralLevel}
              </span>
            </div>
          </div>

          {/* Aggregated Skills Log */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-ghost)', padding: '32px', flex: 1 }}>
             <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', fontFamily: "'JetBrains Mono', monospace" }}>GLOBAL_SKILLS_LOG (ACQUIRED)</div>
             
             {completedCheckpoints.length === 0 ? (
               <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6' }}>
                 Your global registry is empty.<br/>
                 Engage with job pathways in the Learning Hub to populate your matrix.
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {[...new Set(completedCheckpoints)].map(cp => (
                   <div key={cp} style={{ 
                     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                     borderBottom: '1px solid var(--border-ghost)', paddingBottom: '12px' 
                   }}>
                     <span style={{ fontSize: '14px', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", color: '#FFF' }}>{cp}</span>
                     <span style={{ fontSize: '9px', padding: '4px 8px', backgroundColor: 'rgba(0,255,136,0.1)', color: '#00FF88', border: '1px solid #00FF88', fontFamily: "'JetBrains Mono', monospace" }}>
                       VERIFIED
                     </span>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </section>

      </div>
    </div>
  );
}
