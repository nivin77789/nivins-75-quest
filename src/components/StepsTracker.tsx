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
const REDIRECT_URI = window.location.origin + window.location.pathname;

// MD5 implementation
const md5 = (str: string): string => {
  const rotateLeft = (value: number, shift: number) => (value << shift) | (value >>> (32 - shift));
  
  const addUnsigned = (x: number, y: number) => {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  };

  const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const H = (x: number, y: number, z: number) => x ^ y ^ z;
  const I = (x: number, y: number, z: number) => y ^ (x | ~z);

  const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  const convertToWordArray = (str: string) => {
    const wordArray = [];
    for (let i = 0; i < str.length; i++) {
      wordArray[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
    }
    return wordArray;
  };

  const utf8Encode = (str: string) => unescape(encodeURIComponent(str));
  const x = convertToWordArray(utf8Encode(str));
  const len = str.length * 8;

  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const oldA = a, oldB = b, oldC = c, oldD = d;

    a = FF(a, b, c, d, x[i], 7, -680876936);
    d = FF(d, a, b, c, x[i + 1], 12, -389564586);
    c = FF(c, d, a, b, x[i + 2], 17, 606105819);
    b = FF(b, c, d, a, x[i + 3], 22, -1044525330);
    a = FF(a, b, c, d, x[i + 4], 7, -176418897);
    d = FF(d, a, b, c, x[i + 5], 12, 1200080426);
    c = FF(c, d, a, b, x[i + 6], 17, -1473231341);
    b = FF(b, c, d, a, x[i + 7], 22, -45705983);
    a = FF(a, b, c, d, x[i + 8], 7, 1770035416);
    d = FF(d, a, b, c, x[i + 9], 12, -1958414417);
    c = FF(c, d, a, b, x[i + 10], 17, -42063);
    b = FF(b, c, d, a, x[i + 11], 22, -1990404162);
    a = FF(a, b, c, d, x[i + 12], 7, 1804603682);
    d = FF(d, a, b, c, x[i + 13], 12, -40341101);
    c = FF(c, d, a, b, x[i + 14], 17, -1502002290);
    b = FF(b, c, d, a, x[i + 15], 22, 1236535329);

    a = GG(a, b, c, d, x[i + 1], 5, -165796510);
    d = GG(d, a, b, c, x[i + 6], 9, -1069501632);
    c = GG(c, d, a, b, x[i + 11], 14, 643717713);
    b = GG(b, c, d, a, x[i], 20, -373897302);
    a = GG(a, b, c, d, x[i + 5], 5, -701558691);
    d = GG(d, a, b, c, x[i + 10], 9, 38016083);
    c = GG(c, d, a, b, x[i + 15], 14, -660478335);
    b = GG(b, c, d, a, x[i + 4], 20, -405537848);
    a = GG(a, b, c, d, x[i + 9], 5, 568446438);
    d = GG(d, a, b, c, x[i + 14], 9, -1019803690);
    c = GG(c, d, a, b, x[i + 3], 14, -187363961);
    b = GG(b, c, d, a, x[i + 8], 20, 1163531501);
    a = GG(a, b, c, d, x[i + 13], 5, -1444681467);
    d = GG(d, a, b, c, x[i + 2], 9, -51403784);
    c = GG(c, d, a, b, x[i + 7], 14, 1735328473);
    b = GG(b, c, d, a, x[i + 12], 20, -1926607734);

    a = HH(a, b, c, d, x[i + 5], 4, -378558);
    d = HH(d, a, b, c, x[i + 8], 11, -2022574463);
    c = HH(c, d, a, b, x[i + 11], 16, 1839030562);
    b = HH(b, c, d, a, x[i + 14], 23, -35309556);
    a = HH(a, b, c, d, x[i + 1], 4, -1530992060);
    d = HH(d, a, b, c, x[i + 4], 11, 1272893353);
    c = HH(c, d, a, b, x[i + 7], 16, -155497632);
    b = HH(b, c, d, a, x[i + 10], 23, -1094730640);
    a = HH(a, b, c, d, x[i + 13], 4, 681279174);
    d = HH(d, a, b, c, x[i], 11, -358537222);
    c = HH(c, d, a, b, x[i + 3], 16, -722521979);
    b = HH(b, c, d, a, x[i + 6], 23, 76029189);
    a = HH(a, b, c, d, x[i + 9], 4, -640364487);
    d = HH(d, a, b, c, x[i + 12], 11, -421815835);
    c = HH(c, d, a, b, x[i + 15], 16, 530742520);
    b = HH(b, c, d, a, x[i + 2], 23, -995338651);

    a = II(a, b, c, d, x[i], 6, -198630844);
    d = II(d, a, b, c, x[i + 7], 10, 1126891415);
    c = II(c, d, a, b, x[i + 14], 15, -1416354905);
    b = II(b, c, d, a, x[i + 5], 21, -57434055);
    a = II(a, b, c, d, x[i + 12], 6, 1700485571);
    d = II(d, a, b, c, x[i + 3], 10, -1894986606);
    c = II(c, d, a, b, x[i + 10], 15, -1051523);
    b = II(b, c, d, a, x[i + 1], 21, -2054922799);
    a = II(a, b, c, d, x[i + 8], 6, 1873313359);
    d = II(d, a, b, c, x[i + 15], 10, -30611744);
    c = II(c, d, a, b, x[i + 6], 15, -1560198380);
    b = II(b, c, d, a, x[i + 13], 21, 1309151649);
    a = II(a, b, c, d, x[i + 4], 6, -145523070);
    d = II(d, a, b, c, x[i + 11], 10, -1120210379);
    c = II(c, d, a, b, x[i + 2], 15, 718787259);
    b = II(b, c, d, a, x[i + 9], 21, -343485551);

    a = addUnsigned(a, oldA);
    b = addUnsigned(b, oldB);
    c = addUnsigned(c, oldC);
    d = addUnsigned(d, oldD);
  }

  const wordToHex = (value: number) => {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((value >> (i * 8)) & 0xFF).toString(16).padStart(2, '0');
    }
    return hex;
  };

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
};

const generateEncodedSignature = (): string => {
  const appSecretHash = md5(PACER_CLIENT_SECRET + "pacer_oauth");
  const encodedSignature = md5(appSecretHash + PACER_CLIENT_ID);
  return encodedSignature;
};

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
  const [pacerUserId, setPacerUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setStepsInput(dailySteps ? dailySteps.toString() : "");
  }, [dailySteps]);

  useEffect(() => {
    calculateOverallProgress();
  }, [currentDate, user]);

  useEffect(() => {
    // Load saved tokens
    const savedToken = localStorage.getItem("pacer_access_token");
    const savedUserId = localStorage.getItem("pacer_user_id");
    
    if (savedToken && savedUserId) {
      setPacerAccessToken(savedToken);
      setPacerUserId(savedUserId);
      setIsConnected(true);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const authResult = urlParams.get("auth_result");
    const state = urlParams.get("state");

    if (code && authResult === "success") {
      exchangeCodeForToken(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authResult === "fail") {
      alert("Authorization failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const connectPacer = () => {
    // Generate state for security
    const state = Math.random().toString(36).substring(7);
    
    // Redirect to Pacer OAuth dialog
    const authUrl = `http://developer.mypacer.com/oauth2/dialog?client_id=${PACER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    
    window.location.href = authUrl;
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      const encodedSignature = generateEncodedSignature();

      const response = await fetch("http://openapi.mypacer.com/oauth2/access_token", {
        method: "POST",
        headers: {
          Authorization: encodedSignature,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: PACER_CLIENT_ID,
          code: code,
          grant_type: "authorization_code",
        }),
      });

      const data = await response.json();
      console.log("Token exchange response:", data);

      if (data.success && data.data) {
        const accessToken = data.data.access_token;
        const userId = data.data.user_id;
        const refreshToken = data.data.refresh_token;

        // Store tokens
        localStorage.setItem("pacer_access_token", accessToken);
        localStorage.setItem("pacer_user_id", userId);
        if (refreshToken) {
          localStorage.setItem("pacer_refresh_token", refreshToken);
        }

        setPacerAccessToken(accessToken);
        setPacerUserId(userId);
        setIsConnected(true);

        alert("Successfully connected to Pacer! You can now sync your steps.");
      } else {
        throw new Error(data.message || "Failed to get access token");
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      alert("Failed to connect to Pacer. Please try again.");
    }
  };

  const fetchPacerSteps = async () => {
    if (!pacerAccessToken || !pacerUserId) {
      alert("Please connect your Pacer account first.");
      return;
    }

    setIsSyncing(true);
    try {
      // Use Pacer's getDailyActivitySummary API
      const url = `http://openapi.mypacer.com/users/${pacerUserId}/activities/daily.json?start_date=${currentDate}&end_date=${currentDate}&accept_manual_input=true`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${pacerAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Pacer API response:", data);

      if (data.success && data.data && data.data.daily_activities) {
        const activities = data.data.daily_activities;
        
        if (activities.length > 0) {
          const steps = activities[0].steps || 0;
          
          setStepsInput(steps.toString());
          onStepsChange(steps);
          setLastSyncTime(new Date().toLocaleTimeString());
          alert(`Successfully synced ${steps.toLocaleString()} steps from Pacer!`);
        } else {
          alert("No step data found for today. Make sure you have steps recorded in Pacer.");
        }
      } else {
        throw new Error(data.message || "Failed to fetch step data");
      }
    } catch (error) {
      console.error("Error fetching Pacer data:", error);
      alert("Failed to sync with Pacer. Your token may have expired. Please reconnect.");
      
      // Clear tokens if they're invalid
      localStorage.removeItem("pacer_access_token");
      localStorage.removeItem("pacer_user_id");
      localStorage.removeItem("pacer_refresh_token");
      setPacerAccessToken(null);
      setPacerUserId(null);
      setIsConnected(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectPacer = () => {
    localStorage.removeItem("pacer_access_token");
    localStorage.removeItem("pacer_user_id");
    localStorage.removeItem("pacer_refresh_token");
    setPacerAccessToken(null);
    setPacerUserId(null);
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
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white"
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