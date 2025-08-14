
// --- IP Whitelist Configuration ---
// For enhanced security, you can enable IP whitelisting.
// Add the allowed IP addresses to the array below.
// Example: export const ALLOWED_IPS = ['192.168.1.1', '203.0.113.0'];
export const ALLOWED_IPS = []; // Empty array means the check is disabled

export const getClientIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching client IP:', error);
    return null;
  }
};
