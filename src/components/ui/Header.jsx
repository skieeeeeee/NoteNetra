import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Logo from './Logo';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', path: '/landing-page', icon: 'Home' },
    { label: 'Features', path: '/features-page', icon: 'Zap' },
    { label: 'Pricing', path: '/pricing-page', icon: 'DollarSign' },
    { label: 'Demo', path: '/dashboard-demo', icon: 'Monitor' },
    { label: 'Contact', path: '/contact-page', icon: 'MessageCircle' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-navigation transition-smooth ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-sm shadow-card border-b border-border' 
            : 'bg-background'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 nav-spacing">
            {/* Logo */}
            <Logo showText />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-micro hover:text-primary ${
                    isActivePath(item?.path)
                      ? 'text-primary' :'text-foreground hover:text-primary'
                  }`}
                >
                  {item?.label}
                  {isActivePath(item?.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/login-page'}
                iconName="LogIn"
                iconPosition="left"
                className="transition-micro hover-lift"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = '/register-page'}
                iconName="UserPlus"
                iconPosition="left"
                className="transition-micro hover-lift"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
              aria-label="Toggle mobile menu"
            >
              <Icon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-mobile-menu md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
          
          <div 
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-card shadow-interactive animate-slide-in-right"
            onClick={(e) => e?.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo showText />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-micro ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    color={isActivePath(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                    strokeWidth={2}
                  />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="p-4 space-y-3 border-t border-border mt-auto">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  window.location.href = '/login-page';
                  setIsMobileMenuOpen(false);
                }}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  window.location.href = '/register-page';
                  setIsMobileMenuOpen(false);
                }}
                iconName="UserPlus"
                iconPosition="left"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;