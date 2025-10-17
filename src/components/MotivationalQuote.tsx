import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface MotivationalQuoteProps {
  quote: string;
}

export const MotivationalQuote = ({ quote }: MotivationalQuoteProps) => {
  return (
    <Card className="card-shadow gradient-primary border-0 p-6">
      <div className="flex items-start gap-4">
        <Quote className="h-8 w-8 text-primary-foreground flex-shrink-0 mt-1" />
        <p className="text-lg font-medium text-primary-foreground leading-relaxed">
          "{quote}"
        </p>
      </div>
    </Card>
  );
};
