import React from 'react';

export default function LandingView({ onNavigate }) {
  return (
    <div style={{ padding: '64px', maxWidth: '1200px', margin: '0 auto', marginLeft: '80px', paddingTop: '100px' }}>
      
      {/* Hero Section */}
      <div style={{ display: 'flex', gap: '64px', marginBottom: '80px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(0, 255, 136, 0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', padding: '4px 12px', fontSize: '10px', marginBottom: '32px' }}>
            ASSET: TKN_5420_0_842
          </div>
          <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: 'clamp(64px, 8vw, 120px)', lineHeight: '0.9', margin: '0 0 32px 0', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            Trade<br/>
            Your<br/>
            <span style={{ color: 'var(--neon-green)' }}>Skill</span><br/>
            Equity
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.6', maxWidth: '400px', marginBottom: '40px' }}>
            [SYSTEM]: The job market is a commodities exchange. We provide the real-time liquidity data you need to value your tech stack and optimize your exit.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => onNavigate('DASHBOARD')}
              style={{ padding: '16px 32px', backgroundColor: 'var(--neon-green)', color: '#000', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
              INITIALIZE_TERMINAL
            </button>
            <button style={{ padding: '16px 32px', backgroundColor: 'transparent', color: '#fff', border: '1px solid var(--border-ghost)', fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase' }}>
              PROTOCOLS
            </button>
          </div>
        </div>

        {/* Hero Chart Mock */}
        <div style={{ flex: 0.8, backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '8px' }}>ASSET: LLM_ORCHESTRATION</div>
              <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '24px' }}>LANGCHAIN</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--neon-green)', fontSize: '32px' }}>92.4</div>
              <div style={{ color: 'var(--neon-green)', fontSize: '12px' }}>+4.2</div>
            </div>
          </div>
          {/* Mock SVGs for the chart */}
          <svg viewBox="0 0 400 100" width="100%" height="100%">
            <path d="M0,80 Q50,90 100,70 T200,50 T300,50 T400,20 L400,100 L0,100 Z" fill="rgba(0, 255, 136, 0.05)" />
            <path d="M0,80 Q50,90 100,70 T200,50 T300,50 T400,20" fill="none" stroke="var(--neon-green)" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border-ghost)', borderBottom: '1px solid var(--border-ghost)', padding: '32px 0', marginBottom: '80px' }}>
        <div style={{ borderRight: '1px solid var(--border-ghost)', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '16px' }}>GLOBAL_LIQUIDITY</div>
          <div style={{ fontSize: '32px' }}>4,200+</div>
        </div>
        <div style={{ borderRight: '1px solid var(--border-ghost)', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '16px' }}>MEDIAN_YIELD_PREMIUM</div>
          <div style={{ fontSize: '32px', color: 'var(--neon-green)' }}>$18.4K</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '16px' }}>MARKET_VOLATILITY</div>
          <div style={{ fontSize: '32px', color: 'var(--neon-cyan)' }}>5.2%</div>
        </div>
      </div>

      {/* Baseline Identity */}
      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', marginBottom: '16px' }}>BASELINE_IDENTITY</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '48px' }}>Select input vector to generate your first-party skill node.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ border: '1px dashed var(--border-ghost)', backgroundColor: 'var(--bg-surface)', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', cursor: 'pointer' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ color: '#fff', fontSize: '14px' }}>📄</div>
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>INGEST_RÉSUMÉ</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '10px', textAlign: 'center', maxWidth: '280px', lineHeight: '1.6' }}>
              Direct neural parsing of PDF/DOCX. We identify latent skill clusters and market-weight them automatically.
            </p>
          </div>
          <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface-elevated)', padding: '48px', height: '300px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '32px' }}>MANUAL_CONSTRUCT</h3>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '8px' }}>SELECT_CORE_DOMAIN</div>
              <div style={{ border: '1px solid var(--border-ghost)', padding: '12px', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-base)' }}>
                <span>ARTIFICIAL_INTELLIGENCE</span>
                <span style={{ color: 'var(--text-muted)' }}>⌄</span>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginBottom: '8px' }}>BASE_COMPETENCIES</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--neon-green)', padding: '4px 8px', fontSize: '10px', border: '1px solid var(--neon-green)' }}>PYTHON x</span>
                <span style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--neon-green)', padding: '4px 8px', fontSize: '10px', border: '1px solid var(--neon-green)' }}>DOCKER x</span>
                <span style={{ border: '1px dashed var(--border-ghost)', color: 'var(--text-muted)', padding: '4px 8px', fontSize: '10px' }}>+ ADD_SKILL</span>
              </div>
            </div>
            <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--neon-cyan)', color: '#000', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              GENERATE_PORTFOLIO
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
