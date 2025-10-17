import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface LookmaxingTaskProps {
  task: {
    title: string;
    instructions: string[];
  };
  completed: boolean;
  onComplete: (checked: boolean) => void;
}

export const LookmaxingTask = ({ task, completed, onComplete }: LookmaxingTaskProps) => {
  const handleChange = (checked: boolean) => {
    onComplete(checked);
    if (checked) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706']
      });
    }
  };

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow gradient-accent border-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent-foreground" />
          <div className="flex-1">
            <CardTitle className="text-accent-foreground">Mysterious Lookmaxing Task</CardTitle>
            <CardDescription className="text-accent-foreground/80">Today's facial enhancement routine</CardDescription>
          </div>
          <Checkbox
            checked={completed}
            onCheckedChange={handleChange}
            className="h-6 w-6 border-accent-foreground data-[state=checked]:bg-accent-foreground data-[state=checked]:text-accent"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-lg text-accent-foreground">{task.title}</h3>
        <ul className="space-y-2">
          {task.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-accent-foreground/90">
              <span className="font-bold min-w-[20px]">{index + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
        {completed && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-accent-foreground/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">Completed! Looking good! 💪</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
