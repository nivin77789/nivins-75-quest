import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCheckbox } from "./TaskCheckbox";
import { Apple, Droplet, Dumbbell, TreePine, BookOpen, Camera, Heart, Cigarette, Candy, Lightbulb } from "lucide-react";

interface DailyTasksProps {
  tasks: Record<string, boolean>;
  onTaskChange: (taskId: string, checked: boolean) => void;
}

const TASK_LIST = [
  { id: "diet", label: "Follow diet (no cheat meals, no alcohol)", icon: <Apple className="h-4 w-4" /> },
  { id: "water", label: "Drink 1 gallon water (3.8L)", icon: <Droplet className="h-4 w-4" /> },
  { id: "workout1", label: "45-min indoor workout", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "workout2", label: "45-min outdoor workout", icon: <TreePine className="h-4 w-4" /> },
  { id: "reading", label: "Read 10 pages (Atomic Habits)", icon: <BookOpen className="h-4 w-4" /> },
  { id: "photo", label: "Take daily progress photo", icon: <Camera className="h-4 w-4" /> },
  { id: "learnNew", label: "Learn something new", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "noFap", label: "No fap", icon: <Heart className="h-4 w-4" /> },
  { id: "noCigarette", label: "No cigarette", icon: <Cigarette className="h-4 w-4" /> },
  { id: "sugarCut", label: "Sugar cut", icon: <Candy className="h-4 w-4" /> },
];

export const DailyTasks = ({ tasks, onTaskChange }: DailyTasksProps) => {
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalCount = TASK_LIST.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">75 Hard Daily Tasks</CardTitle>
            <CardDescription>Complete all tasks every day</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-clip-text text-grey">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-muted-foreground">completed</div>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {TASK_LIST.map((task) => (
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
