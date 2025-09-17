/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, TrendingUp, Award, Target } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import {
  getDailyPrayers,
  getWeeklyPrayers,
  getMonthlyPrayers,
  getUserBadges,
  getAllBadges,
} from "@/api";
import { useNavigate } from "react-router-dom";

export default function Statistics() {
  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const [weeklyCount, setWeeklyCount] = useState<number | null>(null);
  const [monthlyCount, setMonthlyCount] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [prayerDistribution, setPrayerDistribution] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("access");
    if (!isLoggedIn) navigate("/auth");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch prayers and badges
        const [daily, weeklyResp, monthly, userBadgesResp] = await Promise.all([
          getDailyPrayers(),
          getWeeklyPrayers(),
          getMonthlyPrayers(),
          getUserBadges(),
        ]);

        // --- DAILY ---
        const dailyDone = daily.prayers.filter((p: any) => p.prayed).length;
        setDailyCount(dailyDone);

        // --- WEEKLY ---
        const weekly = weeklyResp.prayers.map((day: any) => ({
          day: day.day,
          prayers: day.prayed.filter((v: boolean) => v).length,
        }));
        setWeeklyData(weekly);
        setWeeklyCount(weekly.reduce((acc, day) => acc + day.prayers, 0));

        // --- MONTHLY ---
        const monthTotal = monthly.prayers.reduce(
          (acc: number, day: any) =>
            acc + day.prayed.filter((v: boolean) => v).length,
          0
        );
        setMonthlyCount(monthTotal);

        // Prepare Prayer Distribution for the month
        const prayerNames = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];
        const colors = [
          "hsla(220, 69%, 43%, 1.00)",
          "hsl(45 80% 60%)",
          "hsl(25 70% 50%)",
          "hsl(340 70% 50%)",
          "hsla(240, 54%, 41%, 1.00)",
        ];
        const distribution = prayerNames.map((name, index) => {
          let total = 0;
          monthly.prayers.forEach((day: any) => {
            if (day.prayed[index]) total += 1;
          });
          return { name, value: total, color: colors[index] };
        });
        setPrayerDistribution(distribution);

        // --- BADGES ---
        const all = await getAllBadges();
        const badges = all.map((badge: any) => {
          const earnedBadge = userBadgesResp.badges.find(
            (b: any) => b.badge_id === badge.id
          );
          return {
            ...badge,
            earned: !!earnedBadge,
            awarded_at: earnedBadge?.awarded_at || null,
          };
        });
        setAllBadges(badges);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Prayer Statistics</h1>
          <p className="text-muted-foreground">Track your spiritual progress</p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card border-0 shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-2xl font-bold">{dailyCount}/5</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">{weeklyCount}/35</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                      <p className="text-2xl font-bold">{monthlyCount}/150</p>
                    </div>
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-0 shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Badges</p>
                      <p className="text-2xl font-bold">
                        {allBadges.filter((b) => b.earned).length}/
                        {allBadges.length}
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Weekly Progress */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar
                        dataKey="prayers"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Prayer Distribution */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Prayer Distribution (This Month)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prayerDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {prayerDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allBadges.length > 0 ? (
                    allBadges.map((badge: any) => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border ${
                          badge.earned
                            ? "bg-accent/10 border-accent/20"
                            : "bg-gray-100 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <Badge variant={badge.earned ? "default" : "outline"}>
                            {badge.earned ? "Earned" : "Not Earned"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                        {badge.earned && badge.awarded_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Awarded at:{" "}
                            {new Date(badge.awarded_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No achievements available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
