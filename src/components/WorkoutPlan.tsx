import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCheckbox } from "./TaskCheckbox";
import { Dumbbell, Home } from "lucide-react";
import { differenceInDays } from "date-fns";
import { USER_INFO } from "@/lib/constants";

interface WorkoutPlanProps {
  workouts: Record<string, boolean>;
  onWorkoutChange: (workoutId: string, checked: boolean) => void;
  currentDate: string;
}

const HOME_WORKOUTS = [
  { id: "pushups", label: "50 Push-ups" },
  { id: "squats", label: "100 Squats" },
  { id: "plank", label: "3-min Plank" },
  { id: "burpees", label: "30 Burpees" },
  { id: "lunges", label: "50 Lunges (each leg)" },
  { id: "mountainClimbers", label: "100 Mountain Climbers" },
  { id: "jumpingJacks", label: "100 Jumping Jacks" },
];

const GYM_WORKOUTS = [
  { id: "chest", label: "Chest: Bench Press 4×10, Dumbbell Fly 3×12" },
  { id: "back", label: "Back: Pull-ups 4×8, Rows 4×10" },
  { id: "legs", label: "Legs: Squats 4×10, Leg Press 3×12" },
  { id: "shoulders", label: "Shoulders: OHP 4×10, Lateral Raise 3×12" },
  { id: "arms", label: "Arms: Bicep Curls 3×12, Tricep Dips 3×12" },
  { id: "core", label: "Core: Ab Wheel 3×15, Hanging Leg Raise 3×12" },
  { id: "cardio", label: "Cardio: 20-min HIIT or Run" },
];

export const WorkoutPlan = ({ workouts, onWorkoutChange, currentDate }: WorkoutPlanProps) => {
  const dayNumber = differenceInDays(new Date(currentDate), new Date(USER_INFO.startDate)) + 1;
  const isHomeWorkout = dayNumber <= 15;
  const workoutList = isHomeWorkout ? HOME_WORKOUTS : GYM_WORKOUTS;
  
  // Safely handle workouts object
  const safeWorkouts = workouts || {};
  const completedCount = Object.values(safeWorkouts).filter(Boolean).length;
  const totalCount = workoutList.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const currentWeight = 90; // This should come from props
  const targetWeight = 65;
  const daysRemaining = differenceInDays(new Date(USER_INFO.endDate), new Date(currentDate));
  const weightToLose = currentWeight - targetWeight;
  const dailyWeightLoss = daysRemaining > 0 ? (weightToLose / daysRemaining).toFixed(2) : 0;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isHomeWorkout ? (
              <Home className="h-5 w-5 text-primary" />
            ) : (
              <Dumbbell className="h-5 w-5 text-primary" />
            )}
            <div>
              <CardTitle className="text-2xl">
                {isHomeWorkout ? "Home Workouts" : "Gym Workouts"}
              </CardTitle>
              <CardDescription>
                {isHomeWorkout ? `Days 1-15: Home Training` : `Day ${dayNumber}: Gym Training`}
              </CardDescription>
            </div>
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
            className="h-full gradient-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 gradient-primary rounded-lg">
          <div className="text-center text-primary-foreground">
            <div className="text-sm font-medium mb-1">Weight Loss Goal</div>
            <div className="text-2xl font-bold">{currentWeight}kg → {targetWeight}kg</div>
            <div className="text-xs mt-1 opacity-90">
              Lose {dailyWeightLoss}kg/day for {daysRemaining} days
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {workoutList.map((workout) => (
            <TaskCheckbox
              key={workout.id}
              id={workout.id}
              label={workout.label}
              checked={safeWorkouts[workout.id] || false}
              onChange={(checked) => onWorkoutChange(workout.id, checked)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};