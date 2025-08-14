import React from 'react';
import Icon from '../../../components/AppIcon';

const DemoSidebar = ({ activeView, onViewChange, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'transactions', label: 'Transactions', icon: 'Receipt' },
    { id: 'credit-score', label: 'Credit Score', icon: 'TrendingUp' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  return (
    <aside className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Icon 
            name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
            size={20} 
            color="var(--color-muted-foreground)"
          />
        </button>
      </div>
      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems?.map((item) => (
          <button
            key={item?.id}
            onClick={() => onViewChange(item?.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeView === item?.id
                ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon 
              name={item?.icon} 
              size={20} 
              color={activeView === item?.id ? 'var(--color-primary)' : 'currentColor'}
            />
            {!isCollapsed && <span className="font-medium">{item?.label}</span>}
          </button>
        ))}
      </nav>
      {/* Demo Info */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-primary">Demo Data</span>
            </div>
            <p className="text-xs text-primary">
              This dashboard shows simulated MSME transaction data for demonstration purposes.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DemoSidebar;