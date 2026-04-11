import React from 'react';

export default function NewsView() {
  const news = [
    { source: 'SYSTEM_REUTERS', time: '14:02:55 UTC', tag: 'BULLISH', title: 'RUST DEMAND SURGES 40% IN FINTECH SECTOR AS MEMORY SAFETY MANDATES BECOME GLOBAL STANDARD', labels: ['RUST', 'SECURITY', 'FINTECH'] },
    { source: 'CORE_SIGNAL', time: '13:44:12 UTC', tag: 'BEARISH', title: 'LEGACY COBOL INFRASTRUCTURE MAINTENANCE COSTS HIT RECORD HIGH AMIDST RECRUITMENT VOID', labels: ['COBOL', 'MAINFRAME', 'LEGACY'] },
    { source: 'AI_HARVESTER', time: '12:20:01 UTC', tag: 'NEUTRAL', title: 'SWIFT 6 RELEASE INTRODUCES DATA-RACE SAFETY FEATURES; iOS ECOSYSTEM PREPARES FOR MIGRATION', labels: ['SWIFT', 'CONCURRENCY', 'MOBILE'] },
    { source: 'MARKET_PULSE', time: '11:05:33 UTC', tag: 'BULLISH', title: 'MACHINE LEARNING OPS (MLOPS) SALARY PACKAGES REACH ALL-TIME HIGH FOR SENIOR ARCHITECTS', labels: ['ML', 'INFRASTRUCTURE', 'DATA'] },
  ];

  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)', display: 'flex', gap: '64px' }}>
      
      {/* Left Column: News Feed */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '64px', margin: '0 0 8px 0', lineHeight: 1 }}>MARKET_INTELLIGENCE</h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '64px' }}>LATEST_TRANSMISSIONS_RECEIVED_REAL_TIME</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {news.map(item => {
            const isBull = item.tag === 'BULLISH';
            const isBear = item.tag === 'BEARISH';
            const tagColor = isBull ? 'var(--neon-green)' : isBear ? 'var(--neon-red)' : 'var(--neon-cyan)';

            return (
              <div key={item.title} style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'rgba(10, 10, 10, 0.8)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '9px', color: 'var(--text-muted)' }}>
                    <span>{item.source}</span>
                    <span>{item.time}</span>
                  </div>
                  <div style={{ border: `1px solid ${tagColor}`, color: tagColor, fontSize: '9px', padding: '4px 8px' }}>
                    {item.tag}
                  </div>
                </div>
                
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.4', marginBottom: '24px' }}>
                  {item.title}
                </h2>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {item.labels.map(l => (
                    <span key={l} style={{ border: '1px solid var(--border-ghost)', color: 'var(--text-muted)', fontSize: '9px', padding: '4px 8px' }}>{l}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Analytics Sidebar */}
      <div style={{ width: '380px' }}>
        
        <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface-elevated)', padding: '32px', marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px' }}>SENTIMENT_ANALYSIS</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', color: 'var(--neon-green)', fontWeight: 'bold' }}>BULLISH</div>
            <div style={{ fontSize: '24px' }}>74%</div>
          </div>
          
          <div style={{ height: '4px', backgroundColor: 'var(--border-ghost)', marginBottom: '48px' }}>
            <div style={{ height: '100%', width: '74%', backgroundColor: 'var(--neon-green)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
            <div style={{ borderRight: '1px solid var(--border-ghost)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>FEAR</div>
              <div style={{ fontSize: '16px' }}>12</div>
            </div>
            <div style={{ borderRight: '1px solid var(--border-ghost)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>NEUTRAL</div>
              <div style={{ fontSize: '16px' }}>14</div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>GREED</div>
              <div style={{ fontSize: '16px' }}>74</div>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface-elevated)', padding: '32px', marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px' }}>VOLATILITY_HEATMAP</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {/* Generate random-looking heat blocks matching the image */}
            {Array.from({length: 21}).map((_, i) => {
              const bg = [
                'var(--border-ghost)', 'var(--bg-base)', 'rgba(0, 255, 136, 0.2)', 
                'rgba(255, 51, 102, 0.2)', 'var(--neon-green)', 'rgba(255, 51, 102, 0.5)'
              ][Math.floor(Math.random() * 6)];
              return <div key={i} style={{ aspectRatio: '1/1', backgroundColor: bg }} />
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)' }}>
            <span>LOW_VOLATILITY</span>
            <span>EXTREME_VOLATILITY</span>
          </div>
        </div>

      </div>

    </div>
  );
}
