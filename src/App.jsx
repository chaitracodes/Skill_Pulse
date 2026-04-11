import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import LandingView from './views/LandingView';
import TerminalView from './views/TerminalView';
import PortfolioView from './views/PortfolioView'; // Learning Hub
import NewsView from './views/NewsView';
import StakingView from './views/StakingView';
import DeepDiveView from './views/DeepDiveView';
import ProfileView from './views/ProfileView';

function App() {
  const [currentRoute, setCurrentRoute] = useState('LANDING');
  const [activeDeepDive, setActiveDeepDive] = useState('PYTHON');
  const [watchlist, setWatchlist] = useState(['PYTHON', 'TYPESCRIPT', 'RUST', 'GOLANG']);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
  };

  const handleDeepDive = (assetId) => {
    setActiveDeepDive(assetId);
    setCurrentRoute('DEEP_DIVE');
  };

  const toggleWatchlist = (assetId) => {
    setWatchlist(prev =>
      prev.includes(assetId)
        ? prev.filter(a => a !== assetId)
        : [...prev, assetId]
    );
  };

  const renderView = () => {
    switch (currentRoute) {
      case 'LANDING':
        return (
          <LandingView
            onNavigate={handleNavigate}
            onResumeParsed={(skills) => {
              setWatchlist(prev => {
                const newSkills = skills.filter(s => !prev.includes(s));
                return [...prev, ...newSkills];
              });
            }}
          />
        );
      case 'DASHBOARD':
      case 'TERMINAL':
        return <TerminalView onDeepDive={handleDeepDive} watchlist={watchlist} />;
      case 'LEARNING_HUB':
        return <PortfolioView />;
      case 'MARKETS':
        return <NewsView />;
      case 'STAKING':
      case 'LIQUIDITY':
        return <StakingView />;
      case 'DEEP_DIVE':
        return <DeepDiveView assetId={activeDeepDive} watchlist={watchlist} toggleWatchlist={toggleWatchlist} />;
      case 'PROFILE':
        return <ProfileView watchlist={watchlist} />;
      default:
        return <LandingView onNavigate={handleNavigate} onResumeParsed={() => {}} />;
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
