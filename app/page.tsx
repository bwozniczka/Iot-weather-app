"use client";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 backdrop-blur-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Smart Weather Station
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Zarządzaj swoją inteligentną stacją pogodową. Monitoruj temperaturę,
            wilgotność i inne parametry w czasie rzeczywistym.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 
              rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 
              shadow-lg hover:shadow-xl"
            >
              Panel sterowania
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 
                rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 
                shadow-lg hover:shadow-xl"
              >
                Zaloguj się
              </Link>
              <Link
                href="/sign-up"
                className="px-8 py-4 text-lg font-semibold text-blue-600 
                bg-white rounded-lg hover:bg-gray-100 transition-all transform 
                hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Zarejestruj się
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
