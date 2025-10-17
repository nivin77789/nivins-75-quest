import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCheckbox } from "./TaskCheckbox";
import { Trophy, Bed, Dumbbell, Beef, Sun, Shield } from "lucide-react";

interface TestosteroneBoostProps {
  tasks: Record<string, boolean>;
  onTaskChange: (taskId: string, checked: boolean) => void;
}

const TESTOSTERONE_TASKS = [
  { id: "heavyLifting", label: "Heavy compound lifts (Squat/Deadlift/Bench)", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "sleep7hrs", label: "Sleep 7-9 hours", icon: <Bed className="h-4 w-4" /> },
  { id: "proteinIntake", label: "Eat protein-rich foods (eggs, meat, fish)", icon: <Beef className="h-4 w-4" /> },
  { id: "vitaminD", label: "Vitamin D (sun or supplement)", icon: <Sun className="h-4 w-4" /> },
  { id: "zincMagnesium", label: "Zinc & Magnesium rich foods", icon: <Shield className="h-4 w-4" /> },
  { id: "stressManagement", label: "Manage stress (meditation/breathing)", icon: <Trophy className="h-4 w-4" /> },
];

export const TestosteroneBoost = ({ tasks, onTaskChange }: TestosteroneBoostProps) => {
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalCount = TESTOSTERONE_TASKS.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              Testosterone Boost
            </CardTitle>
            <CardDescription>Natural testosterone increasers</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-muted-foreground">completed</div>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {TESTOSTERONE_TASKS.map((task) => (
          <TaskCheckbox
            key={task.id}
            id={task.id}
            label={task.label}
            checked={tasks[task.id] || false}
            onChange={(checked) => onTaskChange(task.id, checked)}
            icon={task.icon}
          />
        ))}
      </CardContent>
    </Card>
  );
};