import React, { useState, useEffect } from 'react';

export default function NewsView() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

  // Generate a mock brief deterministic to the news title so it feels consistent
  const getBrief = (title) => {
    return `Deep dive analysis into "${title}". Industry leaders are reacting to these recent developments, scaling infrastructure and pivoting strategies to align with the new shift. Early indicators suggest a profound impact on upcoming quarterly pipelines, with significant focus redirecting toward resilient architecture.`;
  }

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
      <div style={{ flex: 1, maxWidth: '800px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ESTABLISHING UPLINK...</div>
          ) : (
            news.map((item, idx) => {
              const isBull = item.tag === 'BULLISH';
              const isBear = item.tag === 'BEARISH';
              const tagColor = isBull ? 'var(--neon-green)' : isBear ? 'var(--neon-red)' : 'var(--neon-cyan)';
              const isExpanded = expandedId === idx;

              return (
                <div 
                  key={idx} 
                  onClick={() => setExpandedId(isExpanded ? null : idx)}
                  style={{ 
                    border: isExpanded ? `1px solid ${tagColor}` : '1px solid var(--border-ghost)', 
                    backgroundColor: isExpanded ? 'var(--bg-surface-elevated)' : 'rgba(10, 10, 10, 0.8)', 
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isExpanded && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', backgroundColor: tagColor }} />}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <div style={{ border: `1px solid ${tagColor}`, color: tagColor, fontSize: '9px', padding: '4px 8px', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.tag}
                    </div>
                  </div>
                  
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.4', marginBottom: isExpanded ? '16px' : '24px', transition: 'margin 0.3s', color: isExpanded ? '#FFF' : '#E0E0E0' }}>
                    {item.title}
                  </h2>

                  <div style={{
                     display: 'grid', gridTemplateRows: isExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', borderTop: '1px solid var(--border-ghost)', paddingTop: '16px', margin: '0 0 24px 0' }}>
                        {getBrief(item.title)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {item.labels.map((l, i) => (
                      <span key={i} style={{ border: '1px solid var(--border-ghost)', color: 'var(--text-muted)', fontSize: '9px', padding: '4px 8px', fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
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
        
        <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface-elevated)', padding: '32px', marginBottom: '32px', position: 'sticky', top: '124px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '32px', fontFamily: "'JetBrains Mono', monospace" }}>SENTIMENT_ANALYSIS</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', color: 'var(--neon-green)', fontWeight: 'bold', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>BULLISH</div>
            <div style={{ fontSize: '24px', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>74%</div>
          </div>
          
          <div style={{ height: '4px', backgroundColor: 'var(--border-ghost)', marginBottom: '48px' }}>
            <div style={{ height: '100%', width: '74%', backgroundColor: 'var(--neon-green)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
            <div style={{ borderRight: '1px solid var(--border-ghost)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>FEAR</div>
              <div style={{ fontSize: '16px', color: 'var(--neon-red)' }}>12</div>
            </div>
            <div style={{ borderRight: '1px solid var(--border-ghost)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>NEUTRAL</div>
              <div style={{ fontSize: '16px' }}>14</div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>GREED</div>
              <div style={{ fontSize: '16px', color: 'var(--neon-green)' }}>74</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
