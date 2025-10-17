import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Droplet } from "lucide-react";
import { ProgressRing } from "./ProgressRing";

interface WaterTrackerProps {
  waterIntake: number;
  onWaterChange: (liters: number) => void;
}

const DAILY_GOAL = 3.8; // liters (1 gallon)

export const WaterTracker = ({ waterIntake, onWaterChange }: WaterTrackerProps) => {
  const progress = Math.min((waterIntake / DAILY_GOAL) * 100, 100);
  const isComplete = waterIntake >= DAILY_GOAL;

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-secondary" />
          Water Intake
        </CardTitle>
        <CardDescription>Daily goal: {DAILY_GOAL}L (1 gallon)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <ProgressRing progress={progress} size={140} strokeWidth={10}>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {waterIntake.toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">
                {progress.toFixed(0)}%
              </div>
            </div>
          </ProgressRing>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="water-input" className="text-sm font-medium">
            Enter today's intake (liters)
          </label>
          <Input
            id="water-input"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={waterIntake}
            onChange={(e) => onWaterChange(parseFloat(e.target.value) || 0)}
            className="text-center text-lg font-semibold"
          />
        </div>

        {isComplete && (
          <div className="p-3 gradient-success rounded-lg text-center">
            <p className="text-sm font-semibold text-success-foreground">
              🎉 Daily goal achieved!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
