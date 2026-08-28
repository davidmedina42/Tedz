import { CATEGORIES, type Category } from "@/types/clip";

interface Props {
  value: Category | "All" | "Saved";
  onChange: (value: Category | "All" | "Saved") => void;
}

export function CategoryPills({ value, onChange }: Props) {
  const options: Array<Category | "All" | "Saved"> = ["All", ...CATEGORIES, "Saved"];

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-1">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors ${
              active
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border/60 bg-card/50 text-muted-foreground backdrop-blur-md"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
