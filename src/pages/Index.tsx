import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, Trophy, Heart, Moon, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import heroImage from "@/assets/hero-prayer.jpg";

const Index = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: "Track Your Prayers",
      description: "Log your daily prayers and build consistent habits"
    },
    {
      icon: Users,
      title: "Friend Groups",
      description: "Join friends and motivate each other in worship"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your spiritual journey with detailed stats"
    },
    {
      icon: Trophy,
      title: "Leaderboards",
      description: "Healthy competition to encourage regular prayers"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-gradient-primary">
                  Prayer Tracking Made Beautiful
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Stay Connected to Your{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Prayers
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mt-6">
                  Track your daily prayers, compete with friends, and build lasting spiritual habits. 
                  Never miss Fajr again with our motivational community platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-smooth">
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <Moon className="w-5 h-5" />
                    <span>Start Tracking</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span>1000+ Active Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-accent" />
                  <span>50k+ Prayers Logged</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 rounded-3xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Peaceful prayer scene" 
                className="relative rounded-3xl shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">
              Powerful features to help you maintain consistent prayers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-smooth">
                <CardContent className="bg-card rounded-md p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-primary text-white shadow-glow">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Prayer Life?</h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of Muslims building better prayer habits together
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/dashboard">Get Started Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
