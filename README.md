# **SMART ATTENDANCE SYSTEM USING FINGERPRINT RECOGNITION** 

## *System Architecture*

![WhatsApp Image 2024-08-16 at 13 20 58_db939669](https://github.com/user-attachments/assets/ab92a1d6-c05d-40b8-879e-0952b64b1d52)

The Fingerprint Attendance System is designed to securely capture and verify 
fingerprints for attendance management. The architecture includes the AS608 sensor 
for fingerprint recognition, a microcontroller for processing, and an LCD for user 
interaction. The system ensures secure storage of fingerprint data and accurate 
attendance records.

## System Design: 
Hardware: 
1. Arduino UNO Board 
2. AS608 Fingerprint Sensor 
3. DS3231/DS1307 RTC Module 
4. 16x2 LCD Display 
5. Bluetooth module HC-05 
6. Buzzer 5V - 1 
7. LED 5mm Any Color - 2 
8. Jump Wires  
9. Breadboard
10. Resistors 100-Ohm
11. I2C Module

## **AS608 Fingerprint sensor**

![1](https://github.com/user-attachments/assets/f3474d17-97d0-4e4d-8206-19994609311e)

The AS608 Fingerprint sensor is based on the AS608 chip. It captures fingerprints and sends the data to the microcontroller through serial communication. This sensor can store up to 255 fingerprint IDs, making it suitable for small projects. If you need to store more IDs, you can choose a different fingerprint module available in the market. We’ll cover more tutorials on the features of these sensors. Additionally, you can easily use this sensor with Arduino, ESP8266, and ESP32 development boards. 

![2](https://github.com/user-attachments/assets/47a368c7-b006-475a-9a05-17d368b13d32)

## **The working principle of this sensor**

This fingerprint includes two processes. That is fingerprint registration and fingerprint matching. Also, this fingerprint matching consists of two more parts. That is fingerprint comparison (1:1) and fingerprint search (1:N). When checking fingerprints, the fingerprint image is captured by the sensor and compared with the fingerprint stored in the module. If it matches, it is called a fingerprint comparison (1:1). Otherwise, if multiple fingerprints match, it is called a fingerprint search (1:N).

## **Specifications of this sensor**

Operation Voltage: 3.3v

Interface: TTL Serial.

Baud rate: (9600~57600) (default 57600).

Rated Current: ~120mA.

Fingerprint imaging time: <1.0 seconds.

Storage capacity: 255 templates.

Template file: 512 bytes.

False Acceptance Rate: <0.001% (Security level 3).

False Reject Rate: <1.0% (Security level 3).

Safety Level: 1~5 low to high safety.

Temperature: -20 – +50 degrees.

Sensing Window: (16×18) mm.

Dimension: (45.1×20.3×18.6) mm.

## **The I2C (Inter-Integrated Circuit) module**
The I2C (Inter-Integrated Circuit) module, also known as the TWI (Two Wire Interface), is used to connect multiple devices using only two wires: SDA (Serial Data Line) and SCL (Serial Clock Line). It’s a common communication protocol for connecting peripherals like sensors, displays, and RTC modules to a microcontroller like an Arduino. Here’s why it’s used and how it benefits your setup:

![Screenshot 2024-08-24 044608](https://github.com/user-attachments/assets/28f3e77c-fe6c-4d3f-86f9-f95775ff598e)

Why Use I2C?

Simplified Wiring:

Two-Wire Interface: I2C requires only two wires (SDA and SCL) to connect multiple devices, reducing the number of pins needed compared to other communication methods like SPI or parallel communication.

Multiple Devices:

Addressing: I2C supports addressing, allowing you to connect multiple devices on the same bus. Each device has a unique address, so the Arduino can communicate with any device by specifying its address.

Ease of Use:

Libraries: Many Arduino libraries are available for I2C devices, simplifying the code required to interface with components like LCD displays, RTC modules, and EEPROMs.

Low Speed, Low Power:

Appropriate for Many Peripherals: I2C is suitable for connecting peripherals that do not require high-speed communication, making it ideal for devices like LCDs and sensors.


## **Connections**

![WhatsApp Image 2024-08-16 at 13 20 59_09b1023a](https://github.com/user-attachments/assets/7f5e7986-c888-438d-9975-30ab56c3ca69)


1. AS608 Fingerprint Sensor
   
Connections:

VCC: Connect to the 5V pin on the Arduino.

GND: Connect to the GND pin on the Arduino.

TX: Connect to the RX pin on the Arduino (usually pin 2 or 3, but you should configure this in your code).

RX: Connect to the TX pin on the Arduino (usually pin 2 or 3, but you should configure this in your code).

2. LCD 16x2 Display with I2C Module

Connections:

VCC: Connect to the 5V pin on the Arduino.

GND: Connect to the GND pin on the Arduino.

SDA: Connect to the A4 pin on the Arduino (SDA).

SCL: Connect to the A5 pin on the Arduino (SCL).

3. RTC Module

Connections:

VCC: Connect to the 5V pin on the Arduino.

GND: Connect to the GND pin on the Arduino.

SDA: Connect to the A4 pin on the Arduino (SDA). (Same as LCD)

SCL: Connect to the A5 pin on the Arduino (SCL). (Same as LCD)

4. Buzzer

Connections:

Positive Pin (+): Connect to a digital pin on the Arduino (e.g., pin 5).

Negative Pin (-): Connect to the GND pin on the Arduino.

Note: You might need a current-limiting resistor (e.g., 220 ohms) depending on your buzzer specifications, but many buzzers can be connected directly.

5. Green and Blue LEDs

Connections:

Anode (+): Connect to a digital pin on the Arduino (e.g., pin 4 for green and pin 6 for red).

Cathode (-): Connect to a resistor (e.g., 220 ohms), and then to the GND pin on the Arduino.


## **NEXT STEPS**

* After that, connect the Arduino board to the computer.

* Next, install the Fingerprint library. For that, follow the instructions below.

* First, open the Arduino IDE and go to the Manage Libraries.

* Then type “fingerprint” in the search bar and install the Adafruit Fingerprint Sensor Library file.

OK, let’s enroll fingerprints. For that, follow the instructions below.

* Use Examples in arduino and Select adafruit and enroll.You must remember to install the I2C Liquid Crystal display library. Because I used an LCD screen.

* Next, open the serial monitor. Now you can see the Fingerprint sensor status.
Then, enter your ID as you like. The library file shows that only 1 to 127 can be entered.

*Next, place any finger on the sensor window. Then, follow the instructions on the serial monitor. Finally, you can store your fingerprint ID on the module.

*Then compile and upload the given arduino code .

## **Troubleshooting**

Check all jumper wires.
Check the sensor wire colors.
Install the Fingerprint and I2C library files.
Enter the correct fingerprint ID.

![WhatsApp Image 2024-08-23 at 00 34 53_71a5cfd6](https://github.com/user-attachments/assets/eefede18-81e9-41cb-b5c6-5bc5516a9dad)

You Can Refer my React web App also . I Use Bluetooth API for get IDs.But I understood Efficient way is using Wifi module and share Datas through It.

![Screenshot 2024-08-22 230218](https://github.com/user-attachments/assets/f7f36445-83c6-48e9-a6a2-0841956baf50)
![Screenshot 2024-08-22 230309](https://github.com/user-attachments/assets/d87d3760-3a1e-46a1-b822-e59f315e517d)


