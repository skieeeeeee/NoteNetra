import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const CreditScoreView = () => {
  const currentScore = 742;
  const previousScore = 680;
  const scoreImprovement = currentScore - previousScore;

  const creditHistory = [
    { month: 'Jan 2024', score: 680, factors: 'Initial assessment' },
    { month: 'Feb 2024', score: 695, factors: 'Regular transactions' },
    { month: 'Mar 2024', score: 710, factors: 'Consistent UPI usage' },
    { month: 'Apr 2024', score: 725, factors: 'Diverse payment methods' },
    { month: 'May 2024', score: 735, factors: 'Invoice generation' },
    { month: 'Jun 2024', score: 742, factors: 'Credit utilization' }
  ];

  const loanEligibility = [
    {
      type: 'Working Capital Loan',
      amount: 850000,
      interest: '12.5%',
      tenure: '12 months',
      status: 'eligible',
      icon: 'Briefcase'
    },
    {
      type: 'Equipment Loan',
      amount: 500000,
      interest: '11.8%',
      tenure: '24 months',
      status: 'eligible',
      icon: 'Settings'
    },
    {
      type: 'Business Expansion Loan',
      amount: 1200000,
      interest: '13.2%',
      tenure: '36 months',
      status: 'under-review',
      icon: 'TrendingUp'
    },
    {
      type: 'Emergency Credit Line',
      amount: 300000,
      interest: '15.0%',
      tenure: '6 months',
      status: 'eligible',
      icon: 'Shield'
    }
  ];

  const scoringFactors = [
    {
      factor: 'Transaction Consistency',
      score: 85,
      impact: 'High',
      description: 'Regular daily transactions showing business activity',
      color: 'bg-green-500'
    },
    {
      factor: 'Payment Method Diversity',
      score: 78,
      impact: 'Medium',
      description: 'Using multiple payment methods (UPI, Cash, Cards)',
      color: 'bg-blue-500'
    },
    {
      factor: 'Revenue Growth',
      score: 92,
      impact: 'High',
      description: 'Consistent month-over-month revenue increase',
      color: 'bg-green-500'
    },
    {
      factor: 'Digital Adoption',
      score: 70,
      impact: 'Medium',
      description: 'Active use of digital payment systems',
      color: 'bg-yellow-500'
    },
    {
      factor: 'Business Documentation',
      score: 65,
      impact: 'Low',
      description: 'Invoice generation and record keeping',
      color: 'bg-orange-500'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 700) return 'text-primary';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score) => {
    if (score >= 750) return 'bg-green-500/10 border-green-500/20';
    if (score >= 700) return 'bg-primary/10 border-primary/20';
    if (score >= 650) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const CircularProgress = ({ score, maxScore = 850 }) => {
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="var(--color-border)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={score >= 750 ? '#10b981' : score >= 700 ? 'var(--color-primary)' : '#f59e0b'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
            <div className="text-xs text-muted-foreground">/{maxScore}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Credit Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Score */}
        <div className={`rounded-xl border p-6 ${getScoreBackground(currentScore)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Current Credit Score</h3>
            <Icon name="Award" size={24} className="text-primary" />
          </div>
          <div className="flex items-center justify-center mb-4">
            <CircularProgress score={currentScore} />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-green-500 font-medium">
              <Icon name="TrendingUp" size={16} />
              <span>+{scoreImprovement} points</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Since January 2024</p>
          </div>
        </div>

        {/* Score Range */}
        <div className="bg-card rounded-xl border border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Score Range</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Excellent (750+)</span>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Good (700-749)</span>
              <div className="w-4 h-4 bg-primary rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fair (650-699)</span>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Poor (&lt;650)</span>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-medium">Your Score: Good Range</p>
            <p className="text-xs text-primary mt-1">You're close to excellent! Keep up the good work.</p>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="bg-card rounded-xl border border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Next Milestone</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">750</div>
            <p className="text-sm text-muted-foreground mb-4">Excellent Credit Score</p>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((currentScore - 700) / (750 - 700)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">8 points to go</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={14} className="text-green-500" />
              <span>Maintain transaction consistency</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={14} className="text-green-500" />
              <span>Increase digital payment usage</span>
            </div>
          </div>
        </div>
      </div>
      {/* Credit Score History */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Credit Score History</h3>
          <div className="flex items-center space-x-2 text-sm text-green-500 font-medium">
            <Icon name="TrendingUp" size={16} />
            <span>+{scoreImprovement} points improvement</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={creditHistory}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis domain={[650, 800]} stroke="var(--color-muted-foreground)" />
              <Tooltip 
                formatter={(value) => [value, 'Credit Score']}
                contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--color-accent)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Scoring Factors */}
      <div className="bg-card rounded-xl border border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Scoring Factors</h3>
        <div className="space-y-4">
          {scoringFactors?.map((factor, index) => (
            <div key={index} className="border border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{factor?.factor}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    factor?.impact === 'High' ? 'bg-red-500/10 text-red-500' :
                    factor?.impact === 'Medium'? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {factor?.impact} Impact
                  </span>
                  <span className="font-bold text-foreground">{factor?.score}/100</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${factor?.color} transition-all duration-1000`}
                  style={{ width: `${factor?.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{factor?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Loan Eligibility */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Loan Eligibility</h3>
          <div className="flex items-center space-x-2 text-sm text-primary">
            <Icon name="Info" size={16} />
            <span>Based on current credit score</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loanEligibility?.map((loan, index) => (
            <div key={index} className="border border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={loan?.icon} size={20} className="text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground">{loan?.type}</h4>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  loan?.status === 'eligible' ? 'bg-green-500/10 text-green-500' :
                  loan?.status === 'under-review'? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {loan?.status === 'eligible' ? 'Eligible' :
                   loan?.status === 'under-review' ? 'Under Review' : 'Not Eligible'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-medium text-foreground">₹{loan?.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Interest Rate:</span>
                  <span className="font-medium text-foreground">{loan?.interest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tenure:</span>
                  <span className="font-medium text-foreground">{loan?.tenure}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditScoreView;