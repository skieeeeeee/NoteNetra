import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Get user's devices
export const getUserDevices = async (userEmail) => {
  try {
    const devicesRef = collection(db, 'devices');
    const q = query(devicesRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, devices };
  } catch (error) {
    console.error('Get user devices error:', error);
    return { success: false, error: error.message };
  }
};

// Get specific device
export const getDevice = async (deviceId) => {
  try {
    const deviceDoc = await getDoc(doc(db, 'devices', deviceId));
    if (deviceDoc.exists()) {
      return { success: true, device: { id: deviceDoc.id, ...deviceDoc.data() } };
    } else {
      return { success: false, error: 'Device not found' };
    }
  } catch (error) {
    console.error('Get device error:', error);
    return { success: false, error: error.message };
  }
};

// Create or update device
export const updateDevice = async (deviceId, deviceData) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    await setDoc(deviceRef, {
      ...deviceData,
      last_online: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Update device error:', error);
    return { success: false, error: error.message };
  }
};

// Update device IP address
export const updateDeviceIP = async (deviceId, ipAddress) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    await updateDoc(deviceRef, {
      esp_ip: ipAddress,
      last_online: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Update device IP error:', error);
    return { success: false, error: error.message };
  }
};

// Update transaction data
export const updateTransactionData = async (deviceId, transactionData) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    await updateDoc(deviceRef, {
      transaction_data: transactionData,
      last_online: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Update transaction data error:', error);
    return { success: false, error: error.message };
  }
};

// Listen to device changes in real-time
export const listenToDevice = (deviceId, callback) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    return onSnapshot(deviceRef, (doc) => {
      if (doc.exists()) {
        const deviceData = { id: doc.id, ...doc.data() };
        callback({ success: true, device: deviceData });
      } else {
        callback({ success: false, error: 'Device not found' });
      }
    }, (error) => {
      console.error('Listen to device error:', error);
      callback({ success: false, error: error.message });
    });
  } catch (error) {
    console.error('Listen to device setup error:', error);
    return null;
  }
};

// Listen to user's devices in real-time
export const listenToUserDevices = (userEmail, callback) => {
  try {
    const devicesRef = collection(db, 'devices');
    const q = query(devicesRef, where('email', '==', userEmail));
    
    return onSnapshot(q, (querySnapshot) => {
      const devices = [];
      querySnapshot.forEach((doc) => {
        devices.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback({ success: true, devices });
    }, (error) => {
      console.error('Listen to user devices error:', error);
      callback({ success: false, error: error.message });
    });
  } catch (error) {
    console.error('Listen to user devices setup error:', error);
    return null;
  }
};

// Check if device is online (within last minute)
export const isDeviceOnline = (lastOnline) => {
  if (!lastOnline) return false;
  
  const lastOnlineTime = lastOnline.toDate ? lastOnline.toDate() : new Date(lastOnline);
  const now = new Date();
  const diffInMinutes = (now - lastOnlineTime) / (1000 * 60);
  
  return diffInMinutes <= 1;
};

// Get device status
export const getDeviceStatus = (device) => {
  if (!device) return 'unknown';
  
  const isOnline = isDeviceOnline(device.last_online);
  return isOnline ? 'online' : 'offline';
};

// Format device data for display
export const formatDeviceData = (device) => {
  if (!device) return null;
  
  return {
    ...device,
    status: getDeviceStatus(device),
    lastOnlineFormatted: device.last_online ? 
      (device.last_online.toDate ? device.last_online.toDate().toLocaleString() : new Date(device.last_online).toLocaleString()) : 
      'Never'
  };
}; 