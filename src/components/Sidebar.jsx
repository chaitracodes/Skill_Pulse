/**
 * Sidebar.jsx
 * 
 * Global Sidebar component providing primary navigation across the application views.
 */
import React from 'react';
import { LayoutGrid, Database, BookOpen, Newspaper, User, Settings } from 'lucide-react';

export default function Sidebar({ activeTab = 'TERMINAL', onNavigate }) {
  const navItems = [
    { id: 'TERMINAL',     icon: LayoutGrid, label: 'TERMINAL' },
    { id: 'MARKETS',      icon: Newspaper,  label: 'MARKETS' },
    { id: 'STAKING',      icon: Database,   label: 'STAKING' },
    { id: 'LEARNING_HUB', icon: BookOpen,   label: 'LEARN' },
    { id: 'PROFILE',      icon: User,       label: 'PROFILE' },
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
      {/* Logo */}
      <div
        style={{ marginBottom: '48px', cursor: 'pointer' }}
        onClick={() => onNavigate('LANDING')}
      >
        <div style={{ border: '2px solid var(--neon-green)', width: '24px', height: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, backgroundColor: 'var(--neon-green)' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
                padding: '4px 0'
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute', left: 0, top: '-4px', bottom: '-4px',
                  width: '2px', backgroundColor: 'var(--neon-green)'
                }} />
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
                fontSize: '7px',
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

      <Settings size={18} color="var(--text-muted)" style={{ cursor: 'pointer', paddingBottom: '8px' }} />
    </div>
  );
}
