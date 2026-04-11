import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import LandingView from './views/LandingView';
import TerminalView from './views/TerminalView';
import PortfolioView from './views/PortfolioView';
import NewsView from './views/NewsView';
import StakingView from './views/StakingView';
import SkillGapView from './views/SkillGapView';
import ProfileView from './views/ProfileView';

function App() {
  const [currentRoute, setCurrentRoute] = useState('LANDING');
  const [activeDeepDive, setActiveDeepDive] = useState('Python');

  // Watchlists & User State
  const [knownSkills, setKnownSkills] = useState([]);
  const [watchlist1, setWatchlist1] = useState([]); // Target Jobs (e.g. Frontend Developer)
  const [watchlist2, setWatchlist2] = useState([]); // Recommended Skills to learn (e.g. Next.js, TypeScript)
  const [watchlist3, setWatchlist3] = useState([]); // User-curated custom skills
  
  // Learning Hub State
  const [activeLearningJob, setActiveLearningJob] = useState("");
  const [learningRoadmap, setLearningRoadmap] = useState(null);

  const handleNavigate = (route) => setCurrentRoute(route);

  // Still firing deep dive for skills
  const handleDeepDive = (assetId) => {
    setActiveDeepDive(assetId);
    setCurrentRoute('SKILL_GAP');
  };
  
  const handleGetJobReady = (jobRole) => {
    setActiveLearningJob(jobRole);
    // In a real flow, if they have multiple Target Jobs causing watchlist1 to have multiple elements, 
    // clicking one might fetch a new roadmap. Since we fetch one on onboarding, we can just navigate.
    setCurrentRoute('PROFILE'); // ProfileView is the Learning Hub Dashboard
  };

  // Called by LandingView after résumé parse or manual onboarding
  const handleProfileReady = ({ targetRoles = [], knownSkills = [], recommendedSkills = [], roadmapData = null }) => {
    if (targetRoles.length > 0) setWatchlist1(targetRoles);
    if (knownSkills.length > 0) setKnownSkills(knownSkills);
    if (recommendedSkills.length > 0) setWatchlist2(recommendedSkills);
    if (roadmapData) setLearningRoadmap(roadmapData);
    
    if (targetRoles.length > 0) {
      setActiveLearningJob(targetRoles[0]);
    }
  };

  const renderView = () => {
    switch (currentRoute) {
      case 'LANDING':
        return (
          <LandingView
            onNavigate={handleNavigate}
            onProfileReady={handleProfileReady}
          />
        );
      case 'DASHBOARD':
      case 'TERMINAL':
        return (
          <TerminalView
            onDeepDive={handleDeepDive}
            onGetJobReady={handleGetJobReady}
            watchlist1={watchlist1}
            watchlist2={watchlist2}
            watchlist3={watchlist3}
            setWatchlist2={setWatchlist2}
            setWatchlist3={setWatchlist3}
          />
        );
      case 'LEARNING_HUB':
        return <PortfolioView />;
      case 'MARKETS':
        return <NewsView />;
      case 'STAKING':
      case 'LIQUIDITY':
        return <StakingView />;
      case 'SKILL_GAP':
        return (
          <SkillGapView
            assetId={activeDeepDive}
            watchlist={watchlist2}
            toggleWatchlist={(id) =>
              setWatchlist2(prev =>
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
              )
            }
          />
        );
      case 'PROFILE': // Serving as the Learning Hub
        return <ProfileView 
                  jobRole={activeLearningJob} 
                  knownSkills={knownSkills} 
                  roadmap={learningRoadmap} 
               />;
      default:
        return <LandingView onNavigate={handleNavigate} onProfileReady={handleProfileReady} />;
    }
  };

  return (
    <>
      <Sidebar activeTab={currentRoute} onNavigate={handleNavigate} />
      {currentRoute !== 'LANDING' && (
        <TopNav activeRoute={currentRoute} onNavigate={handleNavigate} />
      )}
      {renderView()}
    </>
  );
}

export default App;
