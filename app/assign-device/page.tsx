"use client";

import { useState } from "react";
import { assignDevice } from "@/lib/devices";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "@/app/firebase/config";
import { ref, get } from "firebase/database";

export default function AssignDevice() {
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, userLoading] = useAuthState(auth);

  const checkDeviceExists = async (deviceId: string) => {
    console.log("Sprawdzam urządzenie:", deviceId);
    const deviceRef = ref(database, "devices");
    const snapshot = await get(deviceRef);

    if (!snapshot.exists()) {
      console.log("Brak urządzeń w bazie");
      return false;
    }

    const devices = snapshot.val();
    console.log("Dane z bazy:", devices);

    return devices.deviceName === deviceId;
  };

  const handleAssign = async () => {
    if (!deviceId) {
      alert("Wprowadź ID urządzenia!");
      return;
    }

    if (!user || userLoading) {
      alert("Musisz być zalogowany!");
      return;
    }

    setLoading(true);
    try {
      const deviceExists = await checkDeviceExists(deviceId);
      console.log("Wynik sprawdzenia:", deviceExists);

      if (!deviceExists) {
        alert("Urządzenie o podanym ID nie istnieje w bazie!");
        return;
      }

      await assignDevice(user.uid, deviceId);
      alert("Urządzenie zostało przypisane pomyślnie!");
    } catch (error) {
      console.error("Błąd:", error);
      alert("Wystąpił błąd podczas przypisywania urządzenia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <h1>Assign Device</h1>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Device ID"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
        <button
          onClick={handleAssign}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Assigning..." : "Assign Device"}
        </button>
      </div>
    </AuthGuard>
  );
}
