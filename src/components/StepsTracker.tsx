import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Footprints } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";

interface StepsTrackerProps {
  dailySteps: number;
  onStepsChange: (steps: number) => void;
  currentDate: string;
}

const DAILY_GOAL = 10000;

export const StepsTracker = ({ dailySteps, onStepsChange, currentDate }: StepsTrackerProps) => {
  const [stepsInput, setStepsInput] = useState(dailySteps.toString());
  const [totalDeficit, setTotalDeficit] = useState(0);
  const [overallProgress, setOverallProgress] = useState(100);

  useEffect(() => {
    setStepsInput(dailySteps.toString());
  }, [dailySteps]);

  useEffect(() => {
    calculateOverallProgress();
  }, [currentDate]);

  const calculateOverallProgress = async () => {
    try {
      const q = query(collection(db, "dailyData"), orderBy("date"));
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
        const progress = Math.min((totalActualSteps / totalExpectedSteps) * 100, 100);
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

  const todayProgress = Math.min((dailySteps / DAILY_GOAL) * 100, 100);
  const isComplete = dailySteps >= DAILY_GOAL;
  const todayDeficit = Math.max(0, DAILY_GOAL - dailySteps);
  const remainingToBalance = totalDeficit + todayDeficit;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="h-5 w-5 text-accent" />
          Daily Steps
        </CardTitle>
        <CardDescription>Goal: {DAILY_GOAL.toLocaleString()} steps/day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <ProgressRing progress={todayProgress} size={140} strokeWidth={10}>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                {dailySteps.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {todayProgress.toFixed(0)}%
              </div>
            </div>
          </ProgressRing>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="steps-input" className="text-sm font-medium">
            Enter today's steps
          </label>
          <div className="flex gap-2">
            <Input
              id="steps-input"
              type="number"
              step="100"
              min="0"
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              className="text-center text-lg font-semibold"
            />
            <Button onClick={handleSaveSteps} size="sm">
              Save
            </Button>
          </div>
        </div>

        {isComplete ? (
          <div className="p-3 gradient-success rounded-lg text-center">
            <p className="text-sm font-semibold text-success-foreground">
              🎉 Daily goal achieved!
            </p>
          </div>
        ) : (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Today's deficit: <span className="font-bold text-foreground">{todayDeficit.toLocaleString()}</span> steps
            </p>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          {remainingToBalance > 0 && (
            <p className="text-xs text-muted-foreground">
              Total steps to balance: <span className="font-bold text-foreground">{remainingToBalance.toLocaleString()}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};