import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('revenue');

  const periodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const reportOptions = [
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'transactions', label: 'Transaction Trends' },
    { value: 'customers', label: 'Customer Insights' },
    { value: 'credit', label: 'Credit Performance' }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 185000, target: 200000, growth: 8.5 },
    { month: 'Feb', revenue: 195000, target: 210000, growth: 5.4 },
    { month: 'Mar', revenue: 210000, target: 220000, growth: 7.7 },
    { month: 'Apr', revenue: 225000, target: 230000, growth: 7.1 },
    { month: 'May', revenue: 240000, target: 240000, growth: 6.7 },
    { month: 'Jun', revenue: 245680, target: 250000, growth: 2.4 }
  ];

  const categoryBreakdown = [
    { category: 'Electronics', amount: 89500, percentage: 36.4, color: 'var(--color-primary)' },
    { category: 'Groceries', amount: 62300, percentage: 25.4, color: 'var(--color-green-500)' },
    { category: 'Clothing', amount: 45200, percentage: 18.4, color: 'var(--color-yellow-500)' },
    { category: 'Hardware', amount: 28400, percentage: 11.6, color: 'var(--color-accent)' },
    { category: 'Others', amount: 20280, percentage: 8.2, color: '#EF4444' }
  ];

  const customerMetrics = [
    { metric: 'New Customers', value: 47, change: '+12%', icon: 'UserPlus', color: 'text-green-500' },
    { metric: 'Returning Customers', value: 156, change: '+8%', icon: 'Users', color: 'text-primary' },
    { metric: 'Average Order Value', value: '₹1,970', change: '+15%', icon: 'ShoppingCart', color: 'text-accent' },
    { metric: 'Customer Retention', value: '78%', change: '+5%', icon: 'Heart', color: 'text-pink-500' }
  ];

  const topProducts = [
    { name: 'Mobile Chargers', sales: 145, revenue: 43500, trend: 'up' },
    { name: 'Rice (25kg)', sales: 89, revenue: 35600, trend: 'up' },
    { name: 'Cotton Shirts', sales: 67, revenue: 26800, trend: 'down' },
    { name: 'LED Bulbs', sales: 234, revenue: 23400, trend: 'up' },
    { name: 'Cooking Oil (5L)', sales: 78, revenue: 19500, trend: 'stable' }
  ];

  const creditMetrics = [
    { month: 'Jan', score: 680, loanEligibility: 650000 },
    { month: 'Feb', score: 695, loanEligibility: 700000 },
    { month: 'Mar', score: 710, loanEligibility: 750000 },
    { month: 'Apr', score: 725, loanEligibility: 800000 },
    { month: 'May', score: 735, loanEligibility: 825000 },
    { month: 'Jun', score: 742, loanEligibility: 850000 }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Report Controls */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Business Reports</h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => alert('Export functionality would be implemented here')}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              iconName="Share"
              iconPosition="left"
              onClick={() => alert('Share functionality would be implemented here')}
            >
              Share Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Report Type"
            options={reportOptions}
            value={selectedReport}
            onChange={setSelectedReport}
          />
          
          <Select
            label="Time Period"
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </div>
      </div>
      {/* Revenue Performance */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Revenue Performance</h3>
          <div className="flex items-center space-x-2 text-sm text-green-500 font-medium">
            <Icon name="TrendingUp" size={16} />
            <span>+32.8% vs last period</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="DollarSign" size={24} className="text-primary" />
              <div>
                <p className="text-sm text-primary">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">₹14,55,680</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Target" size={24} className="text-green-500" />
              <div>
                <p className="text-sm text-green-500">Target Achievement</p>
                <p className="text-2xl font-bold text-green-500">98.2%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={24} className="text-accent" />
              <div>
                <p className="text-sm text-accent">Growth Rate</p>
                <p className="text-2xl font-bold text-accent">+6.2%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value?.toLocaleString('en-IN')}` : `₹${value?.toLocaleString('en-IN')}`,
                  name === 'revenue' ? 'Actual Revenue' : 'Target'
                ]}
                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Category Analysis & Customer Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-card rounded-xl border border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue by Category</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="amount"
                >
                  {categoryBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value?.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoryBreakdown?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category?.color }}
                  />
                  <span className="text-sm text-muted-foreground">{category?.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">₹{category?.amount?.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-muted-foreground">{category?.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-card rounded-xl border border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Customer Insights</h3>
          <div className="space-y-4">
            {customerMetrics?.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center">
                    <Icon name={metric?.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{metric?.metric}</p>
                    <p className="text-xl font-bold text-foreground">{metric?.value}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${metric?.color} font-medium`}>
                  <Icon name="TrendingUp" size={16} />
                  <span className="text-sm">{metric?.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Products */}
      <div className="bg-card rounded-xl border border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Units Sold</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Revenue</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts?.map((product, index) => (
                <tr key={index} className="border-b border hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium text-foreground">{product?.name}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{product?.sales}</td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">
                    ₹{product?.revenue?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Icon 
                      name={getTrendIcon(product?.trend)} 
                      size={16} 
                      className={getTrendColor(product?.trend)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Credit Performance */}
      <div className="bg-card rounded-xl border border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Credit Score & Loan Eligibility Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={creditMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="#FFFFFF" />
              <YAxis yAxisId="left" stroke="#FFFFFF" />
              <YAxis yAxisId="right" orientation="right" stroke="#FFFFFF" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'score' ? value : `₹${value?.toLocaleString('en-IN')}`,
                  name === 'score' ? 'Credit Score' : 'Loan Eligibility'
                ]}
                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="score" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="loanEligibility" 
                stroke="var(--color-green-500)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-green-500)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Credit Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Loan Eligibility (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;