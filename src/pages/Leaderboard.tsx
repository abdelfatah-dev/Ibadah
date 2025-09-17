import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Flame, Crown } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const username = localStorage.getItem("username");
const profilePic = localStorage.getItem("profilePic"); // الصورة من الـ localStorage

const leaderboardData = [
  { rank: 1, name: "Fatima Al-Zahra", prayers: 34, streak: 12, avatar: "FA", isUser: false },
  { rank: 2, name: `${username} (You)`, prayers: 31, streak: 7, avatar: "AH", isUser: true },
  { rank: 3, name: "Omar Ibn Khattab", prayers: 29, streak: 5, avatar: "OI", isUser: false },
  { rank: 4, name: "Aisha Siddiq", prayers: 28, streak: 8, avatar: "AS", isUser: false },
  { rank: 5, name: "Ali Ibn Abi Talib", prayers: 26, streak: 3, avatar: "AI", isUser: false }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2: return <Medal className="w-5 h-5 text-gray-400" />;
    case 3: return <Award className="w-5 h-5 text-amber-600" />;
    default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case 2: return "bg-gradient-to-r from-gray-300 to-gray-500";
    case 3: return "bg-gradient-to-r from-amber-400 to-amber-600";
    default: return "bg-gradient-primary";
  }
};

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prayer Leaderboard</h1>
          <p className="text-muted-foreground">Compete with your friends in righteousness</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboardData.slice(0, 3).map((user, index) => {
            const positions = [1, 0, 2];
            const actualIndex = positions[index];
            const actualUser = leaderboardData[actualIndex];

            return (
              <Card 
                key={actualUser.rank}
                className={`relative overflow-hidden shadow-elegant ${actualUser.rank === 1 ? "md:order-2 transform md:scale-105" : actualUser.rank === 2 ? "md:order-1" : "md:order-3"} ${actualUser.isUser ? "ring-2 ring-primary" : ""}`}
              >
                <div className={`h-2 ${getRankColor(actualUser.rank)}`} />
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{getRankIcon(actualUser.rank)}</div>

                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    {actualUser.isUser && profilePic ? (
                      <AvatarImage src={profilePic} />
                    ) : (
                      <AvatarFallback className="text-lg font-bold bg-gradient-primary text-white">
                        {actualUser.avatar}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <h3 className="font-semibold mb-2">{actualUser.name}</h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full">
                      {actualUser.prayers}/35 prayers
                    </Badge>
                    <Badge variant="outline" className="w-full flex items-center justify-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>{actualUser.streak} day streak</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>This Week's Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-smooth ${user.isUser ? "bg-primary/10 border border-primary/20" : "bg-card hover:bg-muted/50"}`}
                >
                  <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>

                  <Avatar>
                    {user.isUser && profilePic ? (
                      <AvatarImage src={profilePic} />
                    ) : (
                      <AvatarFallback className="bg-gradient-primary text-white">{user.avatar}</AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.prayers} prayers completed</p>
                  </div>

                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">{Math.round((user.prayers / 35) * 100)}%</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Flame className="w-3 h-3" />
                      <span>{user.streak}d</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Section */}
        <Card className="mt-8 bg-gradient-primary text-white shadow-glow">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
            <p className="mb-4">"And whoever competes in righteousness, let him compete in this."</p>
            <p className="text-sm opacity-90">Quran 83:26</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
