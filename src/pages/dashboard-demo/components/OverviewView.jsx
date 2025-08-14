import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import DeviceStatus from '../../../components/DeviceStatus';

const OverviewView = () => {
  const kpiData = [
    {
      title: "Monthly Revenue",
      value: "₹2,45,680",
      change: "+12.5%",
      trend: "up",
      icon: "TrendingUp",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      title: "Total Transactions",
      value: "1,247",
      change: "+8.3%",
      trend: "up",
      icon: "Receipt",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      title: "Credit Score",
      value: "742",
      change: "+15 pts",
      trend: "up",
      icon: "Award",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    },
    {
      title: "Loan Eligibility",
      value: "₹8,50,000",
      change: "+₹1,20,000",
      trend: "up",
      icon: "Banknote",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 185000, transactions: 890 },
    { month: 'Feb', revenue: 195000, transactions: 920 },
    { month: 'Mar', revenue: 210000, transactions: 1050 },
    { month: 'Apr', revenue: 225000, transactions: 1180 },
    { month: 'May', revenue: 240000, transactions: 1220 },
    { month: 'Jun', revenue: 245680, transactions: 1247 }
  ];

  const paymentMethodData = [
    { name: 'UPI', value: 65, color: 'var(--color-primary)' },
    { name: 'Cash', value: 30, color: 'var(--color-green-500)' },
    { name: 'Card', value: 5, color: 'var(--color-yellow-500)' }
  ];

  const creditScoreHistory = [
    { month: 'Jan', score: 680 },
    { month: 'Feb', score: 695 },
    { month: 'Mar', score: 710 },
    { month: 'Apr', score: 725 },
    { month: 'May', score: 735 },
    { month: 'Jun', score: 742 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData?.map((kpi, index) => (
          <div
            key={index}
            className={`${kpi?.bgColor} ${kpi?.borderColor} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${kpi?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={kpi?.icon} size={24} className={kpi?.color} />
              </div>
              <div className={`flex items-center space-x-1 ${kpi?.color} text-sm font-medium`}>
                <Icon name="TrendingUp" size={16} />
                <span>{kpi?.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi?.title}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-card rounded-xl border border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Calendar" size={16} />
              <span>Last 6 months</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip 
                  formatter={(value) => [`₹${value?.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card rounded-xl border border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="PieChart" size={16} />
              <span>Current month</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {paymentMethodData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {paymentMethodData?.map((method, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: method?.color }}
                />
                <span className="text-sm text-muted-foreground">{method?.name} ({method?.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Credit Score Progress */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Credit Score Progress</h3>
          <div className="flex items-center space-x-2 text-sm text-green-500 font-medium">
            <Icon name="TrendingUp" size={16} />
            <span>+62 points in 6 months</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={creditScoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="#FFFFFF" />
              <YAxis domain={[650, 800]} stroke="#FFFFFF" />
              <Tooltip 
                formatter={(value) => [value, 'Credit Score']}
                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: 'var(--color-accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Status Section */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">ESP32 Device Status</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Wifi" size={16} />
            <span>Real-time monitoring</span>
          </div>
        </div>
        <DeviceStatus />
      </div>
    </div>
  );
};

export default OverviewView;