#include <Wire.h>
#include <Arduino.h>
#include "nunchuck_funcs.h"

void setup() {
    Serial.begin(9600);
    nunchuck_setpowerpins();
    nunchuck_init();
}

void loop() {
    nunchuck_get_data();
    Serial.print("^");
    Serial.print(nunchuck_joyx(), DEC);    Serial.print(",");
    Serial.print(nunchuck_joyy(), DEC);    Serial.print(",");
    Serial.print(nunchuck_accelx(), DEC);  Serial.print(",");
    Serial.print(nunchuck_accely(), DEC);  Serial.print(",");
    Serial.print(nunchuck_accelz(), DEC);  Serial.print(",");
    Serial.print(nunchuck_zbutton(), DEC);  Serial.print(",");
    Serial.print(nunchuck_cbutton(), DEC);
    Serial.print("$\r\n");
}
