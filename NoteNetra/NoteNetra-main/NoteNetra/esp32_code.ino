#include <Firebase_ESP_Client.h>
#include <SPIFFS.h>
#include <WiFi.h>
#include <Wire.h>
#include <time.h>

// WiFi Credentials
const char *ssid = "as";
const char *password = "12345678";

// Firebase credentials
#define API_KEY "AIzaSyDVjvznBKu1jJYS3STOd-le7Bmn8ToRe1s"
#define DATABASE_URL "https://notenetra-default-rtdb.firebaseio.com"
#define PROJECT_ID "notenetra"

// Your existing pin definitions
#define S0_1 4
#define S1_1 5
#define S2_1 32
#define S3_1 33
#define SENSOR_OUT_1 35

#define S0_2 14
#define S1_2 27
#define S2_2 26
#define S3_2 25
#define SENSOR_OUT_2 34

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Add your userId here (replace with the actual user ID from Firebase
// Authentication)
String userId = "fxQNVL1gFaeGdGfWUoIi2jNoVJd2"; // <-- Set this to the correct
                                                // user for this device

// Timezone info for India
const char *ntpServer1 = "time.nist.gov";
const char *ntpServer2 = "in.pool.ntp.org";
const char *ntpServer3 = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;

int count_100 = 0, count_200 = 0, count_500 = 0;
float total = 5000.0;
String lastNote = "None";
String transactionLog = "";
int numSamples = 10;
int sensorReadDelay = 10;

unsigned long lastDetectionTime = 0;
unsigned long detectionCooldown = 3000;

bool debitNotePresent = false;
bool creditNotePresent = false;

// Helper function to convert token status enum to string
const char *getStatusString(firebase_auth_token_status status) {
  switch (status) {
  case token_status_uninitialized:
    return "uninitialized";
  case token_status_on_signing:
    return "on signing";
  case token_status_on_request:
    return "on request";
  case token_status_on_refresh:
    return "on refresh";
  case token_status_ready:
    return "ready";
  case token_status_error:
    return "error";
  default:
    return "unknown";
  }
}

// Function to get readable timestamp
String getTimestamp() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buffer);
}

// Function to send transaction to Firebase
void sendToFirebase(String type, float amount, String note) {
  if (Firebase.ready()) {
    String path =
        "transactions/esp"; // All ESP transactions go under transactions/esp
    FirebaseJson json;
    json.add("timestamp", getTimestamp());
    json.add("type", type);
    json.add("note", note);
    json.add("amount", amount);
    json.add("method", "cash");
    json.add("deviceId", "ESP32_001");
    json.add("userId", userId); // Add userId to each transaction

    if (Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json)) {
      Serial.println("Transaction sent to Firebase");
      Serial.println("PATH: " + fbdo.dataPath());
    } else {
      Serial.println("Error sending to Firebase");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  } else {
    Serial.println("Firebase not ready!");
  }
}

// Your existing functions remain the same
void getRGB(int &r, int &g, int &b, int S2_PIN, int S3_PIN, int OUT_PIN) {
  r = readColorSensor(S2_PIN, S3_PIN, OUT_PIN, LOW, LOW);
  g = readColorSensor(S2_PIN, S3_PIN, OUT_PIN, HIGH, HIGH);
  b = readColorSensor(S2_PIN, S3_PIN, OUT_PIN, LOW, HIGH);
}

int readColorSensor(int s2, int s3, int sensorOut, int s2State, int s3State) {
  digitalWrite(s2, s2State);
  digitalWrite(s3, s3State);
  return pulseIn(sensorOut, LOW);
}

bool isNote100(int r, int g, int b) {
  return (r >= 45 && r <= 65) && (g >= 50 && g <= 70) && (b >= 30 && b <= 50);
}

bool isNote200(int r, int g, int b) {
  return (r >= 20 && r <= 40) && (g >= 35 && g <= 55) && (b >= 35 && b <= 50);
}

bool isNote500(int r, int g, int b) {
  return (r >= 35 && r <= 50) && (g >= 44 && g <= 60) && (b >= 35 && b <= 53);
}

// Token status callback for debugging Firebase authentication
void tokenStatusCallback(TokenInfo info) {
  Serial.printf("Token info: type = %d, status = %s\n", info.type,
                getStatusString(info.status));
}

void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting Smart Currency Counter...");

  // Initialize pins
  pinMode(S0_1, OUTPUT);
  pinMode(S1_1, OUTPUT);
  pinMode(S2_1, OUTPUT);
  pinMode(S3_1, OUTPUT);
  pinMode(SENSOR_OUT_1, INPUT);
  pinMode(S0_2, OUTPUT);
  pinMode(S1_2, OUTPUT);
  pinMode(S2_2, OUTPUT);
  pinMode(S3_2, OUTPUT);
  pinMode(SENSOR_OUT_2, INPUT);

  digitalWrite(S0_1, HIGH);
  digitalWrite(S1_1, LOW);
  digitalWrite(S0_2, HIGH);
  digitalWrite(S1_2, LOW);

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: ");
  Serial.println(WiFi.localIP());

  // Try first NTP server
  Serial.println("Trying NTP server: time.nist.gov");
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1);
  time_t now = time(nullptr);
  int retry = 0;
  while (now < 8 * 3600 * 2 && retry < 10) { // wait up to ~5 seconds
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    retry++;
  }
  if (now < 8 * 3600 * 2) {
    Serial.println("\nFirst NTP server failed, trying in.pool.ntp.org");
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer2);
    retry = 0;
    now = time(nullptr);
    while (now < 8 * 3600 * 2 && retry < 10) {
      delay(500);
      Serial.print(".");
      now = time(nullptr);
      retry++;
    }
  }
  if (now < 8 * 3600 * 2) {
    Serial.println("\nSecond NTP server failed, trying pool.ntp.org");
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer3);
    retry = 0;
    now = time(nullptr);
    while (now < 8 * 3600 * 2 && retry < 10) {
      delay(500);
      Serial.print(".");
      now = time(nullptr);
      retry++;
    }
  }
  Serial.println();
  Serial.print("Current time: ");
  Serial.println(ctime(&now));

  // Debug: About to initialize Firebase
  Serial.println("About to initialize Firebase...");
  // Initialize Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback =
      tokenStatusCallback; // Register token status callback
  config.signer.test_mode = true; // ✅ This enables anonymous login
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized");
}

void loop() {
  if (Firebase.ready()) {
    // --- Sensor detection logic ---
    unsigned long currentMillis = millis();

    if (currentMillis - lastDetectionTime > detectionCooldown) {
      int r1 = 0, g1 = 0, b1 = 0;
      int r2 = 0, g2 = 0, b2 = 0;

      // Collect multiple samples for color sensors
      for (int i = 0; i < numSamples; i++) {
        int tr, tg, tb;
        getRGB(tr, tg, tb, S2_1, S3_1, SENSOR_OUT_1);
        r1 += tr;
        g1 += tg;
        b1 += tb;
        getRGB(tr, tg, tb, S2_2, S3_2, SENSOR_OUT_2);
        r2 += tr;
        g2 += tg;
        b2 += tb;
        delay(sensorReadDelay);
      }

      r1 /= numSamples;
      g1 /= numSamples;
      b1 /= numSamples;
      r2 /= numSamples;
      g2 /= numSamples;
      b2 /= numSamples;

      // Debug sensor readings
      Serial.println("\n----- Sensor Readings -----");
      Serial.printf("Debit Sensor:  R=%d, G=%d, B=%d\n", r1, g1, b1);
      Serial.printf("Credit Sensor: R=%d, G=%d, B=%d\n", r2, g2, b2);

      // Debit Note detection
      if (!debitNotePresent) {
        if (isNote100(r1, g1, b1) && total >= 100) {
          count_100++;
          total -= 100;
          lastNote = "100 Rs (Debited)";
          sendToFirebase("debit", 100.00, "100 Rs Debited");
          debitNotePresent = true;
          lastDetectionTime = currentMillis;
        } else if (isNote200(r1, g1, b1) && total >= 200) {
          count_200++;
          total -= 200;
          lastNote = "200 Rs (Debited)";
          sendToFirebase("debit", 200.00, "200 Rs Debited");
          debitNotePresent = true;
          lastDetectionTime = currentMillis;
        } else if (isNote500(r1, g1, b1) && total >= 500) {
          count_500++;
          total -= 500;
          lastNote = "500 Rs (Debited)";
          sendToFirebase("debit", 500.00, "500 Rs Debited");
          debitNotePresent = true;
          lastDetectionTime = currentMillis;
        }
      }

      // Credit Note detection
      if (!creditNotePresent) {
        if (isNote100(r2, g2, b2)) {
          total += 100;
          lastNote = "100 Rs (Credited)";
          sendToFirebase("credit", 100.00, "100 Rs Credited");
          creditNotePresent = true;
          lastDetectionTime = currentMillis;
        } else if (isNote200(r2, g2, b2)) {
          total += 200;
          lastNote = "200 Rs (Credited)";
          sendToFirebase("credit", 200.00, "200 Rs Credited");
          creditNotePresent = true;
          lastDetectionTime = currentMillis;
        } else if (isNote500(r2, g2, b2)) {
          total += 500;
          lastNote = "500 Rs (Credited)";
          sendToFirebase("credit", 500.00, "500 Rs Credited");
          creditNotePresent = true;
          lastDetectionTime = currentMillis;
        }
      }

      // Check if notes are removed
      if (!(isNote100(r1, g1, b1) || isNote200(r1, g1, b1) ||
            isNote500(r1, g1, b1))) {
        debitNotePresent = false;
      }
      if (!(isNote100(r2, g2, b2) || isNote200(r2, g2, b2) ||
            isNote500(r2, g2, b2))) {
        creditNotePresent = false;
      }

      Serial.printf("Current Balance: Rs. %.2f\n", total);
      Serial.printf("Count 100 Rs Notes Debited: %d\n", count_100);
      Serial.printf("Count 200 Rs Notes Debited: %d\n", count_200);
      Serial.printf("Count 500 Rs Notes Debited: %d\n", count_500);
      Serial.println("----------------------------\n");
    }
    // --- End of sensor detection logic ---
  } else {
    Serial.println("Waiting for Firebase to be ready...");
    delay(1000); // 1 second wait
  }
}