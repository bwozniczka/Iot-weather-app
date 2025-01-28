import { IClientOptions } from "mqtt";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { database } from "@/app/firebase/config";

export const getUserMqttId = async (userId: string): Promise<string> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.mqttId || "";
    }
    return "";
  } catch (error) {
    console.error("Błąd podczas pobierania MQTT_ID:", error);
    return "";
  }
};

let currentMqttId = "";

const getTopics = (mqttId: string) => ({
  temperature: `weather-station/${mqttId}/sensors/temperature`,
  humidity: `weather-station/${mqttId}/sensors/humidity`,
  pressure: `weather-station/${mqttId}/sensors/pressure`,
  tvoc: `weather-station/${mqttId}/sensors/tvoc`,
  aqi: `weather-station/${mqttId}/sensors/aqui`,
  eco2: `weather-station/${mqttId}/sensors/c02`,
  light: `weather-station/${mqttId}/sensors/light`,
  interval: `weather-station/${mqttId}/config/interval`,
  BleMac: `weather-station/${mqttId}/sensors/BleMac`,
  BleService: `weather-station/${mqttId}/sensors/BleService`,
  BleUuid: `weather-station/${mqttId}/sensors/BleUuid`,
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const mqttId = await getUserMqttId(user.uid);
    currentMqttId = mqttId;
    // console.log("Zaaktualizowano MQTT_ID:", currentMqttId);
    const topics = getTopics(currentMqttId);
    MQTT_CONFIG.topics = topics;
  } else {
    currentMqttId = "";
    MQTT_CONFIG.topics = getTopics("");
  }
});

export const MQTT_CONFIG = {
  broker: {
    host: "p321361f.ala.dedicated.gcp.emqxcloud.com",
    ports: {
      mqtt: 1883,
      mqttTLS: 8883,
      ws: 8083,
      wsTLS: 8084,
    },
  },
  client: {
    url: "wss://p321361f.ala.dedicated.gcp.emqxcloud.com:8084/mqtt",
    options: {
      keepalive: 60,
      clientId: `mqtt_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      protocol: "wss" as "mqtt" | "mqtts" | "ws" | "wss",
      username: "admin",
      password: "cdV8Sa5eMRGuV3m",
    } as IClientOptions,
  },
  topics: getTopics(currentMqttId),
};
