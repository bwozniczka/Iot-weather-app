import { ref, update, get } from "firebase/database";
import { database } from "@/app/firebase/config";

export async function assignDevice(userId: string, deviceId: string) {
  try {
    const deviceRef = ref(database, "devices");
    const deviceSnapshot = await get(deviceRef);

    if (!deviceSnapshot.exists()) {
      throw new Error("Nie znaleziono urządzeń w bazie");
    }

    const devices = deviceSnapshot.val();
    if (devices.deviceName !== deviceId) {
      throw new Error("Nie znaleziono urządzenia o podanym ID");
    }

    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      deviceId: devices.deviceName,
      mqttId: devices.MQTT_ID,
      lastLogin: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Błąd podczas przypisywania urządzenia:", error);
    throw error;
  }
}
