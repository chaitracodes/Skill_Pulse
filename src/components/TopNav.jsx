import React, { useEffect, useState } from 'react';
import { Bell, Settings, User, Moon, Sun } from 'lucide-react';

export default function TopNav({ activeRoute, onNavigate }) {
  const links = ['TERMINAL', 'MARKETS', 'LIQUIDITY', 'LEARNING_HUB', 'DEEP_DIVE', 'ROADMAP'];

  // Theme logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div style={{
      height: '60px',
      borderBottom: '1px solid var(--border-ghost)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      backgroundColor: isDarkMode ? 'rgba(5, 5, 5, 0.8)' : 'rgba(250, 250, 250, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      marginLeft: '80px' // Offset for sidebar
    }}>
      <div style={{ 
        fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", 
        fontSize: '20px', 
        fontWeight: 'bold',
        color: 'var(--neon-green)',
        letterSpacing: '0.02em',
        marginRight: '64px'
      }}>
        SkillPulse
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {links.map(link => {
          const isActive = activeRoute === link;
          return (
            <div 
              key={link}
              onClick={() => onNavigate(link)}
              style={{
                fontSize: '12px',
                color: isActive ? 'var(--neon-green)' : 'var(--text-muted)',
                cursor: 'pointer',
                position: 'relative',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: isActive ? '2px solid var(--neon-green)' : 'none'
              }}
            >
              {link}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-muted)' }}>
        
        {/* Toggle Switch */}
        <div 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            width: '48px',
            height: '24px',
            backgroundColor: isDarkMode ? 'var(--bg-surface-elevated)' : '#e0e0e0',
            border: '1px solid var(--border-ghost)',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: isDarkMode ? 'var(--neon-green)' : '#fff',
            position: 'absolute',
            left: isDarkMode ? '26px' : '4px',
            transition: 'left 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isDarkMode ? <Moon size={10} color="#000" /> : <Sun size={10} color="#000" />}
          </div>
        </div>

        <Bell size={18} style={{ cursor: 'pointer' }} />
        <Settings size={18} style={{ cursor: 'pointer' }} />
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={14} />
        </div>
      </div>
    </div>
  );
}
