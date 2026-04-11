import React from 'react';
import { Bell, Settings, User } from 'lucide-react';

export default function TopNav({ activeRoute, onNavigate }) {
  const links = ['TERMINAL', 'MARKETS', 'LIQUIDITY', 'LEARNING_HUB', 'DEEP_DIVE', 'ROADMAP'];

  return (
    <div style={{
      height: '60px',
      borderBottom: '1px solid var(--border-ghost)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      backgroundColor: 'rgba(5, 5, 5, 0.8)',
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
        SKILL_EXCHANGE
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
        <Bell size={18} style={{ cursor: 'pointer' }} />
        <Settings size={18} style={{ cursor: 'pointer' }} />
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={14} />
        </div>
      </div>
    </div>
  );
}
