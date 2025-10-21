import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints } from "lucide-react";
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

        {/* Stylish + / - Input Field */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <label
            htmlFor="steps-input"
            className="text-sm font-medium text-gray-700 tracking-wide"
          >
            Enter today's steps
          </label>

          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center border rounded-lg bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setStepsInput((prev) =>
                    Math.max(0, Number(prev || 0) - 100).toString()
                  )
                }
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all text-sm"
              >
                −
              </button>

              <input
                id="steps-input"
                type="number"
                step="100"
                min="0"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                placeholder="–––"
                className="w-20 text-center text-sm font-semibold border-x bg-transparent focus:outline-none focus:ring-0"
              />

              <button
                type="button"
                onClick={() =>
                  setStepsInput((prev) =>
                    (Number(prev || 0) + 100).toString()
                  )
                }
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all text-sm"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleSaveSteps}
              size="sm"
              className="rounded-md bg-blue-500 text-white font-medium text-sm px-4 py-1.5 hover:bg-blue-600 transition-all"
            >
              Save
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
