/**
 * PortfolioView.jsx
 * 
 * Displays visual skill progression and career assets. (Placeholder/Extension).
 */
import React, { useState } from 'react';

export default function PortfolioView() {
  const [activeTab, setActiveTab] = useState('VIDEOS'); // VIDEOS | ARTICLES
  const [activeSkill, setActiveSkill] = useState('PYTHON');

  const learningData = {
    'PYTHON': {
      videos: [
        { title: 'Python for Beginners - Full Course', source: 'freeCodeCamp.org', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
        { title: 'Advanced Python Tutorials', source: 'Corey Schafer', url: 'https://www.youtube.com/user/schafer5' }
      ],
      articles: [
        { title: 'Real Python Tutorials', source: 'Real Python', url: 'https://realpython.com/' },
        { title: 'Python 3 Documentation', source: 'Python.org', url: 'https://docs.python.org/3/' }
      ]
    },
    'LANGCHAIN': {
      videos: [
        { title: 'LangChain Crash Course', source: '@TechWithTim', url: 'https://www.youtube.com/watch?v=1bUy-1hGZpI' },
        { title: 'Building AI Agents with LangChain', source: '@SamWitteveen', url: 'https://www.youtube.com/c/samwitteveenai' }
      ],
      articles: [
        { title: 'LangChain Official Documentation', source: 'LangChain Docs', url: 'https://python.langchain.com/docs/get_started/introduction' },
        { title: 'Mastering LLM Orchestration', source: 'Towards Data Science', url: 'https://towardsdatascience.com/' }
      ]
    },
    'RUST': {
      videos: [
        { title: 'Rust Crash Course', source: '@NoBoilerplate', url: 'https://www.youtube.com/c/NoBoilerplate' },
        { title: 'Learn Rust in 2024', source: 'Traversy Media', url: 'https://www.youtube.com/watch?v=zF34dRivLOw' }
      ],
      articles: [
        { title: 'The Rust Programming Language Book', source: 'doc.rust-lang.org', url: 'https://doc.rust-lang.org/book/' },
        { title: 'Rust by Example', source: 'Rust Docs', url: 'https://doc.rust-lang.org/rust-by-example/' }
      ]
    }
  };

  const activeContent = learningData[activeSkill][activeTab.toLowerCase()];

  return (
    <div style={{ marginLeft: '80px', padding: '64px', position: 'relative', minHeight: 'calc(100vh - 60px)' }}>
      
      <div style={{ display: 'flex', gap: '64px' }}>
        
        {/* Left Skill Selector */}
        <div style={{ width: '240px' }}>
          <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '32px', marginBottom: '32px' }}>LEARNING_HUB</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.keys(learningData).map(skill => (
              <div 
                key={skill}
                onClick={() => setActiveSkill(skill)}
                style={{ 
                  padding: '16px', 
                  border: activeSkill === skill ? '1px solid var(--neon-green)' : '1px solid var(--border-ghost)',
                  backgroundColor: activeSkill === skill ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)',
                  color: activeSkill === skill ? 'var(--neon-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', padding: '32px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px', borderBottom: '1px solid var(--border-ghost)', paddingBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', letterSpacing: '0.05em' }}>{activeSkill}_CURRICULUM</h1>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['VIDEOS', 'ARTICLES'].map(tab => (
                <span 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontSize: '10px',
                    padding: '8px 16px',
                    backgroundColor: activeTab === tab ? 'var(--neon-green)' : 'transparent',
                    color: activeTab === tab ? '#000' : 'var(--text-muted)',
                    border: activeTab === tab ? 'none' : '1px solid var(--border-ghost)',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {activeContent.map((item, i) => (
              <a 
                key={i} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'block',
                  border: '1px solid var(--border-ghost)',
                  padding: '24px',
                  backgroundColor: 'var(--bg-base)',
                  transition: 'border-color 0.2s',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--neon-cyan)' }}>{item.source}</div>
                  <div style={{ color: 'var(--text-muted)' }}>↗</div>
                </div>
                <h3 style={{ fontSize: '16px', color: '#fff', lineHeight: '1.4' }}>{item.title}</h3>
              </a>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
