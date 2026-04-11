import React, { useState } from 'react';

const DOMAINS = [
  'AI / Machine Learning', 'Web Development', 'DevOps & Cloud',
  'Data Engineering', 'Systems Programming', 'Cybersecurity',
  'Mobile Development', 'Blockchain & Web3', 'Product Management',
  'UI/UX Design', 'Finance & Fintech', 'Game Development'
];

const ROLES = [
  'ML Engineer', 'Data Scientist', 'Prompt Engineer', 'AI Researcher',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Cloud Architect', 'SRE Engineer',
  'Data Analyst', 'Data Engineer', 'BI Developer',
  'Blockchain Developer', 'Smart Contract Auditor',
  'iOS Developer', 'Android Developer',
  'Security Engineer', 'Penetration Tester',
  'Product Manager', 'UX Designer', 'Game Developer'
];

const DOMAIN_SKILLS = {
  'AI / Machine Learning': [
    { name: 'Python', trend: '↑' }, { name: 'PyTorch', trend: '↑' }, { name: 'TensorFlow', trend: '→' },
    { name: 'LangChain', trend: '↑' }, { name: 'HuggingFace', trend: '↑' }, { name: 'Scikit-learn', trend: '→' },
    { name: 'MLflow', trend: '↑' }, { name: 'CUDA', trend: '↑' }, { name: 'RAG Systems', trend: '↑' },
    { name: 'Fine-tuning LLMs', trend: '↑' }, { name: 'Vector Databases', trend: '↑' }, { name: 'Pandas', trend: '→' },
  ],
  'Web Development': [
    { name: 'TypeScript', trend: '↑' }, { name: 'React', trend: '→' }, { name: 'Next.js', trend: '↑' },
    { name: 'Tailwind CSS', trend: '↑' }, { name: 'Node.js', trend: '→' }, { name: 'GraphQL', trend: '→' },
    { name: 'Vite', trend: '↑' }, { name: 'PostgreSQL', trend: '→' }, { name: 'Docker', trend: '↑' },
    { name: 'Redis', trend: '→' }, { name: 'tRPC', trend: '↑' }, { name: 'Prisma', trend: '↑' },
  ],
  'DevOps & Cloud': [
    { name: 'Kubernetes', trend: '↑' }, { name: 'Terraform', trend: '↑' }, { name: 'AWS', trend: '→' },
    { name: 'GCP', trend: '↑' }, { name: 'Docker', trend: '→' }, { name: 'Ansible', trend: '→' },
    { name: 'ArgoCD', trend: '↑' }, { name: 'Helm', trend: '↑' }, { name: 'Prometheus', trend: '→' },
    { name: 'GitHub Actions', trend: '↑' }, { name: 'Linux', trend: '→' }, { name: 'Bash', trend: '→' },
  ],
  'Data Engineering': [
    { name: 'Apache Spark', trend: '→' }, { name: 'dbt', trend: '↑' }, { name: 'Airflow', trend: '→' },
    { name: 'Kafka', trend: '↑' }, { name: 'Snowflake', trend: '↑' }, { name: 'BigQuery', trend: '↑' },
    { name: 'Python', trend: '↑' }, { name: 'SQL', trend: '→' }, { name: 'Flink', trend: '↑' },
    { name: 'Iceberg', trend: '↑' }, { name: 'duckdb', trend: '↑' }, { name: 'Databricks', trend: '↑' },
  ],
  'Systems Programming': [
    { name: 'Rust', trend: '↑' }, { name: 'C++', trend: '→' }, { name: 'Go', trend: '↑' },
    { name: 'WASM', trend: '↑' }, { name: 'Linux Kernel', trend: '→' }, { name: 'LLVM', trend: '↑' },
    { name: 'Zig', trend: '↑' }, { name: 'gRPC', trend: '→' }, { name: 'Concurrency', trend: '→' },
  ],
  'Cybersecurity': [
    { name: 'Penetration Testing', trend: '↑' }, { name: 'OSINT', trend: '↑' }, { name: 'Reverse Engineering', trend: '→' },
    { name: 'Burp Suite', trend: '→' }, { name: 'Metasploit', trend: '→' }, { name: 'Python', trend: '↑' },
    { name: 'Malware Analysis', trend: '↑' }, { name: 'Cloud Security', trend: '↑' }, { name: 'Zero Trust', trend: '↑' },
  ],
  'Mobile Development': [
    { name: 'React Native', trend: '↑' }, { name: 'Flutter', trend: '↑' }, { name: 'Swift', trend: '→' },
    { name: 'Kotlin', trend: '→' }, { name: 'Expo', trend: '↑' }, { name: 'Jetpack Compose', trend: '↑' },
    { name: 'SwiftUI', trend: '↑' }, { name: 'Firebase', trend: '→' }, { name: 'GraphQL', trend: '→' },
  ],
  'Blockchain & Web3': [
    { name: 'Solidity', trend: '↑' }, { name: 'Rust (Solana)', trend: '↑' }, { name: 'Hardhat', trend: '→' },
    { name: 'ethers.js', trend: '→' }, { name: 'IPFS', trend: '→' }, { name: 'Smart Contract Auditing', trend: '↑' },
    { name: 'wagmi', trend: '↑' }, { name: 'Move Lang', trend: '↑' }, { name: 'Zero Knowledge Proofs', trend: '↑' },
  ],
  'Product Management': [
    { name: 'Roadmapping', trend: '→' }, { name: 'User Research', trend: '↑' }, { name: 'JIRA', trend: '→' },
    { name: 'Data Analytics', trend: '↑' }, { name: 'SQL', trend: '↑' }, { name: 'A/B Testing', trend: '↑' },
    { name: 'PRD Writing', trend: '→' }, { name: 'Figma', trend: '↑' }, { name: 'OKR Management', trend: '→' },
  ],
  'UI/UX Design': [
    { name: 'Figma', trend: '↑' }, { name: 'Prototyping', trend: '→' }, { name: 'User Testing', trend: '↑' },
    { name: 'Design Systems', trend: '↑' }, { name: 'Motion Design', trend: '↑' }, { name: 'Accessibility', trend: '↑' },
    { name: 'UX Writing', trend: '↑' }, { name: 'CSS', trend: '→' }, { name: 'Framer', trend: '↑' },
  ],
  'Finance & Fintech': [
    { name: 'Python', trend: '↑' }, { name: 'Quantitative Modeling', trend: '↑' }, { name: 'SQL', trend: '→' },
    { name: 'Bloomberg Terminal', trend: '→' }, { name: 'Risk Analysis', trend: '↑' }, { name: 'Excel (Advanced)', trend: '→' },
    { name: 'Algorithmic Trading', trend: '↑' }, { name: 'Regulatory Compliance', trend: '↑' }, { name: 'DeFi Protocols', trend: '↑' },
  ],
  'Game Development': [
    { name: 'Unity', trend: '→' }, { name: 'Unreal Engine', trend: '↑' }, { name: 'C#', trend: '→' },
    { name: 'C++', trend: '→' }, { name: 'Shader Programming', trend: '↑' }, { name: 'Godot', trend: '↑' },
    { name: 'Multiplayer Networking', trend: '↑' }, { name: 'Game AI', trend: '↑' }, { name: 'VR/AR', trend: '↑' },
  ],
};

export default function LandingView({ onNavigate, onResumeParsed }) {
  const [step, setStep] = useState('home'); // home | domain | skills
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');

  const skills = DOMAIN_SKILLS[selectedDomain] || [];

  const toggleSkill = (name) => {
    setSelectedSkills(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
    }
    setCustomSkill('');
  };

  const enterMarket = () => {
    if (onResumeParsed) onResumeParsed(selectedSkills);
    onNavigate('TERMINAL');
  };

  // ── HOME SCREEN ──────────────────────────────────────────────────────────
  if (step === 'home') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(circle at 2px 2px, #00FF88 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div style={{ padding: '28px 64px', display: 'flex', justifyContent: 'space-between', zIndex: 10, borderBottom: '1px solid var(--border-ghost)' }}>
          <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '22px', color: '#00FF88', letterSpacing: '0.05em' }}>SkillPulse</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span>NETWORK: <span style={{ color: '#00FF88' }}>ONLINE</span></span>
            <span>NODES: 2,491</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', zIndex: 10 }}>
          <div style={{ maxWidth: '760px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '88px', lineHeight: '0.92', letterSpacing: '-0.02em', color: 'var(--text-main)', margin: '0 0 32px' }}>
              TRADE YOUR<br /><span style={{ color: '#00FF88' }}>SKILL EQUITY</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 56px' }}>
              The first institutional-grade dashboard for tokenized human capital. Upload your résumé or build your profile manually.
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button
                onClick={() => setStep('domain')}
                style={{ backgroundColor: '#00FF88', color: '#000', border: 'none', padding: '22px 44px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", transition: 'transform 0.15s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                BUILD PROFILE
              </button>
              <button
                onClick={() => onNavigate('TERMINAL')}
                style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-ghost)', padding: '22px 44px', fontSize: '13px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#00D4FF'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-ghost)'}
              >
                ENTER WITHOUT PROFILE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 1: DOMAIN ───────────────────────────────────────────────────────
  if (step === 'domain') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 64px', borderBottom: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: '#00FF88', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '20px' }}>SkillPulse</div>
          <span style={{ color: 'var(--border-ghost)' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>BUILD_PROFILE</span>
        </div>

        <div style={{ flex: 1, maxWidth: '680px', margin: '0 auto', padding: '64px 32px', width: '100%' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>STEP 01 / 02</div>
          <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '40px', margin: '0 0 8px' }}>SELECT YOUR DOMAIN</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '40px' }}>Choose the primary domain you are targeting or currently operating in.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DOMAINS.map(domain => (
              <div
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                style={{
                  backgroundColor: '#111111',
                  border: selectedDomain === domain ? '1px solid #1F1F1F' : '1px solid #1F1F1F',
                  borderLeft: selectedDomain === domain ? '3px solid #00FF88' : '3px solid transparent',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: selectedDomain === domain ? '#00FF88' : '#F0F0F0',
                  fontSize: '13px',
                  transition: 'all 0.15s'
                }}
              >
                <span>{domain}</span>
                {selectedDomain === domain && <span style={{ fontSize: '16px' }}>›</span>}
              </div>
            ))}
          </div>

          <button
            onClick={() => selectedDomain && setStep('skills')}
            disabled={!selectedDomain}
            style={{
              marginTop: '32px', width: '100%', padding: '20px',
              backgroundColor: selectedDomain ? '#00FF88' : 'var(--bg-surface-elevated)',
              color: selectedDomain ? '#000' : 'var(--text-muted)',
              border: 'none', fontWeight: '700', fontSize: '13px',
              cursor: selectedDomain ? 'pointer' : 'not-allowed',
              fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.2s'
            }}
          >
            CONTINUE →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: SKILLS ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px 64px', borderBottom: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ color: '#00FF88', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '20px' }}>SkillPulse</div>
        <span style={{ color: 'var(--border-ghost)' }}>/</span>
        <button onClick={() => setStep('domain')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>BUILD_PROFILE</button>
        <span style={{ color: 'var(--border-ghost)' }}>/</span>
        <span style={{ color: '#00FF88', fontSize: '11px' }}>{selectedDomain.toUpperCase()}</span>
      </div>

      <div style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '64px 32px', width: '100%' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>STEP 02 / 02</div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '40px', margin: '0 0 8px' }}>SELECT YOUR SKILLS</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '36px' }}>
          Click to select skills you currently have. Select at least 1 to continue.
          <span style={{ color: '#00FF88', marginLeft: '8px' }}>{selectedSkills.length} selected</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginBottom: '32px' }}>
          {skills.map(({ name, trend }) => {
            const sel = selectedSkills.includes(name);
            return (
              <div
                key={name}
                onClick={() => toggleSkill(name)}
                style={{
                  border: sel ? '1px solid #00FF88' : '1px solid var(--border-ghost)',
                  backgroundColor: sel ? 'rgba(0,255,136,0.05)' : 'var(--bg-surface)',
                  color: sel ? '#00FF88' : 'var(--text-muted)',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <span>{name}</span>
                <span style={{ fontSize: '14px', color: trend === '↑' ? '#00FF88' : trend === '↓' ? '#FF4444' : 'var(--text-muted)' }}>{trend}</span>
              </div>
            );
          })}
        </div>

        {/* Custom skill input */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <input
            type="text"
            value={customSkill}
            onChange={e => setCustomSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
            placeholder="Add a custom skill..."
            style={{
              flex: 1, backgroundColor: '#111111', border: '1px solid #1F1F1F', color: '#F0F0F0',
              padding: '14px 16px', fontSize: '12px', outline: 'none', fontFamily: "'JetBrains Mono', monospace"
            }}
          />
          <button
            onClick={addCustomSkill}
            style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', color: 'var(--text-muted)', padding: '14px 24px', fontSize: '11px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}
          >
            + ADD
          </button>
        </div>

        <button
          onClick={enterMarket}
          disabled={selectedSkills.length === 0}
          style={{
            width: '100%', padding: '22px',
            backgroundColor: selectedSkills.length > 0 ? '#00FF88' : 'var(--bg-surface-elevated)',
            color: selectedSkills.length > 0 ? '#000' : 'var(--text-muted)',
            border: 'none', fontWeight: '700', fontSize: '14px',
            cursor: selectedSkills.length > 0 ? 'pointer' : 'not-allowed',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', transition: 'all 0.2s'
          }}
        >
          ENTER THE MARKET →
        </button>
      </div>
    </div>
  );
}
