import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

export default function AuthView() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Robot State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const robotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (robotRef.current) {
        const rect = robotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;
        
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          dx = (dx / dist) * 10;
          dy = (dy / dist) * 10;
        }
        
        setMousePos({ x: dx, y: dy });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#050505',
      fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
      color: '#fff',
      overflow: 'hidden',
    }}>
      {/* Left Side: Interactive Robot */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #1a1a1a',
        position: 'relative',
        backgroundColor: '#0a0a0a',
      }}>
        <div 
          ref={robotRef}
          style={{
            width: '300px',
            height: '300px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Robot Head */}
          <div style={{
            width: '200px',
            height: '180px',
            backgroundColor: '#1f1f1f',
            border: '2px solid #333',
            borderRadius: '40px 40px 10px 10px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-out',
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          }}>
            {/* Visor Area */}
            <div style={{
              width: '160px',
              height: '60px',
              backgroundColor: '#000',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Eyes */}
              {[0, 1].map((i) => (
                <div key={i} style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#00FF88',
                  borderRadius: '50%',
                  boxShadow: '0 0 15px #00FF88',
                  transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                }} />
              ))}
              
              {/* "Scanning" effect line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.1), transparent)',
                animation: 'authScan 2s linear infinite',
              }} />
            </div>

            {/* Antennas */}
            <div style={{ position: 'absolute', top: '-40px', left: '40px', width: '2px', height: '40px', backgroundColor: '#333' }}>
              <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00FF88', boxShadow: '0 0 10px #00FF88' }} />
            </div>
            <div style={{ position: 'absolute', top: '-30px', right: '40px', width: '2px', height: '30px', backgroundColor: '#333' }}>
              <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#555' }} />
            </div>
          </div>

          <div style={{ width: '40px', height: '20px', backgroundColor: '#111', border: '1px solid #333' }} />

          <div style={{
            width: '240px',
            height: '100px',
            backgroundColor: '#1a1a1a',
            border: '2px solid #333',
            borderRadius: '20px 20px 0 0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
             <div style={{ width: '180px', height: '60px', border: '1px solid #222', borderRadius: '10px', background: 'repeating-linear-gradient(0deg, #111, #111 2px, #1a1a1a 2px, #1a1a1a 4px)' }} />
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', letterSpacing: '2px', color: '#00FF88' }}>SECURITY_AGENT</h2>
          <p style={{ color: '#666', fontSize: '11px', marginTop: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px' }}>
            SCANNING_GITHUB_V2_PROTOCOL...
          </p>
        </div>

        <style>{`
          @keyframes authScan {
            from { left: -100%; }
            to { left: 100%; }
          }
        `}</style>
      </div>

      {/* Right Side: Auth Options */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ fontSize: '12px', color: '#00FF88', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px' }}>
              IDENTITY_VERIFICATION
            </div>
            <h1 style={{ fontSize: '44px', margin: 0, letterSpacing: '-1.5px', fontWeight: 'bold' }}>Welcome</h1>
            <p style={{ color: '#666', marginTop: '16px', lineHeight: '1.6', fontSize: '15px' }}>
              Access the SkillPulse Career ecosystem exclusively via your GitHub identity.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button 
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: '#24292e',
                color: '#fff',
                border: '1px solid #30363d',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2f363d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#00FF88';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,255,136,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#24292e';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#30363d';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
                }
              }}
            >
              {/* GitHub SVG Icon */}
              <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {message && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              fontSize: '13px',
              backgroundColor: 'rgba(255, 68, 68, 0.05)',
              color: '#FF4444',
              border: '1px solid rgba(255, 68, 68, 0.2)',
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF4444' }} />
              {message.text}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ color: '#444', fontSize: '13px', lineHeight: '1.6' }}>
              Identity management via GitHub OAuth 2.0. <br/>
              SkillPulse ensures <span style={{ color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>Secure Data Governance</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
