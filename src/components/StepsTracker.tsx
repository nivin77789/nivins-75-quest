import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Plus, Minus } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface StepsTrackerProps {
  dailySteps: number;
  onStepsChange: (steps: number) => void;
  currentDate: string;
}

const DAILY_GOAL = 10000;

export const StepsTracker = ({
  dailySteps,
  onStepsChange,
  currentDate,
}: StepsTrackerProps) => {
  const { user } = useAuth();
  const [stepsInput, setStepsInput] = useState<string>("");
  const [totalDeficit, setTotalDeficit] = useState(0);
  const [overallProgress, setOverallProgress] = useState(100);

  useEffect(() => {
    setStepsInput(dailySteps ? dailySteps.toString() : "");
  }, [dailySteps]);

  useEffect(() => {
    calculateOverallProgress();
  }, [currentDate, user]);

  const calculateOverallProgress = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, "users", user.uid, "dailyData"), 
        orderBy("date")
      );
      const querySnapshot = await getDocs(q);

      let cumulativeDeficit = 0;
      let totalExpectedSteps = 0;
      let totalActualSteps = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const steps = data.dailySteps || 0;
        totalActualSteps += steps;
        totalExpectedSteps += DAILY_GOAL;

        const dailyDeficit = Math.max(0, DAILY_GOAL - steps);
        cumulativeDeficit += dailyDeficit;
      });

      setTotalDeficit(cumulativeDeficit);

      if (totalExpectedSteps > 0) {
        const progress = Math.min(
          (totalActualSteps / totalExpectedSteps) * 100,
          100
        );
        setOverallProgress(progress);
      }
    } catch (error) {
      console.error("Error calculating progress:", error);
    }
  };

  const handleSaveSteps = () => {
    const steps = parseInt(stepsInput) || 0;
    onStepsChange(steps);
  };

  const todayProgress = Math.min(((dailySteps || 0) / DAILY_GOAL) * 100, 100);
  const isComplete = (dailySteps || 0) >= DAILY_GOAL;
  const todayDeficit = Math.max(0, DAILY_GOAL - (dailySteps || 0));
  const remainingToBalance = totalDeficit + todayDeficit;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="h-5 w-5 text-accent" />
          Daily Steps
        </CardTitle>
        <CardDescription>
          Goal: {DAILY_GOAL.toLocaleString()} steps/day
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Ring */}
        <div className="flex items-center justify-center">
          <ProgressRing progress={todayProgress} size={140} strokeWidth={10}>
            <div className="text-center">
              <div className="text-2xl font-bold text-grey bg-clip-text">
                {(dailySteps || 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {todayProgress.toFixed(0)}%
              </div>
            </div>
          </ProgressRing>
        </div>

        {/* Stylish Input Field with +/- buttons */}
        <div className="space-y-3">
          <label
            htmlFor="steps-input"
            className="text-sm font-medium block text-center"
          >
            Log your steps
          </label>

          <div className="flex items-center justify-center gap-3">
            {/* Decrement Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setStepsInput((prev) =>
                  Math.max(0, Number(prev || 0) - 500).toString()
                )
              }
              className="h-12 w-12 rounded-full border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200 active:scale-95"
            >
              <Minus className="h-5 w-5" />
            </Button>

            {/* Input Field */}
            <div className="relative">
              <input
                id="steps-input"
                type="number"
                step="100"
                min="0"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                placeholder="0"
                className="w-32 h-12 text-center text-xl font-bold rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
              />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                steps
              </div>
            </div>

            {/* Increment Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setStepsInput((prev) =>
                  (Number(prev || 0) + 500).toString()
                )
              }
              className="h-12 w-12 rounded-full border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={handleSaveSteps}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Save Steps
            </Button>
          </div>
        </div>

        {/* Status messages */}
        {isComplete ? (
          <div className="p-3 gradient-success rounded-lg text-center">
            <p className="text-sm font-semibold text-success-foreground">
              🎉 Daily goal achieved!
            </p>
          </div>
        ) : (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Today's deficit:{" "}
              <span className="font-bold text-foreground">
                {todayDeficit.toLocaleString()}
              </span>{" "}
              steps
            </p>
          </div>
        )}

        {/* Overall progress bar */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          {remainingToBalance > 0 && (
            <p className="text-xs text-muted-foreground">
              Total steps to balance:{" "}
              <span className="font-bold text-foreground">
                {remainingToBalance.toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
