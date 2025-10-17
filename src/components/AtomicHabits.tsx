import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";

interface AtomicHabitsProps {
  content: {
    day: number;
    topic: string;
    points: string[];
  };
}

export const AtomicHabits = ({ content }: AtomicHabitsProps) => {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Atomic Habits - Day {content.day}</CardTitle>
            <CardDescription>{content.topic}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {content.points.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
