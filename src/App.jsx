import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import LandingView from './views/LandingView';
import TerminalView from './views/TerminalView';
import PortfolioView from './views/PortfolioView';
import LearningHubView from './views/LearningHubView';
import NewsView from './views/NewsView';
import ProfileView from './views/ProfileView';
import ProjectTrackerView from './views/ProjectTrackerView';
import AuthView from './views/AuthView';
import { supabase } from './utils/supabase';

/**
 * App component: Root interface for the SkillPulse Application.
 * 
 * Manages global view routing, user profile state (watchlists, known skills), 
 * and active learning hub data. Renders the TopNav, and dynamically 
 * injects the active View component.
 * 
 * @returns {JSX.Element} The rendered React application.
 */
function App() {
  const [session, setSession] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('LANDING');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Watchlists & User State
  const [knownSkills, setKnownSkills] = useState([]);
  const [watchlist1, setWatchlist1] = useState([]); // Target Jobs (e.g. Frontend Developer)
  const [watchlist2, setWatchlist2] = useState([]); // Job Search Watchlist
  const [watchlist3, setWatchlist3] = useState([]); // User-curated custom skills

  // Learning Hub State
  const [activeLearningJob, setActiveLearningJob] = useState("");
  const [learningRoadmap, setLearningRoadmap] = useState(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState([]); // Global array of checked off skills

  const handleNavigate = (route) => setCurrentRoute(route);

  const handleGetJobReady = (jobRole) => {
    setActiveLearningJob(jobRole);
    setCurrentRoute('LEARNING_HUB');
  };

  const [projectPlanData, setProjectPlanData] = useState(null);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);

  const handleInitializeProject = async () => {
    setCurrentRoute('PROJECT_TRACKER');
    if (projectPlanData) return; // already loaded

    setIsGeneratingProject(true);
    try {
      const role = activeLearningJob || (watchlist1.length > 0 ? watchlist1[0] : 'Software Engineer');
      const api_base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${api_base}/api/project-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: role, skills: knownSkills })
      });
      const data = await res.json();
      setProjectPlanData(data);
    } catch (err) {
      console.error("Failed to generate plan", err);
      setProjectPlanData({ project_name: 'Generation Failed', description: 'Ensure the API is running.', timeline: [] });
    } finally {
      setIsGeneratingProject(false);
    }
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
            onGetJobReady={handleGetJobReady}
            watchlist1={watchlist1}
            watchlist2={watchlist2}
            watchlist3={watchlist3}
            setWatchlist2={setWatchlist2}
            setWatchlist3={setWatchlist3}
          />
        );
      case 'LEARNING_HUB':
        return (
          <LearningHubView
            jobRole={activeLearningJob}
            knownSkills={knownSkills}
            roadmap={learningRoadmap}
            completedCheckpoints={completedCheckpoints}
            setCompletedCheckpoints={setCompletedCheckpoints}
            onInitializeProject={handleInitializeProject}
          />
        );
      case 'MARKETS':
        return <NewsView />;
      case 'PROJECT_TRACKER':
        return (
          <ProjectTrackerView
            projectData={projectPlanData}
            isGenerating={isGeneratingProject}
          />
        );
      case 'PROFILE':
        return (
          <ProfileView
            knownSkills={knownSkills}
            completedCheckpoints={completedCheckpoints}
          />
        );
      default:
        return <LandingView onNavigate={handleNavigate} onProfileReady={handleProfileReady} />;
    }
  };

  if (!session) {
    return <AuthView />;
  }

  return (
    <>
      {currentRoute !== 'LANDING' && (
        <TopNav activeRoute={currentRoute} onNavigate={handleNavigate} user={session?.user} />
      )}
      {renderView()}
    </>
  );
}

export default App;
