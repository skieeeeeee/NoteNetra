import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const TransactionsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const transactions = [
    {
      id: 'TXN001',
      date: '2025-01-08',
      time: '14:30',
      customer: 'Rajesh Kumar',
      amount: 2450,
      type: 'UPI',
      status: 'completed',
      items: 'Electronics - Mobile Charger, Earphones'
    },
    {
      id: 'TXN002',
      date: '2025-01-08',
      time: '13:15',
      customer: 'Priya Sharma',
      amount: 1200,
      type: 'Cash',
      status: 'completed',
      items: 'Groceries - Rice, Dal, Oil'
    },
    {
      id: 'TXN003',
      date: '2025-01-08',
      time: '12:45',
      customer: 'Amit Patel',
      amount: 3500,
      type: 'UPI',
      status: 'completed',
      items: 'Clothing - Shirt, Trousers'
    },
    {
      id: 'TXN004',
      date: '2025-01-08',
      time: '11:20',
      customer: 'Sunita Devi',
      amount: 850,
      type: 'Cash',
      status: 'completed',
      items: 'Stationery - Notebooks, Pens'
    },
    {
      id: 'TXN005',
      date: '2025-01-07',
      time: '16:10',
      customer: 'Vikram Singh',
      amount: 4200,
      type: 'UPI',
      status: 'completed',
      items: 'Hardware - Tools, Screws'
    },
    {
      id: 'TXN006',
      date: '2025-01-07',
      time: '15:30',
      customer: 'Meera Joshi',
      amount: 1800,
      type: 'Card',
      status: 'completed',
      items: 'Books - Educational, Fiction'
    },
    {
      id: 'TXN007',
      date: '2025-01-07',
      time: '14:45',
      customer: 'Ravi Gupta',
      amount: 2100,
      type: 'Cash',
      status: 'completed',
      items: 'Food Items - Snacks, Beverages'
    },
    {
      id: 'TXN008',
      date: '2025-01-06',
      time: '17:20',
      customer: 'Kavita Reddy',
      amount: 3200,
      type: 'UPI',
      status: 'completed',
      items: 'Home Decor - Curtains, Cushions'
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' }
  ];

  const dateOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'UPI': return 'Smartphone';
      case 'Cash': return 'Banknote';
      case 'Card': return 'CreditCard';
      default: return 'Receipt';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'UPI': return 'text-primary bg-primary/10 border-primary/20';
      case 'Cash': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Card': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted/50 border';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction?.customer?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.items?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesType = filterType === 'all' || transaction?.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalAmount = filteredTransactions?.reduce((sum, txn) => sum + txn?.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header with Summary */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => alert('Export functionality would be implemented here')}
          >
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Receipt" size={24} className="text-primary" />
              <div>
                <p className="text-sm text-primary">Total Transactions</p>
                <p className="text-2xl font-bold text-primary">{filteredTransactions?.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={24} className="text-green-500" />
              <div>
                <p className="text-sm text-green-500">Total Amount</p>
                <p className="text-2xl font-bold text-green-500">₹{totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Calculator" size={24} className="text-accent" />
              <div>
                <p className="text-sm text-accent">Average Transaction</p>
                <p className="text-2xl font-bold text-accent">
                  ₹{filteredTransactions?.length > 0 ? Math.round(totalAmount / filteredTransactions?.length)?.toLocaleString('en-IN') : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-card rounded-xl border border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
          
          <Select
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />
          
          <Select
            options={dateOptions}
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select date range"
          />
        </div>
      </div>
      {/* Transactions Table */}
      <div className="bg-card rounded-xl border border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Transaction ID</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Date & Time</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Items</th>
                <th className="text-left py-4 px-6 font-semibold text-foreground">Type</th>
                <th className="text-right py-4 px-6 font-semibold text-foreground">Amount</th>
                <th className="text-center py-4 px-6 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.map((transaction, index) => (
                <tr 
                  key={transaction?.id} 
                  className={`border-b border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/25'
                  }`}
                >
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-primary">{transaction?.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{transaction?.date}</div>
                      <div className="text-muted-foreground">{transaction?.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-foreground">{transaction?.customer}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-muted-foreground max-w-xs truncate" title={transaction?.items}>
                      {transaction?.items}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(transaction?.type)}`}>
                      <Icon name={getTypeIcon(transaction?.type)} size={14} />
                      <span>{transaction?.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-bold text-foreground">₹{transaction?.amount?.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                      <Icon name="CheckCircle" size={14} />
                      <span>Completed</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;