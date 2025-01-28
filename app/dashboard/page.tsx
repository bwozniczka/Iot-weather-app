import { BME280Card } from "@/components/BME280Card";
import { AuthGuard } from "@/components/AuthGuard";
import { UserMenu } from "@/components/UserMenu";
import { ENS160Card } from "@/components/ENS160Card";
import { KY018Card } from "@/components/KY018Card";

export default function Dashboard() {
  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute top-0 left-0 w-full">
          <UserMenu />
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-20">
          <h1 className="text-3xl font-bold text-white mb-8">
            Panel kontrolny stacji pogodowej
          </h1>

          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              <ENS160Card />
              <KY018Card />
              <BME280Card />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
