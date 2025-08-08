import React from 'react';
import { Link } from 'react-router-dom';


const Logo = ({ variant = 'default', className = '', showText = true }) => {
  const LogoIcon = () => (
    <div className="relative">
      {/* Main logo container with gradient background */}
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md transition-micro group-hover:scale-105">
        {/* Abstract tech symbol - stylized 'N' with modern geometric design */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path 
            d="M4 20V4L14 14V4H20V20L10 10V20H4Z" 
            fill="currentColor" 
            stroke="currentColor" 
            strokeWidth="0.5"
          />
        </svg>
      </div>
      {/* Subtle accent dot for tech feel */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full opacity-80"></div>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <Link to="/landing-page" className={`group ${className}`}>
        <LogoIcon />
      </Link>
    );
  }

  return (
    <Link to="/landing-page" className={`flex items-center space-x-3 group ${className}`}>
      <LogoIcon />
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-foreground tracking-tight">
            NoteNetra
          </span>
          <span className="text-xs text-muted-foreground -mt-1 font-medium">
            Smart Finance Hub
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;