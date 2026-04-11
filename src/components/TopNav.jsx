import React, { useEffect, useState } from 'react';
import { Bell, Settings, User, Moon, Sun } from 'lucide-react';

export default function TopNav({ activeRoute, onNavigate }) {
  const links = ['TERMINAL', 'MARKETS', 'STAKING', 'LEARNING_HUB', 'DEEP_DIVE', 'PROFILE'];

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
      paddingLeft: '32px',
      paddingRight: '32px',
      backgroundColor: isDarkMode ? 'rgba(5, 5, 5, 0.92)' : 'rgba(250, 250, 250, 0.92)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      marginLeft: '80px'
    }}>
      {/* Brand */}
      <div style={{
        fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif",
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'var(--neon-green)',
        letterSpacing: '0.02em',
        marginRight: '48px',
        cursor: 'pointer',
        flexShrink: 0
      }} onClick={() => onNavigate('TERMINAL')}>
        SkillPulse
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto' }}>
        {links.map(link => {
          const isActive = activeRoute === link;
          return (
            <div
              key={link}
              onClick={() => onNavigate(link)}
              style={{
                fontSize: '11px',
                color: isActive ? 'var(--neon-green)' : 'var(--text-muted)',
                cursor: 'pointer',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                borderBottom: isActive ? '2px solid var(--neon-green)' : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s'
              }}
            >
              {link.replace('_', ' ')}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-muted)' }}>

        {/* Dark/Light toggle pill */}
        <div
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            width: '48px',
            height: '24px',
            backgroundColor: isDarkMode ? 'var(--bg-surface-elevated)' : '#e4e4e4',
            border: '1px solid var(--border-ghost)',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: isDarkMode ? 'var(--neon-green)' : '#fff',
            position: 'absolute',
            left: isDarkMode ? '26px' : '4px',
            top: '2px',
            transition: 'left 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isDarkMode ? <Moon size={9} color="#000" /> : <Sun size={9} color="#888" />}
          </div>
        </div>

        <Bell size={17} style={{ cursor: 'pointer' }} />
        <Settings size={17} style={{ cursor: 'pointer' }} />
        <div
          onClick={() => onNavigate('PROFILE')}
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: activeRoute === 'PROFILE' ? '1px solid var(--neon-green)' : '1px solid var(--border-ghost)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <User size={14} color={activeRoute === 'PROFILE' ? 'var(--neon-green)' : 'var(--text-muted)'} />
        </div>
      </div>
    </div>
  );
}
