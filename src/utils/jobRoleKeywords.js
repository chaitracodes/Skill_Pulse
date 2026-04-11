/**
 * SkillPulse — Job Role → Google Trends keyword mapping
 * Google Trends is highly sensitive to exact phrasing.
 * These keywords are tuned to return meaningful job-market interest data.
 */

export const JOB_ROLE_KEYWORDS = {
  // AI / ML
  'ML Engineer':            'machine learning engineer',
  'Data Scientist':         'data scientist',
  'AI Researcher':          'artificial intelligence researcher',
  'Prompt Engineer':        'prompt engineering',
  'MLOps Engineer':         'MLOps',
  'Computer Vision Engineer': 'computer vision engineer',
  'NLP Engineer':           'NLP engineer',
  'AI Product Manager':     'AI product manager',
  'Deep Learning Engineer': 'deep learning engineer',

  // Data
  'Data Engineer':          'data engineer',
  'Data Analyst':           'data analyst',
  'BI Developer':           'business intelligence developer',
  'Analytics Engineer':     'analytics engineer',
  'Quantitative Analyst':   'quantitative analyst',

  // Web / Full Stack
  'Frontend Developer':     'frontend developer',
  'Backend Developer':      'backend developer',
  'Full Stack Developer':   'full stack developer',
  'React Developer':        'React developer',
  'Node.js Developer':      'Node.js developer',
  'Next.js Developer':      'Next.js developer',

  // DevOps / Cloud
  'DevOps Engineer':        'DevOps engineer',
  'Cloud Architect':        'cloud architect',
  'SRE Engineer':           'site reliability engineer',
  'Platform Engineer':      'platform engineer',
  'Kubernetes Engineer':    'Kubernetes engineer',

  // Systems
  'Systems Engineer':       'systems software engineer',
  'Rust Developer':         'Rust programming developer',
  'Go Developer':           'Golang developer',
  'Embedded Engineer':      'embedded systems engineer',

  // Security
  'Security Engineer':      'cybersecurity engineer',
  'Penetration Tester':     'penetration tester',
  'Cloud Security Engineer':'cloud security engineer',

  // Mobile
  'iOS Developer':          'iOS developer',
  'Android Developer':      'Android developer',
  'Flutter Developer':      'Flutter developer',
  'React Native Developer': 'React Native developer',

  // Blockchain
  'Blockchain Developer':   'blockchain developer',
  'Smart Contract Developer':'smart contract developer',
  'Web3 Developer':         'Web3 developer',

  // Product / Design
  'Product Manager':        'product manager',
  'UX Designer':            'UX designer',
  'UI Designer':            'UI designer',

  // Finance
  'Quant Developer':        'quantitative developer',
  'FinTech Engineer':       'fintech engineer',

  // Game
  'Game Developer':         'game developer',
  'Unreal Engine Developer':'Unreal Engine developer',
};

/**
 * Get the Google Trends search keyword for a given job role.
 * Falls back to the role name itself if not in the dictionary.
 */
export function getTrendKeyword(role) {
  return JOB_ROLE_KEYWORDS[role] || role;
}

export const ALL_ROLES = Object.keys(JOB_ROLE_KEYWORDS);
