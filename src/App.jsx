import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import LandingView from './views/LandingView';
import TerminalView from './views/TerminalView';
import PortfolioView from './views/PortfolioView';
import NewsView from './views/NewsView';
import StakingView from './views/StakingView';
import DeepDiveView from './views/DeepDiveView';
import ProfileView from './views/ProfileView';

function App() {
  const [currentRoute, setCurrentRoute] = useState('LANDING');
  const [activeDeepDive, setActiveDeepDive] = useState('Python');

  // Three watchlists
  const [watchlist1, setWatchlist1] = useState([]); // AI-predicted job roles from résumé
  const [watchlist2, setWatchlist2] = useState([]); // User-curated list 2
  const [watchlist3, setWatchlist3] = useState([]); // User-curated list 3

  const handleNavigate = (route) => setCurrentRoute(route);

  const handleDeepDive = (assetId) => {
    setActiveDeepDive(assetId);
    setCurrentRoute('DEEP_DIVE');
  };

  // Called by LandingView after résumé parse or manual onboarding
  const handleProfileReady = ({ predictedRoles = [], skills = [] }) => {
    if (predictedRoles.length > 0) {
      setWatchlist1(predictedRoles);
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
      case 'DEEP_DIVE':
        return (
          <DeepDiveView
            assetId={activeDeepDive}
            watchlist={watchlist1}
            toggleWatchlist={(id) =>
              setWatchlist1(prev =>
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
              )
            }
          />
        );
      case 'PROFILE':
        return <ProfileView watchlist={watchlist1} />;
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
