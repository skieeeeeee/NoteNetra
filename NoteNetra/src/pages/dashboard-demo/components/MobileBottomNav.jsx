import React from 'react';
import Icon from '../../../components/AppIcon';

const MobileBottomNav = ({ activeView, onViewChange, isVisible }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'transactions', label: 'Transactions', icon: 'Receipt' },
    { id: 'credit-score', label: 'Credit', icon: 'TrendingUp' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems?.map((item) => (
          <button
            key={item?.id}
            onClick={() => onViewChange(item?.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeView === item?.id
                ? 'text-blue-600 bg-blue-50' :'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon 
              name={item?.icon} 
              size={20} 
              color={activeView === item?.id ? 'var(--color-primary)' : 'currentColor'}
            />
            <span className="text-xs font-medium">{item?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;