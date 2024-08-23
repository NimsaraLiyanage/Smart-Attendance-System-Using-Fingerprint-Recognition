#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <RTClib.h>

#define LED_GREEN 4
#define LED_RED 6
#define BUZZER 5
#define POWER_PIN 7 // Define pin 7 as the power control pin

SoftwareSerial mySerial(2, 3); // Fingerprint sensor
SoftwareSerial btSerial(8, 9); // Bluetooth module

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
LiquidCrystal_I2C dis(0x27, 16, 2); // Initialize the LCD with I2C address 0x27
RTC_DS3231 rtc;

bool Switch = true;
unsigned long lastBlinkTime = 0;

void setup() {
  Serial.begin(9600);
  btSerial.begin(9600); // Start Bluetooth communication at 9600 baud rate

  // Set up power control pin
  pinMode(POWER_PIN, OUTPUT);
  digitalWrite(POWER_PIN, HIGH); // Turn on the power

  // Initialize the LCD
  dis.init();
  dis.backlight();
  dis.clear();      // Clear the display to ensure a fresh start
  dis.setCursor(0, 0);
  dis.print("Place finger");

  // Initialize LED and Buzzer pins
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  while (!Serial);  // For Yun/Leo/Micro/Zero/...
  delay(100);
  Serial.println("\n\nAdafruit finger detect test");

  // Set the data rate for the sensor serial port
  finger.begin(57600);
  delay(5);
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
    btSerial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    btSerial.println("Did not find fingerprint sensor :(");
    while (1) {
      delay(1);
    }
  }

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    btSerial.println("Couldn't find RTC");
    while (1);
  }

  if (rtc.lostPower()) {
    Serial.println("RTC lost power, let's set the time!");
    btSerial.println("RTC lost power, let's set the time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  finger.getParameters();
  finger.getTemplateCount();
  if (finger.templateCount == 0) {
    Serial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
    btSerial.print("Sensor doesn't contain any fingerprint data. Please run the 'enroll' example.");
  } else {
    Serial.println("Waiting for valid finger...");
    btSerial.println("Waiting for valid finger...");
    Serial.print("Sensor contains "); Serial.print(finger.templateCount); Serial.println(" templates");
    btSerial.print("Sensor contains "); btSerial.print(finger.templateCount); btSerial.println(" templates");
  }
}

void loop() {
  DateTime now = rtc.now();

  static int lastMinute = -1;
  if (now.minute() != lastMinute) {
    dis.clear(); // Clear the display before updating
    dis.setCursor(0, 0);
    dis.print(now.year(), DEC);
    dis.print('/');
    dis.print(now.month(), DEC);
    dis.print('/');
    dis.print(now.day(), DEC);
    dis.print(' '); // Add a space for separation
    dis.print(now.hour(), DEC);
    dis.print(':');
    if (now.minute() < 10) {
      dis.print('0'); // Leading zero for minutes
    }
    dis.print(now.minute(), DEC);
    lastMinute = now.minute();
  }

  int value = getFingerprintIDez();
  dis.setCursor(0, 1);
  dis.print("                "); // Clear the entire second line
  dis.setCursor(0, 1); // Move cursor back to the beginning

  if (value >= 0) { // If a valid fingerprint ID is found
    dis.print("ID# "); dis.print(value); dis.print(" recognized");
    btSerial.print("ID# "); btSerial.print(value); btSerial.println(" recognized");
    digitalWrite(LED_GREEN, HIGH);
    delay(4000);
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER, LOW);
    if (Switch) {
      Switch = false;
      lastBlinkTime = millis();
    }
  } else if (value == -1) {
    dis.print("Place finger");
    btSerial.println("Place finger");
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER, LOW);
  } else if (value == -2) {
    dis.print("Try again");
    btSerial.println("Try again");
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, HIGH);
    digitalWrite(BUZZER, HIGH);
    delay(2000);  // Display error message for 2 seconds
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER, LOW);
  } else {
    dis.print("Not recognized");
    btSerial.println("Not recognized");
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, HIGH);
    digitalWrite(BUZZER, HIGH);
    delay(2000);  // Display error message for 2 seconds
    digitalWrite(LED_RED, LOW);
    digitalWrite(BUZZER, LOW);
  }

  if (millis() - lastBlinkTime >= 2000 && !Switch) {
    digitalWrite(LED_GREEN, LOW);
    Switch = true;
  }

  delay(50);
}

// Returns -1 if no finger is placed, -2 if failed but finger placed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p == FINGERPRINT_NOFINGER) return -1;
  if (p != FINGERPRINT_OK) return -2;
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -2;
  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -2;
  return finger.fingerID;
}
