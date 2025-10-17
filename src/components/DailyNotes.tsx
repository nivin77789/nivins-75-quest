import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface DailyNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const DailyNotes = ({ notes, onNotesChange }: DailyNotesProps) => {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Daily Reflection
        </CardTitle>
        <CardDescription>Write your thoughts, struggles, and victories</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="How did today go? What challenges did you face? What are you proud of?"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[150px] resize-none"
        />
      </CardContent>
    </Card>
  );
};
