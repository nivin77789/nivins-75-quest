import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCheckbox } from "./TaskCheckbox";
import { Zap, Sun, Music, Smile, Coffee, Wind } from "lucide-react";

interface DopamineBoostProps {
  tasks: Record<string, boolean>;
  onTaskChange: (taskId: string, checked: boolean) => void;
}

const DOPAMINE_TASKS = [
  { id: "coldShower", label: "Cold shower (2-3 min)", icon: <Wind className="h-4 w-4" /> },
  { id: "sunExposure", label: "15-min morning sunlight", icon: <Sun className="h-4 w-4" /> },
  { id: "music", label: "Listen to motivational music", icon: <Music className="h-4 w-4" /> },
  { id: "gratitude", label: "Write 3 things you're grateful for", icon: <Smile className="h-4 w-4" /> },
  { id: "meditation", label: "10-min meditation", icon: <Zap className="h-4 w-4" /> },
  { id: "socialTime", label: "Quality social interaction", icon: <Smile className="h-4 w-4" /> },
];

export const DopamineBoost = ({ tasks, onTaskChange }: DopamineBoostProps) => {
  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalCount = DOPAMINE_TASKS.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Dopamine Boost
            </CardTitle>
            <CardDescription>Natural dopamine increasers</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-accent bg-clip-text text-transparent">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-muted-foreground">completed</div>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {DOPAMINE_TASKS.map((task) => (
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