import React from 'react';
import { Home, LayoutGrid, Newspaper, Activity, Settings, Database } from 'lucide-react';

export default function Sidebar({ activedTab = 'DASHBOARD', onNavigate }) {
  const navItems = [
    { id: 'DASHBOARD', icon: LayoutGrid, label: 'DASHBOARD' },
    { id: 'STAKING', icon: Database, label: 'STAKING' },
    { id: 'LEARNING_HUB', icon: Home, label: 'LEARNING_HUB' }, 
    { id: 'MARKETS', icon: Newspaper, label: 'MARKET NEWS' },
    { id: 'ANALYTICS', icon: Activity, label: 'ANALYTICS' },
  ];

  return (
    <div style={{
      width: '80px',
      height: '100vh',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-ghost)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* Top Logo / Home */}
      <div 
        style={{ marginBottom: '48px', cursor: 'pointer' }}
        onClick={() => onNavigate('LANDING')}
      >
        <div style={{ border: '2px solid var(--neon-green)', width: '24px', height: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, backgroundColor: 'var(--neon-green)' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
        {navItems.map(item => {
          const isActive = activedTab === item.id;
          return (
            <div 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                position: 'relative',
                width: '100%'
              }}
            >
              {isActive && (
                <div style={{ position: 'absolute', left: 0, top: '-8px', bottom: '-8px', width: '2px', backgroundColor: 'var(--neon-green)' }} />
              )}
              <div style={{ 
                padding: isActive ? '8px' : '0', 
                backgroundColor: isActive ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                borderRadius: '4px',
                border: isActive ? '1px solid var(--neon-green)' : 'none'
              }}>
                <item.icon size={20} color={isActive ? 'var(--neon-green)' : 'var(--text-muted)'} />
              </div>
              <span style={{ 
                fontSize: '8px', 
                color: isActive ? 'var(--neon-green)' : 'var(--text-muted)',
                letterSpacing: '0.05em',
                textAlign: 'center',
                padding: '0 4px'
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
        <Settings size={20} color={'var(--text-muted)'} style={{ cursor: 'pointer'}} />
      </div>
    </div>
  );
}
