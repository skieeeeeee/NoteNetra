import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { listenToUserDevices, formatDeviceData } from '../utils/deviceManager';
import { listenToRealtimeTransactions, getRealtimeTransactions } from '../utils/realtimeBridge';
import Icon from './AppIcon';

const DeviceStatus = () => {
  const { currentUser } = useAuth();
  const [devices, setDevices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser?.email) return;

    // Listen to Firestore devices
    const unsubscribeDevices = listenToUserDevices(currentUser.email, (result) => {
      if (result.success) {
        const formattedDevices = result.devices.map(formatDeviceData);
        setDevices(formattedDevices);
        setError('');
      } else {
        setError(result.error);
      }
      setLoading(false);
    });

    // Listen to Realtime Database transactions
    const unsubscribeTransactions = listenToRealtimeTransactions(currentUser.uid, (result) => {
      if (result.success) {
        setTransactions(result.transactions);
      }
    });

    return () => {
      if (unsubscribeDevices) unsubscribeDevices();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, [currentUser?.email, currentUser?.uid]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} className="text-red-500" />
          <span className="text-sm text-red-700">Error loading devices: {error}</span>
        </div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Wifi" size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Devices Connected</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your ESP32 device will appear here once connected and configured.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Device Setup Instructions:</p>
                <ul className="text-xs space-y-1">
                  <li>• Connect your ESP32 to power and WiFi</li>
                  <li>• Configure the device with your email address</li>
                  <li>• The device will automatically appear here</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {devices.map((device) => (
        <div key={device.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <h3 className="text-lg font-medium text-gray-900">
                ESP32 Device ({device.id.slice(-8)})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                device.status === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {device.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">IP Address:</span>
                <span className="text-sm font-medium text-gray-900">
                  {device.esp_ip || 'Not available'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Last Online:</span>
                <span className="text-sm font-medium text-gray-900">
                  {device.lastOnlineFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Data Display */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Transactions</h4>
            {transactions.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.slice(-5).reverse().map((transaction, index) => (
                  <div key={transaction.key || index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{transaction.amount}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {transaction.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{transaction.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>

          {/* Connection Status Message */}
          {device.status === 'offline' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-yellow-500" />
                <span className="text-sm text-yellow-700">
                  Device disconnected. Check power and WiFi connection.
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeviceStatus; 