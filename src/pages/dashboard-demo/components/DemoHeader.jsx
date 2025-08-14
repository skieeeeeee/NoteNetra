import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { logoutUser } from '../../../utils/firebaseAuth';

const DemoHeader = ({ onExitDemo, onStartTour }) => {
  const { currentUser, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      onExitDemo();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Demo Badge */}
        <div className="flex items-center space-x-4">
          <Link to="/landing-page" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-foreground">NoteNetra</span>
          </Link>
          <div className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-medium">
            <Icon name="Play" size={14} className="inline mr-1" />
            Demo Mode
          </div>
        </div>

        {/* User Info and Controls */}
        <div className="flex items-center space-x-3">
          {/* User Info */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="User" size={16} />
            <span>{userProfile?.businessName || currentUser?.email}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onStartTour}
            iconName="HelpCircle"
            iconPosition="left"
          >
            Take Tour
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            iconName="LogOut"
            iconPosition="left"
          >
            Logout
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location.href = '/contact-page'}
            iconName="ShoppingCart"
            iconPosition="left"
          >
            Order Device
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DemoHeader;