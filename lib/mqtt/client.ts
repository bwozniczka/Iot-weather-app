import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { MQTT_CONFIG } from "./config";

type MessageCallback = (topic: string, message: string) => void;

class MQTTClientWrapper {
  private static instance: MQTTClientWrapper;
  private client: MqttClient | null = null;
  private messageCallbacks: MessageCallback[] = [];

  private constructor() {}

  static getInstance(): MQTTClientWrapper {
    if (!MQTTClientWrapper.instance) {
      MQTTClientWrapper.instance = new MQTTClientWrapper();
    }
    return MQTTClientWrapper.instance;
  }

  connect() {
    if (!this.client) {
      try {
        const options: IClientOptions = {
          ...MQTT_CONFIG.client.options,
          username: "admin",
          password: "cdV8Sa5eMRGuV3m",
          protocol: "wss" as "wss",
        };

        this.client = mqtt.connect(MQTT_CONFIG.client.url, options);

        this.client.on("connect", () => {
          // console.log("Połączono z brokerem MQTT");
          this.subscribeToTopics();
        });

        this.client.on("message", (topic: string, message: Buffer) => {
          const messageStr = message.toString();
          this.messageCallbacks.forEach((callback) =>
            callback(topic, messageStr)
          );
        });

        this.client.on("error", (error) => {
          console.error("Błąd MQTT:", error);
        });

        this.client.on("close", () => {
          console.log("Połączenie MQTT zakończone");
        });
      } catch (error) {
        console.error("Błąd podczas inicjalizacji MQTT:", error);
      }
    }
  }

  private subscribeToTopics() {
    if (this.client) {
      Object.values(MQTT_CONFIG.topics).forEach((topic) => {
        this.client?.subscribe(topic, (err) => {
          if (err) {
            console.error(`Błąd subskrypcji ${topic}:`, err);
          }
        });
      });
    }
  }

  onMessage(callback: MessageCallback) {
    this.messageCallbacks.push(callback);
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.messageCallbacks = [];
    }
  }
}

export const mqttClient = MQTTClientWrapper.getInstance();
