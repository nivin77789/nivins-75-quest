import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface WeightTrackerProps {
  currentWeight: number;
  onWeightUpdate: (weight: number) => void;
  tempWeight: number;
  onTempWeightChange: (weight: number) => void;
}

export const WeightTracker = ({ currentWeight, onWeightUpdate, tempWeight, onTempWeightChange }: WeightTrackerProps) => {
  const { userProfile } = useAuth();
  
  if (!userProfile) return null;
  
  const calculateBMI = (weight: number) => {
    const heightInMeters = userProfile.height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const weightChange = currentWeight - userProfile.initialWeight;
  const bmi = calculateBMI(currentWeight);

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Weight & BMI Tracker
        </CardTitle>
        <CardDescription>Track your daily weight and BMI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm text-muted-foreground mb-1">Current Weight</div>
            <div className="text-2xl font-bold">{currentWeight} kg</div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm text-muted-foreground mb-1">BMI</div>
            <div className="text-2xl font-bold">{bmi}</div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className={`flex items-center gap-1 font-semibold ${weightChange < 0 ? 'text-success' : 'text-destructive'}`}>
              {weightChange < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              {Math.abs(weightChange).toFixed(1)} kg
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {weightChange < 0 ? 'Lost' : 'Gained'} since start ({userProfile.initialWeight} kg)
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="weight-input" className="text-sm font-medium">
            Update today's weight (kg)
          </label>
          <div className="flex gap-2">
            <Input
  id="weight-input"
  type="number"
  step="0.1"
  min="30"
  max="200"
  value={tempWeight || ""}
  onChange={(e) => {
    const value = e.target.value;
    onTempWeightChange(value === "" ? NaN : parseFloat(value));
  }}
  placeholder="Enter weight"
  className="text-center font-semibold"
/>

            <Button 
              onClick={() => onWeightUpdate(tempWeight)}
              className="gradient-primary"
            >
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
