import React, { useState, useRef } from 'react';

// Dynamic import for PDF.js to avoid build issues since we couldn't npm install it globally safely without PATH
const loadPdfJs = async () => {
  if (!window.pdfjsLib) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    document.body.appendChild(script);
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for load
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  return window.pdfjsLib;
};

export default function LandingView({ onNavigate, onResumeParsed }) {
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  const extractPdfText = async (file) => {
    const pdfjsLib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(s => s.str).join(' ') + '\n';
    }
    return fullText.trim();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    try {
      let rawText = '';
      if (file.type === 'application/pdf') {
        rawText = await extractPdfText(file);
      } else {
        rawText = await file.text();
      }

      // Call Claude API
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      if (!apiKey) {
        console.error("Missing VITE_CLAUDE_API_KEY in .env.local! Simulating parse for demo...");
        await new Promise(r => setTimeout(r, 2000));
        // Mocking the parse
        if (onResumeParsed) onResumeParsed(['PYTHON', 'REACT']);
        onNavigate('TERMINAL');
        return;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: "Extract the technical skills from this resume. Output strictly as a JSON array of objects with keys: name (string uppercase), proficiency (0-100), domain (string). No other text.",
          messages: [{ role: 'user', content: `Parse this resume:\n\n${rawText}` }]
        })
      });

      const data = await response.json();
      const extractedSkillsMatch = data.content[0].text.match(/\[.*\]/s);
      
      if (extractedSkillsMatch) {
         const skillsArray = JSON.parse(extractedSkillsMatch[0]);
         const mappedSkills = skillsArray.map(s => s.name);
         if (onResumeParsed) onResumeParsed(mappedSkills);
      }

      onNavigate('TERMINAL');

    } catch (error) {
      console.error('Parsing failed:', error);
      alert('Resume processing failed. Check console or API key.');
      setIsParsing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Grid Background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at 2px 2px, var(--neon-green) 1px, transparent 0)', backgroundSize: '40px 40px', zIndex: 0 }} />

      {/* Top Banner */}
      <div style={{ padding: '32px 64px', display: 'flex', justifyContent: 'space-between', zIndex: 10, borderBottom: '1px solid var(--border-ghost)', backgroundColor: 'rgba(var(--bg-base), 0.8)' }}>
        <div style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '24px', letterSpacing: '0.05em', color: 'var(--neon-cyan)' }}>SkillPulse</div>
        <div style={{ display: 'flex', gap: '32px', fontSize: '10px', color: 'var(--text-muted)' }}>
          <div>NETWORK_STATUS: <span style={{ color: 'var(--neon-green)' }}>ONLINE</span></div>
          <div>ACTIVE_NODES: 2,491</div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontSize: '90px', margin: '0 0 24px 0', lineHeight: '0.9', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            TRADE YOUR<br/><span style={{ color: 'var(--neon-green)', position: 'relative' }}>SKILL EQUITY</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px auto' }}>
            The first institutional-grade dashboard for tokenized human capital. Upload your vectors. Track market liquidity. Execute trades based on real-world aggregate utility.
          </p>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            {isParsing ? (
              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--neon-cyan)', padding: '24px 48px', color: 'var(--neon-cyan)', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--neon-cyan)', opacity: 0.1 }} />
                PARSING RÉSUMÉ...
              </div>
            ) : (
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: 'var(--neon-green)', color: '#000', border: 'none', padding: '24px 48px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", transition: 'transform 0.1s' }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  UPLOAD RÉSUMÉ (PDF)
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".pdf,.txt" 
                  onChange={handleFileUpload} 
                />
                
                <button 
                  onClick={() => onNavigate('TERMINAL')}
                  style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-ghost)', padding: '24px 48px', fontSize: '14px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", backdropFilter: 'blur(10px)' }}
                  onMouseOver={(e) => e.target.style.borderColor = 'var(--neon-cyan)'}
                  onMouseOut={(e) => e.target.style.borderColor = 'var(--border-ghost)'}
                >
                  MANUAL ONBOARDING
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
