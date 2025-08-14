import { ref, onValue, push, set, get } from 'firebase/database';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, rtdb } from '../config/firebase';

// Bridge function to sync Realtime Database transactions to Firestore
export const syncTransactionToFirestore = async (transactionData, userId) => {
  try {
    // Create a device document in Firestore if it doesn't exist
    const deviceId = transactionData.deviceId || 'ESP32_001';
    const deviceRef = doc(db, 'devices', deviceId);
    
    // Update device document with transaction data
    await setDoc(deviceRef, {
      email: userId, // This should be the user's email
      esp_ip: '192.168.1.100', // You can update this dynamically
      device_id: deviceId,
      last_online: new Date().toISOString(),
      transaction_data: {
        type: transactionData.type,
        amount: transactionData.amount,
        note: transactionData.note,
        method: transactionData.method,
        timestamp: transactionData.timestamp,
        userId: transactionData.userId
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('Transaction synced to Firestore:', transactionData);
    return { success: true };
  } catch (error) {
    console.error('Error syncing transaction to Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Listen to Realtime Database transactions and sync to Firestore
export const listenToRealtimeTransactions = (userId, callback) => {
  try {
    const transactionsRef = ref(rtdb, 'transactions/esp');
    
    return onValue(transactionsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const transactions = [];
        snapshot.forEach((childSnapshot) => {
          const transaction = childSnapshot.val();
          transaction.key = childSnapshot.key;
          transactions.push(transaction);
        });
        
        // Sync latest transaction to Firestore
        if (transactions.length > 0) {
          const latestTransaction = transactions[transactions.length - 1];
          await syncTransactionToFirestore(latestTransaction, userId);
        }
        
        callback({ success: true, transactions });
      } else {
        callback({ success: true, transactions: [] });
      }
    }, (error) => {
      console.error('Error listening to Realtime Database:', error);
      callback({ success: false, error: error.message });
    });
  } catch (error) {
    console.error('Error setting up Realtime Database listener:', error);
    return null;
  }
};

// Get all transactions from Realtime Database
export const getRealtimeTransactions = async () => {
  try {
    const transactionsRef = ref(rtdb, 'transactions/esp');
    const snapshot = await get(transactionsRef);
    
    if (snapshot.exists()) {
      const transactions = [];
      snapshot.forEach((childSnapshot) => {
        const transaction = childSnapshot.val();
        transaction.key = childSnapshot.key;
        transactions.push(transaction);
      });
      return { success: true, transactions };
    } else {
      return { success: true, transactions: [] };
    }
  } catch (error) {
    console.error('Error getting Realtime Database transactions:', error);
    return { success: false, error: error.message };
  }
};

// Update device status in Firestore based on Realtime Database activity
export const updateDeviceStatusFromRealtime = async (deviceId, userId) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    
    await updateDoc(deviceRef, {
      email: userId,
      last_online: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating device status:', error);
    return { success: false, error: error.message };
  }
}; 