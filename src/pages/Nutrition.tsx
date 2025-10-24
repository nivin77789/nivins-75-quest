import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Coffee, Utensils, Moon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function Nutrition() {
  const [calories] = useState({
    consumed: 1450,
    goal: 2000
  });

  const macros = [
    { name: "Protein", current: 85, goal: 150, unit: "g", color: "bg-blue-500" },
    { name: "Carbs", current: 180, goal: 250, unit: "g", color: "bg-green-500" },
    { name: "Fats", current: 45, goal: 65, unit: "g", color: "bg-yellow-500" }
  ];

  const meals = [
    { name: "Breakfast", icon: Coffee, time: "8:00 AM", calories: 450, logged: true },
    { name: "Lunch", icon: Utensils, time: "1:00 PM", calories: 600, logged: true },
    { name: "Snack", icon: Apple, time: "4:00 PM", calories: 200, logged: true },
    { name: "Dinner", icon: Moon, time: "7:00 PM", calories: 700, logged: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Nutrition</h1>
        <p className="text-muted-foreground text-lg">
          Track your daily nutrition and reach your goals
        </p>
      </div>

      {/* Calorie Overview */}
      <Card className="card-shadow mb-6">
        <CardHeader>
          <CardTitle>Daily Calories</CardTitle>
          <CardDescription>
            {calories.consumed} / {calories.goal} kcal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(calories.consumed / calories.goal) * 100} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {calories.goal - calories.consumed} kcal remaining
          </p>
        </CardContent>
      </Card>

      {/* Macros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {macros.map((macro) => (
          <Card key={macro.name} className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{macro.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">{macro.current}{macro.unit}</span>
                  <span className="text-muted-foreground">{macro.goal}{macro.unit}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${macro.color}`}
                    style={{ width: `${(macro.current / macro.goal) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meals */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
          <CardDescription>Log your meals throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meals.map((meal) => (
              <div
                key={meal.name}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <meal.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{meal.name}</p>
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {meal.logged ? (
                    <>
                      <p className="font-semibold">{meal.calories} kcal</p>
                      <p className="text-sm text-green-500">Logged</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not logged</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
