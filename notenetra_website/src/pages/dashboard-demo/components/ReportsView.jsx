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
    { category: 'Electronics', amount: 89500, percentage: 36.4, color: '#3B82F6' },
    { category: 'Groceries', amount: 62300, percentage: 25.4, color: '#10B981' },
    { category: 'Clothing', amount: 45200, percentage: 18.4, color: '#F59E0B' },
    { category: 'Hardware', amount: 28400, percentage: 11.6, color: '#8B5CF6' },
    { category: 'Others', amount: 20280, percentage: 8.2, color: '#EF4444' }
  ];

  const customerMetrics = [
    { metric: 'New Customers', value: 47, change: '+12%', icon: 'UserPlus', color: 'text-green-600' },
    { metric: 'Returning Customers', value: 156, change: '+8%', icon: 'Users', color: 'text-blue-600' },
    { metric: 'Average Order Value', value: '₹1,970', change: '+15%', icon: 'ShoppingCart', color: 'text-purple-600' },
    { metric: 'Customer Retention', value: '78%', change: '+5%', icon: 'Heart', color: 'text-pink-600' }
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
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Business Reports</h2>
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Revenue Performance</h3>
          <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
            <Icon name="TrendingUp" size={16} />
            <span>+32.8% vs last period</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="DollarSign" size={24} color="var(--color-primary)" />
              <div>
                <p className="text-sm text-blue-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-800">₹14,55,680</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Target" size={24} color="var(--color-success)" />
              <div>
                <p className="text-sm text-green-600">Target Achievement</p>
                <p className="text-2xl font-bold text-green-800">98.2%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={24} color="#8B5CF6" />
              <div>
                <p className="text-sm text-purple-600">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-800">+6.2%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value?.toLocaleString('en-IN')}` : `₹${value?.toLocaleString('en-IN')}`,
                  name === 'revenue' ? 'Actual Revenue' : 'Target'
                ]}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Category Analysis & Customer Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue by Category</h3>
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
                <Tooltip formatter={(value) => [`₹${value?.toLocaleString('en-IN')}`, 'Revenue']} />
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
                  <span className="text-sm text-gray-600">{category?.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">₹{category?.amount?.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500">{category?.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Customer Insights</h3>
          <div className="space-y-4">
            {customerMetrics?.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Icon name={metric?.icon} size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{metric?.metric}</p>
                    <p className="text-xl font-bold text-gray-800">{metric?.value}</p>
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Product</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800">Units Sold</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">Revenue</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-800">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts?.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{product?.name}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{product?.sales}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Credit Score & Loan Eligibility Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={creditMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'score' ? value : `₹${value?.toLocaleString('en-IN')}`,
                  name === 'score' ? 'Credit Score' : 'Loan Eligibility'
                ]}
                labelStyle={{ color: '#374151' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="score" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="loanEligibility" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-600">Credit Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Loan Eligibility (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;