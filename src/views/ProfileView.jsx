import React, { useState } from 'react';

const DOMAINS = ['AI/ML', 'Web Development', 'DevOps & Cloud', 'Data Engineering', 'Systems Programming', 'Cybersecurity'];

const ROLES = [
  'ML Engineer', 'Data Scientist', 'Prompt Engineer', 'AI Researcher',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Cloud Architect', 'SRE Engineer',
  'Data Analyst', 'Data Engineer', 'BI Developer',
  'Blockchain Developer', 'Smart Contract Auditor',
  'iOS Developer', 'Android Developer',
  'Security Engineer', 'Penetration Tester',
  'Product Manager', 'UX Designer', 'Game Developer',
];

const ROLE_REQUIREMENTS = {
  'ML Engineer': ['Python', 'PyTorch', 'TensorFlow', 'MLflow', 'SQL', 'Docker', 'CUDA', 'Statistics', 'Feature Engineering', 'Scikit-learn'],
  'Data Scientist': ['Python', 'Statistics', 'Pandas', 'Scikit-learn', 'SQL', 'Visualization', 'A/B Testing', 'Jupyter', 'Probability'],
  'Prompt Engineer': ['LangChain', 'Python', 'RAG Systems', 'Vector Databases', 'Fine-tuning LLMs', 'API Integration', 'HuggingFace'],
  'Frontend Developer': ['TypeScript', 'React', 'Next.js', 'CSS', 'Figma', 'GraphQL', 'Vite', 'Testing', 'Accessibility'],
  'Full Stack Developer': ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'GraphQL', 'AWS', 'Testing'],
  'DevOps Engineer': ['Kubernetes', 'Terraform', 'Docker', 'AWS', 'Bash', 'CI/CD', 'Ansible', 'Linux', 'Prometheus'],
  'Data Engineer': ['Python', 'Apache Spark', 'SQL', 'Kafka', 'Airflow', 'dbt', 'Snowflake', 'Docker', 'BigQuery'],
  'Cloud Architect': ['AWS', 'GCP', 'Azure', 'Terraform', 'Kubernetes', 'Security', 'Networking', 'Cost Optimization'],
};

export default function ProfileView({ watchlist = [] }) {
  const [domain, setDomain] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapResult, setGapResult] = useState(null);

  const filteredRoles = ROLES.filter(r => r.toLowerCase().includes(roleSearch.toLowerCase()));

  const runGapAnalysis = async () => {
    if (!domain || !selectedRole) return;
    setIsAnalyzing(true);
    setGapResult(null);

    try {
      const requirements = ROLE_REQUIREMENTS[selectedRole] || ['Python', 'Communication', 'Problem Solving', 'SQL', 'Git'];
      const userSkills = watchlist.length > 0 ? watchlist : ['PYTHON', 'TYPESCRIPT'];
      const normalizedUser = userSkills.map(s => s.toUpperCase());
      const normalizedReqs = requirements.map(r => r.toUpperCase());
      const matched = requirements.filter(r => normalizedUser.includes(r.toUpperCase()));
      const missing = requirements.filter(r => !normalizedUser.includes(r.toUpperCase()));
      const score = Math.round((matched.length / requirements.length) * 100);

      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

      if (apiKey) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 300,
            system: "You are a career advisor. Give a 3-sentence recommendation. Be concise, specific, and use technical language. No markdown, no lists — plain paragraph only.",
            messages: [{
              role: 'user',
              content: `User skills: ${userSkills.join(', ')}. Target role: ${selectedRole} in ${domain}. Missing skills: ${missing.join(', ')}. Write a 3-sentence recommendation.`
            }]
          })
        });
        const data = await res.json();
        setGapResult({ score, matched, missing, recommendation: data.content[0].text });
      } else {
        // Fallback mock recommendation
        await new Promise(r => setTimeout(r, 1200));
        setGapResult({
          score,
          matched,
          missing,
          recommendation: `Your current skill stack shows a ${score}% alignment with the ${selectedRole} role in ${domain}. To close the gap, prioritize mastering ${missing.slice(0, 3).join(', ')} — these are tier-1 requirements for most hiring mandates in this domain. Consider building a project that integrates ${missing[0] || 'these skills'} with your existing ${matched[0] || 'toolkit'} to demonstrate practical application.`
        });
      }
    } catch (e) {
      console.error(e);
      setGapResult({ score: 0, matched: [], missing: [], recommendation: 'Analysis failed. Check your API key configuration.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate roadmap from watchlist
  const roadmapWeeks = watchlist.slice(0, 6).map((skill, i) => ({
    week: i + 1,
    skill,
    status: i === 0 ? 'active' : i < 2 ? 'done' : 'upcoming',
    task: i === 0 ? 'Deep dive fundamentals & build a project' : i < 2 ? 'Completed foundation modules' : 'Unlock after previous milestone',
  }));

  return (
    <div style={{ marginLeft: '80px', padding: '48px 64px', minHeight: 'calc(100vh - 60px)', maxWidth: '1100px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>USER_NODE // PROFILE_V1</div>
        <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '56px', margin: 0 }}>PROFILE</h1>
      </div>

      {/* ── Skill Inventory ── */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '20px', borderLeft: '2px solid #00FF88', paddingLeft: '12px' }}>SKILL_INVENTORY</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {(watchlist.length > 0 ? watchlist : ['PYTHON', 'TYPESCRIPT', 'RUST', 'GOLANG']).map(skill => (
            <span key={skill} style={{ backgroundColor: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', padding: '8px 16px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ── Skill Gap Analysis ── */}
      <section style={{ marginBottom: '64px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-ghost)', padding: '40px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', borderLeft: '2px solid #00D4FF', paddingLeft: '12px' }}>SKILL_GAP_ANALYSIS</div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '28px', marginBottom: '32px' }}>COMPARE TO ROLE REQUIREMENTS</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Domain */}
          <div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>TARGET_DOMAIN</div>
            <select
              value={domain}
              onChange={e => setDomain(e.target.value)}
              style={{ width: '100%', backgroundColor: '#111111', border: '1px solid #1F1F1F', color: '#F0F0F0', padding: '14px 16px', fontSize: '12px', outline: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}
            >
              <option value="">-- Select Domain --</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Role searchable dropdown */}
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>COMPANY_ROLE</div>
            <input
              type="text"
              value={selectedRole || roleSearch}
              placeholder="Search role..."
              onFocus={() => setShowRoleDropdown(true)}
              onChange={e => { setRoleSearch(e.target.value); setSelectedRole(''); setShowRoleDropdown(true); }}
              style={{ width: '100%', backgroundColor: '#111111', border: '1px solid #1F1F1F', color: '#F0F0F0', padding: '14px 16px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: "'JetBrains Mono', monospace" }}
            />
            {showRoleDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#111111', border: '1px solid #1F1F1F', zIndex: 50, maxHeight: '200px', overflowY: 'auto' }}>
                {filteredRoles.map(r => (
                  <div
                    key={r}
                    onMouseDown={() => { setSelectedRole(r); setRoleSearch(r); setShowRoleDropdown(false); }}
                    style={{ padding: '12px 16px', fontSize: '12px', color: selectedRole === r ? '#00FF88' : '#F0F0F0', cursor: 'pointer', borderLeft: selectedRole === r ? '2px solid #00FF88' : '2px solid transparent' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={runGapAnalysis}
          disabled={!domain || !selectedRole || isAnalyzing}
          style={{
            backgroundColor: domain && selectedRole ? '#00FF88' : 'var(--bg-surface-elevated)',
            color: domain && selectedRole ? '#000' : 'var(--text-muted)',
            border: 'none', padding: '16px 40px', fontSize: '12px', fontWeight: '700',
            cursor: domain && selectedRole ? 'pointer' : 'not-allowed',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
            marginBottom: gapResult || isAnalyzing ? '32px' : 0, transition: 'all 0.2s'
          }}
        >
          {isAnalyzing ? 'ANALYZING...' : 'ANALYZE GAP →'}
        </button>

        {gapResult && (
          <div style={{ borderTop: '1px solid var(--border-ghost)', paddingTop: '32px' }}>
            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '72px', fontWeight: '700', lineHeight: 1, color: gapResult.score >= 70 ? '#00FF88' : gapResult.score >= 40 ? '#F5A623' : '#FF4444', fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif" }}>
                  {gapResult.score}%
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>COMPATIBILITY</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${gapResult.score}%`, height: '100%', backgroundColor: gapResult.score >= 70 ? '#00FF88' : gapResult.score >= 40 ? '#F5A623' : '#FF4444', transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {gapResult.matched.length} of {gapResult.matched.length + gapResult.missing.length} required skills matched
                </div>
              </div>
            </div>

            {/* Matched */}
            {gapResult.matched.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '9px', color: '#00FF88', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>SKILLS_MATCHED ✓</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {gapResult.matched.map(s => (
                    <span key={s} style={{ backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.4)', color: '#00FF88', padding: '6px 12px', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing */}
            {gapResult.missing.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '9px', color: '#FF4444', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace" }}>SKILLS_MISSING ✗</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {gapResult.missing.map(s => (
                    <span key={s} style={{ backgroundColor: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.4)', color: '#FF4444', padding: '6px 12px', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-ghost)', padding: '24px' }}>
              <div style={{ fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>AI_RECOMMENDATION</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>{gapResult.recommendation}</p>
            </div>
          </div>
        )}
      </section>

      {/* ── Learning Roadmap ── */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '24px', borderLeft: '2px solid #00FF88', paddingLeft: '12px' }}>LEARNING_ROADMAP // WEEK_BY_WEEK</div>
        <h2 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '28px', marginBottom: '40px' }}>YOUR SKILL TRAJECTORY</h2>

        {roadmapWeeks.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>Add skills to your watchlist to generate your roadmap.</div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '16px', width: '1px', backgroundColor: 'var(--border-ghost)' }} />

            {roadmapWeeks.map((w, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '36px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Node dot */}
                <div style={{
                  position: 'absolute', left: '-28px', top: '4px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  backgroundColor: w.status === 'done' ? '#00FF88' : w.status === 'active' ? '#00D4FF' : 'var(--bg-surface-elevated)',
                  border: w.status === 'active' ? '2px solid #00D4FF' : '2px solid var(--border-ghost)',
                  boxShadow: w.status === 'active' ? '0 0 10px rgba(0,212,255,0.5)' : 'none',
                }} />

                <div style={{ flex: 1, backgroundColor: w.status === 'active' ? 'rgba(0,212,255,0.05)' : 'var(--bg-surface)', border: `1px solid ${w.status === 'active' ? '#00D4FF' : 'var(--border-ghost)'}`, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>WEEK {String(w.week).padStart(2, '0')}</span>
                      <h3 style={{ fontSize: '18px', margin: '4px 0 0', color: w.status === 'active' ? '#00D4FF' : w.status === 'done' ? '#00FF88' : 'var(--text-muted)' }}>{w.skill}</h3>
                    </div>
                    <span style={{
                      fontSize: '9px', padding: '4px 10px',
                      backgroundColor: w.status === 'done' ? 'rgba(0,255,136,0.1)' : w.status === 'active' ? 'rgba(0,212,255,0.1)' : 'var(--bg-base)',
                      color: w.status === 'done' ? '#00FF88' : w.status === 'active' ? '#00D4FF' : 'var(--text-muted)',
                      border: `1px solid ${w.status === 'done' ? '#00FF88' : w.status === 'active' ? '#00D4FF' : 'var(--border-ghost)'}`,
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {w.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>{w.task}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
