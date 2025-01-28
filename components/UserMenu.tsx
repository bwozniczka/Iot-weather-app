"use client";

import { useState, useRef, useEffect } from "react";
import mqtt from "mqtt";
import { MQTT_CONFIG } from "@/lib/mqtt/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";

export function UserMenu() {
  const [interval, setInterval] = useState<string>("2000");
  const [isSending, setIsSending] = useState(false);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const client = mqtt.connect(
      MQTT_CONFIG.client.url,
      MQTT_CONFIG.client.options
    );
    clientRef.current = client;

    client.on("connect", () => {
      console.log("Połączono z brokerem MQTT");

      client.subscribe(`weather-station/4tmYZsl99D/config/interval`);
    });

    return () => {
      client.end();
    };
  }, []);

  const publishInterval = async (value: string) => {
    if (!clientRef.current) {
      throw new Error("Brak połączenia MQTT");
    }

    try {
      setIsSending(true);
      const topic = `weather-station/4tmYZsl99D/config/interval`;

      clientRef.current.publish(topic, value, (error) => {
        if (error) {
          console.error("Błąd wysyłania interwału:", error);
          throw error;
        }
        console.log("Wysłano nowy interwał:", value);
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleIntervalChange = async (value: string) => {
    setInterval(value);
    try {
      await publishInterval(value);
    } catch (error) {
      console.error("Błąd podczas zmiany interwału:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      console.log("Wylogowano pomyślnie");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end(true);
        clientRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-end gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-white">Interwał odświeżania:</span>
        <Select onValueChange={handleIntervalChange} value={interval}>
          <SelectTrigger className="w-32 bg-white">
            <SelectValue placeholder="Wybierz interwał" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">Co 2s</SelectItem>
            <SelectItem value="5000">Co 5s</SelectItem>
            <SelectItem value="10000">Co 10s</SelectItem>
            <SelectItem value="30000">Co 30s</SelectItem>
            <SelectItem value="60000">Co 1min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Link
        href="/assign-device"
        className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        <FaPlus className="w-4 h-4" />
        Przypisz urządzenie
      </Link>

      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Wyloguj się
      </button>
    </div>
  );
}
