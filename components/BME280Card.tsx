"use client";

import * as React from "react";
import { WiThermometer, WiHumidity, WiBarometer } from "react-icons/wi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import mqtt from "mqtt";
import { MQTT_CONFIG } from "../lib/mqtt/config";

export function BME280Card() {
  const [temperature, setTemperature] = React.useState("0");
  const [humidity, setHumidity] = React.useState("0");
  const [pressure, setPressure] = React.useState("0");

  React.useEffect(() => {
    const client = mqtt.connect(
      MQTT_CONFIG.client.url,
      MQTT_CONFIG.client.options
    );

    client.on("connect", () => {
      client.subscribe(MQTT_CONFIG.topics.temperature, { qos: 1 });
      client.subscribe(MQTT_CONFIG.topics.humidity, { qos: 1 });
      client.subscribe(MQTT_CONFIG.topics.pressure, { qos: 1 });
    });

    client.on("message", (topic, message) => {
      const value = message.toString();

      if (topic === MQTT_CONFIG.topics.temperature) {
        setTemperature(value);
      }
      if (topic === MQTT_CONFIG.topics.humidity) {
        setHumidity(value);
      }
      if (topic === MQTT_CONFIG.topics.pressure) {
        setPressure(value);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-blue-600">
          Czujnik Pogodowy
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Monitoruj swoje otoczenie w czasie rzeczywistym
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center p-6">
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <WiThermometer className="text-3xl text-blue-500" />
          <span className="font-medium text-gray-700">Temperatura:</span>
          <span className="text-blue-600 font-bold">
            {temperature ? `${temperature}°C` : "Ładowanie..."}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <WiHumidity className="text-3xl text-blue-500" />
          <span className="font-medium text-gray-700">Wilgotność:</span>
          <span className="text-blue-600 font-bold">
            {humidity ? `${humidity}%` : "Ładowanie..."}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <WiBarometer className="text-3xl text-blue-500" />
          <span className="font-medium text-gray-700">Ciśnienie:</span>
          <span className="text-blue-600 font-bold">
            {pressure ? `${pressure} hPa` : "Ładowanie..."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
