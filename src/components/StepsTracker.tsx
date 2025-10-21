import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Plus, Minus, RefreshCw, Link2 } from "lucide-react";
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
const PACER_CLIENT_ID = "pacer_16ab5b28d2d34e3f80832333b22020b6";
const PACER_CLIENT_SECRET = "2a2c6052af8a46b3913d8d68e4443a13";

export const StepsTracker = ({
  dailySteps,
  onStepsChange,
  currentDate,
}: StepsTrackerProps) => {
  const { user } = useAuth();
  const [stepsInput, setStepsInput] = useState<string>("");
  const [totalDeficit, setTotalDeficit] = useState(0);
  const [overallProgress, setOverallProgress] = useState(100);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [pacerAccessToken, setPacerAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setStepsInput(dailySteps ? dailySteps.toString() : "");
  }, [dailySteps]);

  useEffect(() => {
    calculateOverallProgress();
  }, [currentDate, user]);

  const connectPacer = () => {
    const instructions = `To connect your Pacer account:

1. You need to set up OAuth redirect in your app
2. Add a redirect URI in your Pacer developer settings
3. Implement the OAuth flow properly

For now, you can use the manual sync method:
- Get your access token from Pacer developer portal
- Enter it when prompted

Would you like to proceed with manual token entry?`;
    
    const proceed = confirm(instructions);
    if (proceed) {
      const token = prompt("Enter your Pacer access token:");
      if (token) {
        setPacerAccessToken(token);
        setIsConnected(true);
        alert("Token saved! You can now sync your steps.");
      }
    }
  };

  const fetchPacerSteps = async () => {
    if (!pacerAccessToken) {
      alert("Please connect your Pacer account first.");
      return;
    }

    setIsSyncing(true);
    try {
      // Try different API endpoints based on Pacer's documentation
      const endpoints = [
        `https://api.mypacer.com/v1/activities?date=${currentDate}`,
        `https://openapi.mypacer.com/users/me/activities/daily.json?start_date=${currentDate}&end_date=${currentDate}`,
        `https://api.pacer.cc/v1/activities/${currentDate}`
      ];

      let stepsData = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${pacerAccessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data);
            
            // Try to extract steps from different response formats
            if (data.steps) {
              stepsData = data.steps;
              break;
            } else if (data.data?.steps) {
              stepsData = data.data.steps;
              break;
            } else if (data.data?.daily_activities?.[0]?.steps) {
              stepsData = data.data.daily_activities[0].steps;
              break;
            } else if (data.activities?.[0]?.steps) {
              stepsData = data.activities[0].steps;
              break;
            }
          }
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (stepsData !== null) {
        setStepsInput(stepsData.toString());
        onStepsChange(stepsData);
        setLastSyncTime(new Date().toLocaleTimeString());
        alert(`Successfully synced ${stepsData} steps from Pacer!`);
      } else {
        throw new Error("Could not fetch steps from any Pacer endpoint. Please check your token and try again.");
      }
    } catch (error) {
      console.error("Error fetching Pacer data:", error);
      alert(`Failed to sync with Pacer: ${error.message}\n\nPlease verify:\n1. Your access token is valid\n2. You have granted necessary permissions\n3. The Pacer API is accessible`);
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectPacer = () => {
    setPacerAccessToken(null);
    setIsConnected(false);
    alert("Disconnected from Pacer");
  };

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
        {/* Pacer Connection Status */}
        {!isConnected ? (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Connect to Pacer
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Sync your steps automatically from the Pacer app
                </p>
              </div>
              <Button
                onClick={connectPacer}
                size="sm"
                className="ml-3 bg-blue-600 hover:bg-blue-700"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  ✓ Connected to Pacer
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Click sync to fetch your latest steps
                </p>
              </div>
              <Button
                onClick={disconnectPacer}
                variant="ghost"
                size="sm"
                className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}

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
          <div className="flex items-center justify-center gap-2">
            <label
              htmlFor="steps-input"
              className="text-sm font-medium"
            >
              Log your steps
            </label>
            {isConnected && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fetchPacerSteps}
                disabled={isSyncing}
                className="h-8 px-3 gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="text-xs">Sync Pacer</span>
              </Button>
            )}
          </div>
          
          {lastSyncTime && (
            <p className="text-xs text-muted-foreground text-center">
              Last synced: {lastSyncTime}
            </p>
          )}

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