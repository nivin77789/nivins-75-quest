import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Zap, Heart, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const workoutCategories = [
  {
    title: "HIIT",
    description: "High-intensity interval training",
    icon: Zap,
    duration: "20-30 min",
    level: "Intermediate",
    calories: "300-400"
  },
  {
    title: "Strength Training",
    description: "Build muscle and increase strength",
    icon: Dumbbell,
    duration: "45-60 min",
    level: "All Levels",
    calories: "200-350"
  },
  {
    title: "Cardio",
    description: "Boost your heart health",
    icon: Heart,
    duration: "30-45 min",
    level: "Beginner",
    calories: "250-400"
  },
  {
    title: "Fat Burn",
    description: "Maximize calorie burn",
    icon: Flame,
    duration: "40-50 min",
    level: "Intermediate",
    calories: "400-550"
  }
];

export default function Workouts() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Workouts</h1>
        <p className="text-muted-foreground text-lg">
          Choose from a variety of workout programs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workoutCategories.map((category) => (
          <Card key={category.title} className="card-shadow hover:card-shadow-hover transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {category.duration}
                </Badge>
                <Badge variant="outline">{category.level}</Badge>
                <Badge variant="outline">
                  <Flame className="h-3 w-3 mr-1" />
                  {category.calories} cal
                </Badge>
              </div>
              <Button className="w-full">Start Workout</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-shadow mt-8">
        <CardHeader>
          <CardTitle>Personal Training</CardTitle>
          <CardDescription>Get customized workout plans from certified trainers</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Book a Session</Button>
        </CardContent>
      </Card>
    </div>
  );
}
