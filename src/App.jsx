import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import LandingView from './views/LandingView';
import TerminalView from './views/TerminalView';
import PortfolioView from './views/PortfolioView'; // This is technically the Learning Hub design
import NewsView from './views/NewsView';
import RoadmapView from './views/RoadmapView';
import StakingView from './views/StakingView';
import DeepDiveView from './views/DeepDiveView';

function App() {
  const [currentRoute, setCurrentRoute] = useState('LANDING');

  const handleNavigate = (route) => {
    setCurrentRoute(route);
  };

  const handleDeepDive = (assetId) => {
    // When clicking an asset in the Watchlist inside TerminalView
    setCurrentRoute('DEEP_DIVE');
  };

  const renderView = () => {
    switch (currentRoute) {
      case 'LIQUIDITY':
        return <StakingView />;
      case 'LANDING':
        return <LandingView onNavigate={handleNavigate} />;
      case 'DASHBOARD':
      case 'TERMINAL':
        return <TerminalView onDeepDive={handleDeepDive} />;
      case 'LEARNING_HUB':
        return <PortfolioView />;
      case 'MARKETS':
        return <NewsView />;
      case 'STAKING':
        return <StakingView />;
      case 'ROADMAP': // Access via links or alternate flows
        return <RoadmapView />;
      case 'DEEP_DIVE':
        return <DeepDiveView />;
      default:
        return <LandingView onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Sidebar activedTab={currentRoute} onNavigate={handleNavigate} />
      {currentRoute !== 'LANDING' && <TopNav activeRoute={currentRoute} onNavigate={handleNavigate} />}
      {renderView()}
    </>
  );
}

export default App;
