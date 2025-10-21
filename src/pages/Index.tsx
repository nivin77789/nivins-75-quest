import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { LOOKMAXING_TASKS, MOTIVATIONAL_QUOTES, ATOMIC_HABITS_CONTENT } from "@/lib/constants";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DailyTasks } from "@/components/DailyTasks";
import { LookmaxingTask } from "@/components/LookmaxingTask";
import { WaterTracker } from "@/components/WaterTracker";
import { WeightTracker } from "@/components/WeightTracker";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { AtomicHabits } from "@/components/AtomicHabits";
import { DailyNotes } from "@/components/DailyNotes";
import { DopamineBoost } from "@/components/DopamineBoost";
import { SkinCare } from "@/components/SkinCare";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import { StepsTracker } from "@/components/StepsTracker";
import { Calendar, Target, Trophy, Flame, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DayData {
  date: string;
  tasks: Record<string, boolean>;
  lookmaxingDone: boolean;
  waterIntake: number;
  weight: number;
  notes: string;
  dopamineTasks: Record<string, boolean>;
  skincareTasks: Record<string, boolean>;
  workouts: Record<string, boolean>;
  dailySteps: number;
}

const Index = () => {
  const { toast } = useToast();
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  
  if (!userProfile) return null;
  
  const dayNumber = differenceInDays(new Date(today), new Date(userProfile.startDate)) + 1;
  const daysRemaining = differenceInDays(new Date(userProfile.endDate), new Date(today));
  
  const [dayData, setDayData] = useState<DayData>({
    date: today,
    tasks: {},
    lookmaxingDone: false,
    waterIntake: 0,
    weight: userProfile.initialWeight,
    notes: "",
    dopamineTasks: {},
    skincareTasks: {},
    workouts: {},
    dailySteps: 0
  });

  const [tempWeight, setTempWeight] = useState(userProfile.initialWeight);

  useEffect(() => {
    const loadDayData = async () => {
      if (!user) return;
      
      const docRef = doc(db, "users", user.uid, "dailyData", today);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setDayData(docSnap.data() as DayData);
        setTempWeight(docSnap.data().weight);
      }
    };

    loadDayData();
  }, [today, user]);

  const saveDayData = async (newData: Partial<DayData>) => {
    if (!user) return;
    
    const updatedData = { ...dayData, ...newData, date: today };
    setDayData(updatedData);
    
    try {
      await setDoc(doc(db, "users", user.uid, "dailyData", today), updatedData);
    } catch (error) {
      toast({
        title: "Error saving data",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleTaskChange = (taskId: string, checked: boolean) => {
    const newTasks = { ...dayData.tasks, [taskId]: checked };
    saveDayData({ tasks: newTasks });

    // Check if all tasks are completed
    const allTasksCompleted = Object.keys(newTasks).length === 10 && Object.values(newTasks).every(Boolean);
    if (allTasksCompleted && dayData.lookmaxingDone && dayData.waterIntake >= 3.8) {
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#3b82f6', '#10b981', '#fbbf24']
      });
      toast({
        title: "🎉 ALL TASKS COMPLETED!",
        description: "You're crushing it! Keep the momentum going!",
      });
    }
  };

  const lookmaxingTask = LOOKMAXING_TASKS[dayNumber % LOOKMAXING_TASKS.length];
  const quote = MOTIVATIONAL_QUOTES[dayNumber % MOTIVATIONAL_QUOTES.length];
  const atomicHabitsDay = ATOMIC_HABITS_CONTENT[Math.min(dayNumber - 1, ATOMIC_HABITS_CONTENT.length - 1)];

  const totalTasks = 10;
  const completedTasks = Object.values(dayData.tasks).filter(Boolean).length;
  const tasksProgress = (completedTasks / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full gradient-primary">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              <p className="text-sm text-muted-foreground">75 Hard Challenge</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote quote={quote} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{dayNumber}</span>
                <span className="text-lg text-muted-foreground">/ 76</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold">{daysRemaining}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold">{tasksProgress.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{dayData.weight}</span>
                <span className="text-lg text-muted-foreground">kg</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <DailyTasks 
              tasks={dayData.tasks}
              onTaskChange={handleTaskChange}
            />

            <LookmaxingTask
              task={lookmaxingTask}
              completed={dayData.lookmaxingDone}
              onComplete={(checked) => saveDayData({ lookmaxingDone: checked })}
            />

            <WorkoutPlan
              workouts={dayData.workouts}
              onWorkoutChange={(workoutId, checked) => {
                const newWorkouts = { ...dayData.workouts, [workoutId]: checked };
                saveDayData({ workouts: newWorkouts });
              }}
              currentDate={today}
            />

            <DopamineBoost
              tasks={dayData.dopamineTasks}
              onTaskChange={(taskId, checked) => {
                const newTasks = { ...dayData.dopamineTasks, [taskId]: checked };
                saveDayData({ dopamineTasks: newTasks });
              }}
            />

            <SkinCare
              tasks={dayData.skincareTasks}
              onTaskChange={(taskId, checked) => {
                const newTasks = { ...dayData.skincareTasks, [taskId]: checked };
                saveDayData({ skincareTasks: newTasks });
              }}
            />

            <AtomicHabits content={atomicHabitsDay} />

            <DailyNotes
              notes={dayData.notes}
              onNotesChange={(notes) => saveDayData({ notes })}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WaterTracker
              waterIntake={dayData.waterIntake}
              onWaterChange={(liters) => saveDayData({ waterIntake: liters })}
            />

            <StepsTracker
              dailySteps={dayData.dailySteps}
              onStepsChange={(steps) => saveDayData({ dailySteps: steps })}
              currentDate={today}
            />

            <WeightTracker
              currentWeight={dayData.weight}
              onWeightUpdate={(weight) => {
                saveDayData({ weight });
                toast({
                  title: "Weight updated!",
                  description: `New weight: ${weight} kg`,
                });
              }}
              tempWeight={tempWeight}
              onTempWeightChange={setTempWeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
