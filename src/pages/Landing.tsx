import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Apple, Trophy, Users, Heart, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Landing() {
  const features = [
    {
      title: "Expert Workouts",
      description: "Access hundreds of workout classes led by certified trainers",
      icon: Dumbbell,
      color: "text-primary"
    },
    {
      title: "Nutrition Plans",
      description: "Personalized meal plans tailored to your fitness goals",
      icon: Apple,
      color: "text-secondary"
    },
    {
      title: "75 Hard Challenge",
      description: "Transform yourself with our intense 75-day challenge",
      icon: Trophy,
      color: "text-accent"
    },
    {
      title: "Community",
      description: "Join thousands of members on their fitness journey",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Wellness Focus",
      description: "Holistic approach to health, fitness, and mental wellbeing",
      icon: Heart,
      color: "text-secondary"
    },
    {
      title: "Results Driven",
      description: "Track your progress and achieve measurable results",
      icon: Zap,
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen w-full relative">
      <AnimatedBackground />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Cult.fit Clone</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button>Sign In / Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Transform Your Life
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join India's leading fitness platform with personalized workouts, nutrition plans, and wellness programs designed for real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Why Choose Cult.fit?</h3>
          <p className="text-muted-foreground text-lg">
            Everything you need to achieve your fitness goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="card-shadow hover:card-shadow-hover transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="card-shadow gradient-primary text-primary-foreground max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-primary-foreground/90 text-lg mb-6">
              Join thousands of members who have already transformed their lives
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2025 Cult.fit Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
