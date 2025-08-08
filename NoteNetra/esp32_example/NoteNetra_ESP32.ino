/*
 * NoteNetra ESP32 Device Code
 * 
 * This code connects an ESP32 to WiFi and sends transaction data to Firebase.
 * The device updates its IP address, last online timestamp, and transaction data.
 * 
 * Requirements:
 * - ESP32 board
 * - WiFi connection
 * - Firebase project with Firestore database
 * 
 * Setup:
 * 1. Replace WIFI_SSID and WIFI_PASSWORD with your WiFi credentials
 * 2. Replace FIREBASE_PROJECT_ID with your Firebase project ID
 * 3. Replace USER_EMAIL with the email address of the device owner
 * 4. Replace DEVICE_ID with a unique identifier for this device (e.g., MAC address)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>

// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Firebase Configuration
const char* FIREBASE_PROJECT_ID = "notenetra";
const char* USER_EMAIL = "user@example.com";
const char* DEVICE_ID = "esp32_device_001"; // Unique device identifier

// Firebase REST API endpoint
const char* FIREBASE_URL = "https://firestore.googleapis.com/v1/projects/";

// NTP Configuration for accurate timestamps
const char* NTP_SERVER = "pool.ntp.org";
const long GMT_OFFSET_SEC = 19800; // IST: UTC+5:30
const int DAYLIGHT_OFFSET_SEC = 0;

// Update intervals
const unsigned long UPDATE_INTERVAL = 30000; // 30 seconds
const unsigned long HEARTBEAT_INTERVAL = 60000; // 1 minute

unsigned long lastUpdate = 0;
unsigned long lastHeartbeat = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("NoteNetra ESP32 Device Starting...");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Initialize time
  configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER);
  
  // Initial device registration
  registerDevice();
  
  Serial.println("Device setup complete!");
}

void loop() {
  unsigned long currentTime = millis();
  
  // Regular heartbeat update
  if (currentTime - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    updateDeviceStatus();
    lastHeartbeat = currentTime;
  }
  
  // Simulate transaction data (replace with actual transaction detection)
  if (currentTime - lastUpdate >= UPDATE_INTERVAL) {
    simulateTransaction();
    lastUpdate = currentTime;
  }
  
  delay(1000);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void registerDevice() {
  String url = String(FIREBASE_URL) + FIREBASE_PROJECT_ID + "/databases/(default)/documents/devices/" + DEVICE_ID;
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create device document
  DynamicJsonDocument doc(1024);
  doc["fields"]["email"]["stringValue"] = USER_EMAIL;
  doc["fields"]["esp_ip"]["stringValue"] = WiFi.localIP().toString();
  doc["fields"]["device_id"]["stringValue"] = DEVICE_ID;
  doc["fields"]["created_at"]["timestampValue"] = getCurrentTimestamp();
  doc["fields"]["last_online"]["timestampValue"] = getCurrentTimestamp();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("Registering device...");
  Serial.println("URL: " + url);
  Serial.println("Data: " + jsonString);
  
  int httpResponseCode = http.PUT(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error on HTTP request");
  }
  
  http.end();
}

void updateDeviceStatus() {
  String url = String(FIREBASE_URL) + FIREBASE_PROJECT_ID + "/databases/(default)/documents/devices/" + DEVICE_ID;
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Update device status
  DynamicJsonDocument doc(512);
  doc["fields"]["esp_ip"]["stringValue"] = WiFi.localIP().toString();
  doc["fields"]["last_online"]["timestampValue"] = getCurrentTimestamp();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("Updating device status...");
  
  int httpResponseCode = http.PATCH(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.println("Status update successful");
  } else {
    Serial.println("Status update failed");
  }
  
  http.end();
}

void simulateTransaction() {
  // Simulate different types of transactions
  String transactionTypes[] = {"cash", "upi", "card"};
  String transactionType = transactionTypes[random(0, 3)];
  
  int amount = random(100, 5000); // Random amount between 100-5000
  
  String url = String(FIREBASE_URL) + FIREBASE_PROJECT_ID + "/databases/(default)/documents/devices/" + DEVICE_ID;
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create transaction data
  DynamicJsonDocument doc(1024);
  doc["fields"]["transaction_data"]["mapValue"]["fields"]["type"]["stringValue"] = transactionType;
  doc["fields"]["transaction_data"]["mapValue"]["fields"]["amount"]["integerValue"] = amount;
  doc["fields"]["transaction_data"]["mapValue"]["fields"]["timestamp"]["timestampValue"] = getCurrentTimestamp();
  doc["fields"]["last_online"]["timestampValue"] = getCurrentTimestamp();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("Sending transaction: " + transactionType + " - ₹" + String(amount));
  
  int httpResponseCode = http.PATCH(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.println("Transaction sent successfully");
  } else {
    Serial.println("Transaction failed");
  }
  
  http.end();
}

String getCurrentTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "2024-01-01T00:00:00Z";
  }
  
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(timestamp);
}

// Function to handle actual transaction detection
// Replace this with your actual transaction detection logic
void handleTransaction(String type, int amount) {
  String url = String(FIREBASE_URL) + FIREBASE_PROJECT_ID + "/databases/(default)/documents/devices/" + DEVICE_ID;
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  DynamicJsonDocument doc(1024);
  doc["fields"]["transaction_data"]["mapValue"]["fields"]["type"]["stringValue"] = type;
  doc["fields"]["transaction_data"]["mapValue"]["fields"]["amount"]["integerValue"] = amount;
  doc["fields"]["transaction_data"]["mapValue"]["fields"]["timestamp"]["timestampValue"] = getCurrentTimestamp();
  doc["fields"]["last_online"]["timestampValue"] = getCurrentTimestamp();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("Sending transaction: " + type + " - ₹" + String(amount));
  
  int httpResponseCode = http.PATCH(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.println("Transaction sent successfully");
  } else {
    Serial.println("Transaction failed");
  }
  
  http.end();
}

// WiFi reconnection function
void checkWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Reconnecting...");
    connectToWiFi();
  }
} 