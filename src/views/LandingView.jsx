import React, { useState, useRef } from 'react';
import { ALL_ROLES } from '../utils/jobRoleKeywords';

const DOMAINS = [
  'AI / Machine Learning', 'Web Development', 'DevOps & Cloud',
  'Data Engineering', 'Systems Programming', 'Cybersecurity',
  'Mobile Development', 'Blockchain & Web3', 'Product Management',
  'UI/UX Design', 'Finance & Fintech', 'Game Development'
];

const DOMAIN_SKILLS = {
  'AI / Machine Learning': [
    { name: 'Python', trend: '↑' }, { name: 'PyTorch', trend: '↑' }, { name: 'TensorFlow', trend: '→' },
    { name: 'LangChain', trend: '↑' }, { name: 'HuggingFace', trend: '↑' }, { name: 'Scikit-learn', trend: '→' },
    { name: 'MLflow', trend: '↑' }, { name: 'CUDA', trend: '↑' }, { name: 'RAG Systems', trend: '↑' },
    { name: 'Vector Databases', trend: '↑' }, { name: 'Pandas', trend: '→' }, { name: 'NumPy', trend: '→' },
  ],
  'Web Development': [
    { name: 'TypeScript', trend: '↑' }, { name: 'React', trend: '→' }, { name: 'Next.js', trend: '↑' },
    { name: 'Tailwind CSS', trend: '↑' }, { name: 'Node.js', trend: '→' }, { name: 'GraphQL', trend: '→' },
    { name: 'Vite', trend: '↑' }, { name: 'PostgreSQL', trend: '→' }, { name: 'Docker', trend: '↑' },
  ],
  'DevOps & Cloud': [
    { name: 'Kubernetes', trend: '↑' }, { name: 'Terraform', trend: '↑' }, { name: 'AWS', trend: '→' },
    { name: 'GCP', trend: '↑' }, { name: 'Docker', trend: '→' }, { name: 'ArgoCD', trend: '↑' },
    { name: 'GitHub Actions', trend: '↑' }, { name: 'Linux', trend: '→' }, { name: 'Prometheus', trend: '→' },
  ],
  'Data Engineering': [
    { name: 'Apache Spark', trend: '→' }, { name: 'dbt', trend: '↑' }, { name: 'Airflow', trend: '→' },
    { name: 'Kafka', trend: '↑' }, { name: 'Snowflake', trend: '↑' }, { name: 'BigQuery', trend: '↑' },
    { name: 'Python', trend: '↑' }, { name: 'duckdb', trend: '↑' }, { name: 'Databricks', trend: '↑' },
  ],
  'Systems Programming': [
    { name: 'Rust', trend: '↑' }, { name: 'C++', trend: '→' }, { name: 'Go', trend: '↑' },
    { name: 'WASM', trend: '↑' }, { name: 'Linux Kernel', trend: '→' }, { name: 'Zig', trend: '↑' },
  ],
  'Cybersecurity': [
    { name: 'Penetration Testing', trend: '↑' }, { name: 'OSINT', trend: '↑' },
    { name: 'Burp Suite', trend: '→' }, { name: 'Python', trend: '↑' }, { name: 'Cloud Security', trend: '↑' },
  ],
  'Mobile Development': [
    { name: 'React Native', trend: '↑' }, { name: 'Flutter', trend: '↑' }, { name: 'Swift', trend: '→' },
    { name: 'Kotlin', trend: '→' }, { name: 'SwiftUI', trend: '↑' }, { name: 'Jetpack Compose', trend: '↑' },
  ],
  'Blockchain & Web3': [
    { name: 'Solidity', trend: '↑' }, { name: 'Rust (Solana)', trend: '↑' }, { name: 'ethers.js', trend: '→' },
    { name: 'wagmi', trend: '↑' }, { name: 'Zero Knowledge Proofs', trend: '↑' },
  ],
  'Product Management': [
    { name: 'Roadmapping', trend: '→' }, { name: 'SQL', trend: '↑' }, { name: 'A/B Testing', trend: '↑' },
    { name: 'Figma', trend: '↑' }, { name: 'Data Analytics', trend: '↑' },
  ],
  'UI/UX Design': [
    { name: 'Figma', trend: '↑' }, { name: 'Prototyping', trend: '→' }, { name: 'Design Systems', trend: '↑' },
    { name: 'Motion Design', trend: '↑' }, { name: 'Framer', trend: '↑' },
  ],
  'Finance & Fintech': [
    { name: 'Python', trend: '↑' }, { name: 'Quantitative Modeling', trend: '↑' }, { name: 'SQL', trend: '→' },
    { name: 'Algorithmic Trading', trend: '↑' }, { name: 'DeFi Protocols', trend: '↑' },
  ],
  'Game Development': [
    { name: 'Unity', trend: '→' }, { name: 'Unreal Engine', trend: '↑' }, { name: 'C#', trend: '→' },
    { name: 'Shader Programming', trend: '↑' }, { name: 'Godot', trend: '↑' },
  ],
};

// ── PDF text extractor ────────────────────────────────────────────────────────
async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    document.head.appendChild(script);
    await new Promise(r => setTimeout(r, 1500));
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  const ab = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(s => s.str).join(' ') + '\n';
  }
  return text.trim();
}

export default function LandingView({ onNavigate, onProfileReady }) {
  const [step, setStep] = useState('home');     // home | upload | parsing | domain | skills
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [parseStatus, setParseStatus] = useState('');
  const fileInputRef = useRef(null);

  const skills = DOMAIN_SKILLS[selectedDomain] || [];

  const toggleSkill = (name) =>
    setSelectedSkills(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);

  const addCustomSkill = () => {
    const t = customSkill.trim();
    if (t && !selectedSkills.includes(t)) setSelectedSkills(prev => [...prev, t]);
    setCustomSkill('');
  };

  // ── Resume → Claude → job role predictions ─────────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStep('parsing');
    setParseStatus('EXTRACTING TEXT FROM RÉSUMÉ...');

    try {
      let rawText = '';
      if (file.type === 'application/pdf') {
        rawText = await extractPdfText(file);
      } else {
        rawText = await file.text();
      }

      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

      if (!apiKey) {
        // Demo fallback — no API key
        await new Promise(r => setTimeout(r, 1800));
        setParseStatus('DEMO MODE — NO API KEY FOUND');
        await new Promise(r => setTimeout(r, 800));
        const mockRoles = [
          'Data Scientist', 'ML Engineer', 'Data Analyst',
          'Analytics Engineer', 'AI Researcher', 'NLP Engineer', 'Data Engineer'
        ];
        if (onProfileReady) onProfileReady({ predictedRoles: mockRoles, skills: [] });
        onNavigate('TERMINAL');
        return;
      }

      setParseStatus('ANALYZING WITH CLAUDE AI...');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 600,
          system: `You are a career expert AI. Given a résumé, extract skills and predict the best-matching job roles.
Return ONLY a valid JSON object in this exact format, no prose:
{
  "skills": ["skill1", "skill2", ...],
  "predictedRoles": ["Role1", "Role2", ..., "Role7"]
}
The predictedRoles array must contain between 7 and 9 roles chosen ONLY from this list:
${ALL_ROLES.join(', ')}.
Choose roles that genuinely match the candidate's skills, projects, and experience.`,
          messages: [{ role: 'user', content: `Analyze this résumé:\n\n${rawText.slice(0, 8000)}` }],
        }),
      });

      if (!res.ok) throw new Error(`Claude API error ${res.status}`);
      const data = await res.json();
      const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      const parsed = JSON.parse(jsonMatch[0]);

      setParseStatus('DONE ✓');
      await new Promise(r => setTimeout(r, 400));
      if (onProfileReady) onProfileReady(parsed);
      onNavigate('TERMINAL');

    } catch (err) {
      console.error(err);
      setParseStatus(`ERROR: ${err.message}`);
      await new Promise(r => setTimeout(r, 2000));
      setStep('home');
    }
  };

  // ── Manual onboarding final step ────────────────────────────────────────────
  const enterMarket = () => {
    if (onProfileReady) onProfileReady({ predictedRoles: [], skills: selectedSkills });
    onNavigate('TERMINAL');
  };

  // ════════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════════

  if (step === 'parsing') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '24px', color: 'var(--neon-cyan)' }}>SkillPulse</div>
        <div style={{ width: '48px', height: '48px', border: '2px solid var(--neon-green)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--neon-green)', letterSpacing: '0.08em' }}>{parseStatus}</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === 'home') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'var(--bg-base)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'radial-gradient(circle at 2px 2px, #00FF88 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div style={{ padding: '28px 64px', borderBottom: '1px solid var(--border-ghost)', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '22px', color: '#00FF88' }}>SkillPulse</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span>NETWORK: <span style={{ color: '#00FF88' }}>ONLINE</span></span>
            <span>NODES: 2,491</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', zIndex: 10 }}>
          <div style={{ maxWidth: '780px', width: '100%' }}>
            <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '80px', lineHeight: '0.9', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>
              TRADE YOUR<br /><span style={{ color: '#00FF88' }}>SKILL EQUITY</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', textAlign: 'center', maxWidth: '560px', margin: '0 auto 64px' }}>
              Upload your résumé and our AI will predict your best matching job roles — then track their real-time market demand.
            </p>

            {/* Two paths side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Path 1 — Resume Upload */}
              <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface)', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onClick={() => fileInputRef.current?.click()}
                onMouseOver={e => e.currentTarget.style.borderColor = '#00FF88'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-ghost)'}
              >
                <div style={{ width: '56px', height: '56px', border: '1px solid var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📄</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '20px', marginBottom: '8px' }}>UPLOAD RÉSUMÉ</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.6' }}>
                    Claude AI reads your skills, projects & experience then predicts your top 7–9 job role matches.
                  </div>
                </div>
                <div style={{ backgroundColor: '#00FF88', color: '#000', padding: '12px 28px', fontSize: '11px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>
                  UPLOAD PDF / TXT →
                </div>
                <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }} onChange={handleResumeUpload} />
              </div>

              {/* Path 2 — Manual */}
              <div style={{ border: '1px solid var(--border-ghost)', backgroundColor: 'var(--bg-surface)', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onClick={() => setStep('domain')}
                onMouseOver={e => e.currentTarget.style.borderColor = '#00D4FF'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-ghost)'}
              >
                <div style={{ width: '56px', height: '56px', border: '1px solid var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚙️</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '20px', marginBottom: '8px' }}>BUILD MANUALLY</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.6' }}>
                    Select your domain and pick skills from a curated list. No résumé needed.
                  </div>
                </div>
                <div style={{ backgroundColor: 'transparent', color: '#00D4FF', border: '1px solid #00D4FF', padding: '12px 28px', fontSize: '11px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>
                  SELECT DOMAIN →
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'domain') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 64px', borderBottom: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#00FF88', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '18px' }}>SkillPulse</span>
          <span style={{ color: 'var(--border-ghost)' }}>/</span>
          <button onClick={() => setStep('home')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>BUILD_PROFILE</button>
        </div>
        <div style={{ flex: 1, maxWidth: '660px', margin: '0 auto', padding: '56px 32px', width: '100%' }}>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>STEP 01 / 02</div>
          <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '36px', margin: '0 0 8px' }}>SELECT YOUR DOMAIN</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '32px' }}>Your primary career domain.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {DOMAINS.map(d => (
              <div key={d} onClick={() => setSelectedDomain(d)}
                style={{ background: '#111', border: '1px solid #1F1F1F', borderLeft: selectedDomain === d ? '3px solid #00FF88' : '3px solid transparent', padding: '15px 18px', cursor: 'pointer', color: selectedDomain === d ? '#00FF88' : '#F0F0F0', fontSize: '13px', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between' }}>
                <span>{d}</span>
                {selectedDomain === d && <span>›</span>}
              </div>
            ))}
          </div>
          <button onClick={() => selectedDomain && setStep('skills')} disabled={!selectedDomain}
            style={{ marginTop: '28px', width: '100%', padding: '18px', background: selectedDomain ? '#00FF88' : 'var(--bg-surface-elevated)', color: selectedDomain ? '#000' : 'var(--text-muted)', border: 'none', fontWeight: '700', fontSize: '13px', cursor: selectedDomain ? 'pointer' : 'not-allowed', fontFamily: "'JetBrains Mono', monospace" }}>
            CONTINUE →
          </button>
        </div>
      </div>
    );
  }

  // Step 2 — Skills
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 64px', borderBottom: '1px solid var(--border-ghost)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#00FF88', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '18px' }}>SkillPulse</span>
        <span style={{ color: 'var(--border-ghost)' }}>/</span>
        <button onClick={() => setStep('domain')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>DOMAIN</button>
        <span style={{ color: 'var(--border-ghost)' }}>/</span>
        <span style={{ color: '#00FF88', fontSize: '11px' }}>{selectedDomain.toUpperCase()}</span>
      </div>
      <div style={{ flex: 1, maxWidth: '880px', margin: '0 auto', padding: '56px 32px', width: '100%' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>STEP 02 / 02</div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '36px', margin: '0 0 8px' }}>SELECT YOUR SKILLS</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '28px' }}>
          Pick skills you currently have. <span style={{ color: '#00FF88' }}>{selectedSkills.length} selected</span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', marginBottom: '24px' }}>
          {skills.map(({ name, trend }) => {
            const sel = selectedSkills.includes(name);
            return (
              <div key={name} onClick={() => toggleSkill(name)}
                style={{ border: sel ? '1px solid #00FF88' : '1px solid var(--border-ghost)', background: sel ? 'rgba(0,255,136,0.06)' : 'var(--bg-surface)', color: sel ? '#00FF88' : 'var(--text-muted)', padding: '10px 14px', cursor: 'pointer', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                <span>{name}</span>
                <span style={{ color: trend === '↑' ? '#00FF88' : trend === '↓' ? '#FF4444' : 'var(--text-muted)' }}>{trend}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px' }}>
          <input type="text" value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
            placeholder="Add a custom skill..." style={{ flex: 1, background: '#111', border: '1px solid #1F1F1F', color: '#F0F0F0', padding: '12px 14px', fontSize: '12px', outline: 'none', fontFamily: "'JetBrains Mono', monospace" }} />
          <button onClick={addCustomSkill} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', color: 'var(--text-muted)', padding: '12px 20px', fontSize: '11px', cursor: 'pointer' }}>+ ADD</button>
        </div>
        <button onClick={enterMarket} disabled={selectedSkills.length === 0}
          style={{ width: '100%', padding: '20px', background: selectedSkills.length > 0 ? '#00FF88' : 'var(--bg-surface-elevated)', color: selectedSkills.length > 0 ? '#000' : 'var(--text-muted)', border: 'none', fontWeight: '700', fontSize: '13px', cursor: selectedSkills.length > 0 ? 'pointer' : 'not-allowed', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
          ENTER THE MARKET →
        </button>
      </div>
    </div>
  );
}
