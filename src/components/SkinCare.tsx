import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCheckbox } from "./TaskCheckbox";
import { Sun, Moon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SkinCareProps {
  tasks: Record<string, boolean>;
  onTaskChange: (taskId: string, checked: boolean) => void;
}

const SKINCARE_TASKS = [
  { 
    id: "day_cleanser", 
    label: "Morning cleanser", 
    icon: <Sun className="h-4 w-4" />,
    type: "day"
  },
  { 
    id: "day_toner", 
    label: "Morning toner", 
    icon: <Sun className="h-4 w-4" />,
    type: "day"
  },
  { 
    id: "day_moisturizer", 
    label: "Morning moisturizer + SPF", 
    icon: <Sun className="h-4 w-4" />,
    type: "day"
  },
  { 
    id: "night_cleanser", 
    label: "Night cleanser", 
    icon: <Moon className="h-4 w-4" />,
    type: "night"
  },
  { 
    id: "night_toner", 
    label: "Night toner", 
    icon: <Moon className="h-4 w-4" />,
    type: "night"
  },
  { 
    id: "night_serum", 
    label: "Night serum", 
    icon: <Moon className="h-4 w-4" />,
    type: "night"
  },
  { 
    id: "night_moisturizer", 
    label: "Night moisturizer", 
    icon: <Moon className="h-4 w-4" />,
    type: "night"
  },
];

export const SkinCare = ({ tasks, onTaskChange }: SkinCareProps) => {
  const safeTasks = tasks || {};
  const completedCount = Object.values(safeTasks).filter(Boolean).length;
  const totalCount = SKINCARE_TASKS.length;
  const progress = (completedCount / totalCount) * 100;

  const dayTasks = SKINCARE_TASKS.filter(t => t.type === "day");
  const nightTasks = SKINCARE_TASKS.filter(t => t.type === "night");

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Skincare Routine</CardTitle>
            <CardDescription>Day & Night skincare regimen</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              {completedCount}/{totalCount}
            </div>
            <div className="text-xs text-muted-foreground">completed</div>
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Sun className="h-4 w-4" />
            Morning Routine
          </h3>
          {dayTasks.map((task) => (
            <TaskCheckbox
              key={task.id}
              id={task.id}
              label={task.label}
              checked={safeTasks[task.id] || false}
              onChange={(checked) => onTaskChange(task.id, checked)}
              icon={task.icon}
            />
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Moon className="h-4 w-4" />
            Night Routine
          </h3>
          {nightTasks.map((task) => (
            <TaskCheckbox
              key={task.id}
              id={task.id}
              label={task.label}
              checked={safeTasks[task.id] || false}
              onChange={(checked) => onTaskChange(task.id, checked)}
              icon={task.icon}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};