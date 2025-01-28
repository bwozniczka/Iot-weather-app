"use client";

import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { ref, set } from "firebase/database";
import { database } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignUp = async () => {
    try {
      if (!email || !password) {
        alert("Email i hasło muszą być wypełnione.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential && userCredential.user) {
        await set(ref(database, "users/" + userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          deviceId: "",
        });

        sessionStorage.setItem("user", "true");
        router.push("/dashboard");
      }
    } catch (e) {
      console.error("Błąd podczas rejestracji:", e);
      alert("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    console.error("Błąd rejestracji:", error.message);
    alert("Błąd rejestracji: " + error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
