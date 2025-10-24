import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Flame, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const programs = [
  {
    title: "75 Hard Challenge",
    description: "Transform your life in 75 days with strict daily tasks",
    icon: Trophy,
    duration: "75 days",
    difficulty: "Hard",
    link: "/75-hard-challenge"
  },
  {
    title: "30-Day Shred",
    description: "Lose weight and get toned in just 30 days",
    icon: Flame,
    duration: "30 days",
    difficulty: "Intermediate"
  },
  {
    title: "Strength Builder",
    description: "Build muscle and increase your strength over 12 weeks",
    icon: Target,
    duration: "12 weeks",
    difficulty: "Beginner-Intermediate"
  },
  {
    title: "Yoga Journey",
    description: "Improve flexibility and mindfulness with daily yoga",
    icon: Calendar,
    duration: "21 days",
    difficulty: "All Levels"
  }
];

export default function Programs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Programs</h1>
        <p className="text-muted-foreground text-lg">
          Structured fitness and wellness programs to reach your goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program) => (
          <Card key={program.title} className="card-shadow hover:card-shadow-hover transition-all">
            <CardHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <program.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="px-3 py-1 rounded-full bg-muted text-sm">
                  {program.duration}
                </div>
                <div className="px-3 py-1 rounded-full bg-muted text-sm">
                  {program.difficulty}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {program.link ? (
                <Link to={program.link}>
                  <Button className="w-full">Start Program</Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>Coming Soon</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
