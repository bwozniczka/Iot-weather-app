"use client";

import * as React from "react";
import { WiDaySunny } from "react-icons/wi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import mqtt from "mqtt";
import { MQTT_CONFIG } from "../lib/mqtt/config";

export function KY018Card() {
  const [lightLevel, setLightLevel] = React.useState<string>("0");
  React.useEffect(() => {
    const client = mqtt.connect(
      MQTT_CONFIG.client.url,
      MQTT_CONFIG.client.options
    );

    client.on("connect", () => {
      client.subscribe(MQTT_CONFIG.topics.light, { qos: 1 });
    });

    client.on("message", (topic, message) => {
      const value = message.toString();
      if (topic === MQTT_CONFIG.topics.light) {
        setLightLevel(value);
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
          Czujnik Światła
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Monitoruj poziom oświetlenia w czasie rzeczywistym
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center p-6">
        <div className="flex items-center justify-center space-x-3 text-lg hover:bg-blue-50 p-4 rounded-lg transition-colors">
          <WiDaySunny className="text-3xl text-yellow-500" />
          <span className="font-medium text-gray-700">Poziom światła:</span>
          <span className="text-blue-600 font-bold">
            {lightLevel ? `${lightLevel} lux` : "Ładowanie..."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
