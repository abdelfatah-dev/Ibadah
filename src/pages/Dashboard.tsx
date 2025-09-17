/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Flame, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { getDailyPrayers, getUserRank, updatePrayer } from "@/api"; // 🟢 خلي بالك لازم تستدعي getDailyPrayers
import { useNavigate } from "react-router-dom";

interface Prayer {
  name: string;
  title: string;
  time: string;
  completed: boolean;
  gradient: string;
}

const basePrayers: Prayer[] = [
  {
    name: "Fajr",
    title: "الفجر",
    time: "5:30 AM",
    completed: false,
    gradient: "bg-gradient-fajr",
  },
  {
    name: "Dhuhr",
    title: "الظهر",
    time: "1:15 PM",
    completed: false,
    gradient: "bg-gradient-dhuhr",
  },
  {
    name: "Asr",
    title: "العصر",
    time: "4:45 PM",
    completed: false,
    gradient: "bg-gradient-asr",
  },
  {
    name: "Maghrib",
    title: "المغرب",
    time: "7:20 PM",
    completed: false,
    gradient: "bg-gradient-maghrib",
  },
  {
    name: "Isha",
    title: "العشاء",
    time: "8:45 PM",
    completed: false,
    gradient: "bg-gradient-isha",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [prayers, setPrayers] = useState<Prayer[]>(basePrayers);
  const [username, setUsername] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const [error, setError] = useState("");

  // ✅ لو المستخدم مش مسجل دخول يتوجه على /auth + Rank
  useEffect(() => {
    const checkLoginAndFetchRank = async () => {
      const isLoggedIn = !!localStorage.getItem("access");
      if (!isLoggedIn) {
        navigate("/auth");
        return;
      }

      try {
        const data = await getUserRank();
        setRank(data.rank);
        setUsername(localStorage.getItem("username"));
      } catch (err) {
        console.error("Failed to fetch user rank:", err);
      }
    };

    checkLoginAndFetchRank();
  }, [navigate]);

  // ✅ تحميل الصلوات من السيرفر وتحديث حالة completed
  useEffect(() => {
    async function fetchPrayers() {
      try {
        const data = await getDailyPrayers();
        // API بيرجع prayers: [{ prayer: "fajr", prayed: true }, ...]

        const prayedSet = new Set(
          data.prayers
            .filter((p: any) => p.prayed)
            .map((p: any) => p.prayer.toLowerCase())
        );

        setPrayers(
          basePrayers.map((p) => ({
            ...p,
            completed: prayedSet.has(p.name.toLowerCase()),
          }))
        );
      } catch (err) {
        console.error("Failed to load prayers:", err);
        setError("⚠️ Could not load today's prayers.");
      }
    }

    fetchPrayers();
  }, []);

  // ✅ تحديث الصلاة (Toggle + API)
  const togglePrayer = async (index: number) => {
    setPrayers((prev) =>
      prev.map((prayer, i) =>
        i === index ? { ...prayer, completed: !prayer.completed } : prayer
      )
    );

    try {
      const prayer = prayers[index];
      await updatePrayer(prayer.name.toLowerCase(), !prayer.completed);
      console.log("Prayer updated ✅");
    } catch (err) {
      console.error("Failed to update prayer:", err);
    }
  };

  const completedCount = prayers.filter((p) => p.completed).length;
  const currentStreak = 7; // Mock data

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            As-Salamu Alaykum, {username || "Guest"}!
          </h1>
          <p className="text-muted-foreground">
            May Allah accept your prayers today
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">تقدم اليوم</p>
                  <p className="text-2xl font-bold">{completedCount}/5</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">التقدم الحالي</p>
                  <p className="text-2xl font-bold">{currentStreak} يوم</p>
                </div>
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الترتيب</p>
                  <p className="text-2xl font-bold">
                    {rank !== null ? `#${rank}` : "-"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Prayers */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>صلوات اليوم</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prayers.map((prayer, index) => (
              <div
                key={prayer.name}
                className={`p-4 rounded-xl border transition-smooth ${
                  prayer.completed
                    ? "bg-prayer-completed/10 border-prayer-completed/20"
                    : "bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${prayer.gradient} rounded-lg flex items-center justify-center`}
                    >
                      <span className="text-white font-semibold text-sm">
                        {prayer.title}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{prayer.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {prayer.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {prayer.completed && (
                      <Badge
                        variant="outline"
                        className="text-prayer-completed border-prayer-completed"
                      >
                        تم
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePrayer(index)}
                      className={`transition-all ${
                        prayer.completed
                          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                          : "bg-accent text-accent-foreground border-accent hover:bg-accent/90"
                      }`}
                    >
                      {prayer.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-primary text-white shadow-glow">
          <CardContent className="p-6 text-center">
            <p className="text-lg mb-2">
              "And establish prayer at the two ends of the day and at the
              approach of the night."
            </p>
            <p className="text-sm opacity-90">Quran 11:114</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
