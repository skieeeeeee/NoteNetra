import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoHeader from './components/DemoHeader';
import DemoSidebar from './components/DemoSidebar';
import OverviewView from './components/OverviewView';
import TransactionsView from './components/TransactionsView';
import CreditScoreView from './components/CreditScoreView';
import ReportsView from './components/ReportsView';
import GuidedTour from './components/GuidedTour';
import MobileBottomNav from './components/MobileBottomNav';

const DashboardDemo = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading for demo effect
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Auto-start tour for first-time visitors
    const hasSeenTour = localStorage.getItem('noteNetra-demo-tour-seen');
    if (!hasSeenTour) {
      setTimeout(() => {
        setShowGuidedTour(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleExitDemo = () => {
    navigate('/landing-page');
  };

  const handleStartTour = () => {
    setShowGuidedTour(true);
  };

  const handleTourComplete = () => {
    localStorage.setItem('noteNetra-demo-tour-seen', 'true');
    setShowGuidedTour(false);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'transactions':
        return <TransactionsView />;
      case 'credit-score':
        return <CreditScoreView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <OverviewView />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded animate-spin"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading NoteNetra Dashboard</h2>
          <p className="text-muted-foreground">Preparing your demo experience...</p>
          <div className="w-64 bg-muted rounded-full h-2 mx-auto mt-4">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Demo Header */}
      <DemoHeader 
        onExitDemo={handleExitDemo}
        onStartTour={handleStartTour}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DemoSidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${isMobile ? 'pb-16' : ''}`}>
          <div className="min-h-full">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeView={activeView}
        onViewChange={handleViewChange}
        isVisible={isMobile}
      />

      {/* Guided Tour */}
      <GuidedTour
        isActive={showGuidedTour}
        onClose={() => setShowGuidedTour(false)}
        onComplete={handleTourComplete}
      />

      {/* Demo Exit Prompt (Optional Enhancement) */}
      {activeView === 'overview' && (
        <div className="fixed bottom-4 right-4 z-30 hidden lg:block">
          <div className="bg-card rounded-lg shadow-lg border border p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  Enjoying the demo?
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  See how NoteNetra can transform your business with real transaction data.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate('/contact-page')}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Order Device
                  </button>
                  <button
                    onClick={() => setShowGuidedTour(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDemo;