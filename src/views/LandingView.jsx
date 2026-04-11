import React, { useState, useRef } from 'react';

const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Cloud Architect', 'Data Scientist',
  'Data Engineer', 'Machine Learning Engineer', 'Systems Programmer',
  'Cybersecurity Analyst', 'Product Manager', 'Mobile App Developer'
];

const ROLE_SKILLS = {
  'Frontend Developer': [
    { name: 'JavaScript', trend: '→' }, { name: 'TypeScript', trend: '↑' }, { name: 'React', trend: '→' },
    { name: 'Next.js', trend: '↑' }, { name: 'Tailwind CSS', trend: '↑' }, { name: 'Vue.js', trend: '→' },
    { name: 'CSS', trend: '→' }, { name: 'Figma', trend: '↑' }, { name: 'GraphQL', trend: '→' }
  ],
  'Backend Developer': [
    { name: 'Node.js', trend: '→' }, { name: 'Python', trend: '↑' }, { name: 'Go', trend: '↑' },
    { name: 'Java', trend: '→' }, { name: 'PostgreSQL', trend: '→' }, { name: 'MongoDB', trend: '→' },
    { name: 'Redis', trend: '↑' }, { name: 'Docker', trend: '↑' }, { name: 'REST APIs', trend: '→' }
  ],
  'Full Stack Developer': [
    { name: 'TypeScript', trend: '↑' }, { name: 'React', trend: '→' }, { name: 'Node.js', trend: '→' },
    { name: 'PostgreSQL', trend: '→' }, { name: 'Docker', trend: '↑' }, { name: 'AWS', trend: '→' },
    { name: 'Next.js', trend: '↑' }, { name: 'Redis', trend: '↑' }, { name: 'Prisma', trend: '↑' }
  ],
  'DevOps Engineer': [
    { name: 'Docker', trend: '→' }, { name: 'Kubernetes', trend: '↑' }, { name: 'Terraform', trend: '↑' },
    { name: 'AWS', trend: '→' }, { name: 'GitHub Actions', trend: '↑' }, { name: 'Linux', trend: '→' },
    { name: 'Ansible', trend: '→' }, { name: 'Prometheus', trend: '↑' }, { name: 'Bash', trend: '→' }
  ],
  'Cloud Architect': [
    { name: 'AWS', trend: '→' }, { name: 'Azure', trend: '↑' }, { name: 'GCP', trend: '↑' },
    { name: 'Terraform', trend: '↑' }, { name: 'Kubernetes', trend: '↑' }, { name: 'Serverless', trend: '↑' },
    { name: 'Security', trend: '↑' }, { name: 'Networking', trend: '→' }
  ],
  'Data Scientist': [
    { name: 'Python', trend: '↑' }, { name: 'SQL', trend: '→' }, { name: 'Pandas', trend: '→' },
    { name: 'Scikit-learn', trend: '→' }, { name: 'PyTorch', trend: '↑' }, { name: 'TensorFlow', trend: '→' },
    { name: 'Jupyter', trend: '→' }, { name: 'Statistics', trend: '→' }, { name: 'A/B Testing', trend: '↑' }
  ],
  'Data Engineer': [
    { name: 'Python', trend: '↑' }, { name: 'SQL', trend: '→' }, { name: 'Apache Spark', trend: '→' },
    { name: 'Airflow', trend: '→' }, { name: 'Kafka', trend: '↑' }, { name: 'Snowflake', trend: '↑' },
    { name: 'dbt', trend: '↑' }, { name: 'Docker', trend: '↑' }, { name: 'BigQuery', trend: '↑' }
  ],
  'Machine Learning Engineer': [
    { name: 'Python', trend: '↑' }, { name: 'PyTorch', trend: '↑' }, { name: 'TensorFlow', trend: '→' },
    { name: 'CUDA', trend: '↑' }, { name: 'MLflow', trend: '↑' }, { name: 'LangChain', trend: '↑' },
    { name: 'Vector DBs', trend: '↑' }, { name: 'Docker', trend: '↑' }, { name: 'HuggingFace', trend: '↑' }
  ],
  'Systems Programmer': [
    { name: 'C', trend: '→' }, { name: 'C++', trend: '→' }, { name: 'Rust', trend: '↑' },
    { name: 'Go', trend: '↑' }, { name: 'Linux Kernel', trend: '→' }, { name: 'Zig', trend: '↑' },
    { name: 'WASM', trend: '↑' }
  ],
  'Cybersecurity Analyst': [
    { name: 'Linux', trend: '→' }, { name: 'Networking', trend: '→' }, { name: 'Python', trend: '↑' },
    { name: 'Wireshark', trend: '→' }, { name: 'OSINT', trend: '↑' }, { name: 'Pen Testing', trend: '↑' },
    { name: 'Cloud Security', trend: '↑' }
  ],
  'Product Manager': [
    { name: 'Agile/Scrum', trend: '→' }, { name: 'SQL', trend: '↑' }, { name: 'Figma', trend: '↑' },
    { name: 'Jira', trend: '→' }, { name: 'A/B Testing', trend: '↑' }, { name: 'Roadmapping', trend: '→' },
    { name: 'Data Analytics', trend: '↑' }
  ],
  'Mobile App Developer': [
    { name: 'React Native', trend: '↑' }, { name: 'Flutter', trend: '↑' }, { name: 'Swift', trend: '→' },
    { name: 'Kotlin', trend: '→' }, { name: 'SwiftUI', trend: '↑' }, { name: 'Jetpack Compose', trend: '↑' },
    { name: 'Firebase', trend: '→' }
  ],
};

export default function LandingView({ onNavigate, onProfileReady }) {
  const [step, setStep] = useState('home');     // home | upload | parsing | domain | skills
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [parseStatus, setParseStatus] = useState('');
  const fileInputRef = useRef(null);

  const skills = ROLE_SKILLS[selectedRole] || [];

  const toggleSkill = (name) =>
    setSelectedSkills(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);

  const addCustomSkill = () => {
    const t = customSkill.trim();
    if (t && !selectedSkills.includes(t)) setSelectedSkills(prev => [...prev, t]);
    setCustomSkill('');
  };

  // ── Resume → Backend AI Analytics ─────────────────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStep('parsing');
    setParseStatus('SENDING TO BACKEND...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setParseStatus('AI PARSING RESUME...');

      const res = await fetch('http://localhost:8000/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`Backend API error ${res.status}`);
      const data = await res.json();

      const parsedRoles = data.resume_data.recommended_roles.map(r => r.role);
      const parsedSkills = data.resume_data.skills;
      
      setParseStatus('GENERATING LEARNING ROADMAP...');
      
      const targetRole = parsedRoles[0] || "Software Engineer";
      
      const roadRes = await fetch('http://localhost:8000/api/learning-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: targetRole, known_skills: parsedSkills })
      });
      
      const roadData = await roadRes.json();

      setParseStatus('DONE ✓');
      await new Promise(r => setTimeout(r, 400));
      
      if (onProfileReady) {
        onProfileReady({ 
          targetRoles: parsedRoles, 
          knownSkills: parsedSkills, 
          recommendedSkills: roadData.missing,
          roadmapData: roadData
        });
      }
      onNavigate('TERMINAL');

    } catch (err) {
      console.error(err);
      setParseStatus(`ERROR: ${err.message}`);
      // Show error for longer (4s) so user can read it
      await new Promise(r => setTimeout(r, 4000));
      setStep('home');
    }
  };

  // ── Manual onboarding final step ────────────────────────────────────────────
  const enterMarket = async () => {
    setStep('parsing');
    setParseStatus('AI GENERATING ROADMAP...');
    try {
      const res = await fetch('http://localhost:8000/api/learning-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: selectedRole, known_skills: selectedSkills })
      });
      const data = await res.json();
      
      if (onProfileReady) {
        onProfileReady({ 
          targetRoles: [selectedRole], 
          knownSkills: selectedSkills,
          recommendedSkills: data.missing,
          roadmapData: data
        });
      }
      onNavigate('TERMINAL');
    } catch (err) {
      console.error(err);
      setParseStatus(`ERROR: ${err.message}`);
      await new Promise(r => setTimeout(r, 2000));
      setStep('home');
    }
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
                    Select your Target Job Role and pick skills you know.
                  </div>
                </div>
                <div style={{ backgroundColor: 'transparent', color: '#00D4FF', border: '1px solid #00D4FF', padding: '12px 28px', fontSize: '11px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>
                  SELECT JOB ROLE →
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
          <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '36px', margin: '0 0 8px' }}>TARGET JOB ROLE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '32px' }}>Your intended primary career role.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {JOB_ROLES.map(d => (
              <div key={d} onClick={() => setSelectedRole(d)}
                style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', borderLeft: selectedRole === d ? '3px solid #00FF88' : '3px solid transparent', padding: '15px 18px', cursor: 'pointer', color: selectedRole === d ? '#00FF88' : 'var(--text-main)', fontSize: '13px', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between' }}>
                <span>{d}</span>
                {selectedRole === d && <span>›</span>}
              </div>
            ))}
          </div>
          <button onClick={() => selectedRole && setStep('skills')} disabled={!selectedRole}
            style={{ marginTop: '28px', width: '100%', padding: '18px', background: selectedRole ? '#00FF88' : 'var(--bg-surface-elevated)', color: selectedRole ? '#000' : 'var(--text-muted)', border: 'none', fontWeight: '700', fontSize: '13px', cursor: selectedRole ? 'pointer' : 'not-allowed', fontFamily: "'JetBrains Mono', monospace" }}>
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
        <button onClick={() => setStep('domain')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>TARGET JOB</button>
        <span style={{ color: 'var(--border-ghost)' }}>/</span>
        <span style={{ color: '#00FF88', fontSize: '11px' }}>{selectedRole.toUpperCase()}</span>
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
            placeholder="Add a custom skill..." style={{ flex: 1, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-ghost)', color: 'var(--text-main)', padding: '12px 14px', fontSize: '12px', outline: 'none', fontFamily: "'JetBrains Mono', monospace" }} />
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
