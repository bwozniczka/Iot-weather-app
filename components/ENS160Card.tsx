"use client";

import * as React from "react";
import { FaLeaf, FaSmog } from "react-icons/fa";
import { WiCloud } from "react-icons/wi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import mqtt from "mqtt";
import { MQTT_CONFIG } from "../lib/mqtt/config";

export function ENS160Card() {
  const [tvoc, setTvoc] = React.useState<string>("0");
  const [aqi, setAqi] = React.useState<string>("0");
  const [co2, setCo2] = React.useState<string>("0");

  React.useEffect(() => {
    const client = mqtt.connect(
      MQTT_CONFIG.client.url,
      MQTT_CONFIG.client.options
    );

    client.on("connect", () => {
      client.subscribe(MQTT_CONFIG.topics.tvoc, { qos: 1 });
      client.subscribe(MQTT_CONFIG.topics.aqi, { qos: 1 });
      client.subscribe(MQTT_CONFIG.topics.eco2, { qos: 1 });
    });

    client.on("message", (topic, message) => {
      const value = message.toString();

      if (topic === MQTT_CONFIG.topics.tvoc) {
        setTvoc(value);
      }
      if (topic === MQTT_CONFIG.topics.aqi) {
        setAqi(value);
      }
      if (topic === MQTT_CONFIG.topics.eco2) {
        setCo2(value);
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
          Czujnik Jakości Powietrza
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Monitoruj jakość powietrza w czasie rzeczywistym
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center p-6">
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <FaLeaf className="text-3xl text-green-500" />
          <span className="font-medium text-gray-700">TVOC:</span>
          <span className="text-blue-600 font-bold">
            {tvoc ? `${tvoc} ppb` : "Ładowanie..."}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <WiCloud className="text-3xl text-blue-500" />
          <span className="font-medium text-gray-700">AQI:</span>
          <span className="text-blue-600 font-bold">
            {aqi ? aqi : "Ładowanie..."}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <FaSmog className="text-3xl text-gray-500" />
          <span className="font-medium text-gray-700">CO₂:</span>
          <span className="text-blue-600 font-bold">
            {co2 ? `${co2} ppm` : "Ładowanie..."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
