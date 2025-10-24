import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Apple, Trophy, Activity, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { userProfile } = useAuth();

  const features = [
    {
      title: "Workouts",
      description: "Access hundreds of workout classes and programs",
      icon: Dumbbell,
      link: "/workouts",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Nutrition",
      description: "Personalized meal plans and calorie tracking",
      icon: Apple,
      link: "/nutrition",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "75 Hard Challenge",
      description: "Transform yourself in 75 days",
      icon: Trophy,
      link: "/75-hard-challenge",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Programs",
      description: "Structured fitness and wellness programs",
      icon: Calendar,
      link: "/programs",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {userProfile?.name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">1</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workouts This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-secondary" />
              <span className="text-3xl font-bold">5</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span className="text-3xl font-bold">2,450</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link}>
              <Card className="card-shadow hover:card-shadow-hover transition-all h-full cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Recommendation */}
      <Card className="card-shadow gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Today's Recommendation</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Based on your fitness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Complete a 30-minute HIIT workout and track your meals to stay on target with your calories.
          </p>
          <Link to="/workouts">
            <Button variant="secondary">
              Start Workout
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
