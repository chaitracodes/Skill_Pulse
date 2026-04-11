import React, { useState, useEffect } from 'react';

export default function NewsView() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchNews = async (isReload = false) => {
    if (!isReload) setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/news');
      const data = await response.json();
      
      if (isReload) {
        if (news.length > 0 && data.news.length > 0 && data.news[0].title === news[0].title) {
          showToast("FEED ALREADY UP TO DATE");
        } else {
          setNews(data.news || []);
          showToast("NEW TRANSMISSIONS SYNCED");
        }
      } else {
        setNews(data.news || []);
      }
    } catch (err) {
      console.error(err);
      if (isReload) showToast("ERROR: COMM LINK LOST");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div style={{ marginLeft: '80px', padding: '64px', minHeight: 'calc(100vh - 60px)', display: 'flex', gap: '64px', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid var(--neon-cyan)',
          color: 'var(--neon-cyan)',
          padding: '12px 24px',
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
          zIndex: 1000
        }}>
          {toastMessage}
        </div>
      )}

      {/* Left Column: News Feed */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '64px', margin: '0', lineHeight: 1 }}>MARKET_INTELLIGENCE</h1>
          <button 
            onClick={() => fetchNews(true)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-ghost)',
              color: 'var(--text-muted)',
              padding: '8px 16px',
              fontSize: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: "'Space Mono', monospace"
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-bright)'; e.currentTarget.style.border = '1px solid var(--text-muted)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.border = '1px solid var(--border-ghost)'; }}
          >
            [ RELOAD_FEED ]
          </button>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginBottom: '64px' }}>LATEST_TRANSMISSIONS_RECEIVED_REAL_TIME</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ESTABLISHING UPLINK...</div>
          ) : (
            news.map((item, idx) => {
              const isBull = item.tag === 'BULLISH';
              const isBear = item.tag === 'BEARISH';
              const tagColor = isBull ? 'var(--neon-green)' : isBear ? 'var(--neon-red)' : 'var(--neon-cyan)';

              return (
                <div key={idx} style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'rgba(10, 10, 10, 0.8)', padding: '24px' }}>
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
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                  </h2>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {item.labels.map((l, i) => (
                      <span key={i} style={{ border: '1px solid var(--border-ghost)', color: 'var(--text-muted)', fontSize: '9px', padding: '4px 8px' }}>{l}</span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
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
