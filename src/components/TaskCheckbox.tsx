import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface TaskCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

export const TaskCheckbox = ({ id, label, checked, onChange, icon }: TaskCheckboxProps) => {
  const handleChange = (newChecked: boolean) => {
    onChange(newChecked);
    if (newChecked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#3b82f6', '#10b981']
      });
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={handleChange}
        className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <label
        htmlFor={id}
        className={`flex items-center gap-2 text-sm font-medium leading-none cursor-pointer flex-1 transition-all ${
          checked ? "text-muted-foreground line-through" : "text-foreground"
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {label}
        {checked && (
          <CheckCircle2 className="ml-auto h-5 w-5 text-success animate-bounce-in" />
        )}
      </label>
    </div>
  );
};
