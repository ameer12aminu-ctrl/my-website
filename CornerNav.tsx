import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

type PageId = "home" | "about" | "author" | "system";

interface CornerNavProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
}

const navItems: Array<{ id: PageId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "author", label: "The Author" },
  { id: "system", label: "The System" },
  { id: "about", label: "Contact" },
];

const CornerNav = ({ currentPage, onPageChange }: CornerNavProps) => {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <nav
      className={`fixed right-0 top-0 z-50 flex border-b border-l border-border/60 bg-secondary/92 text-foreground backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        isMinimized
          ? "h-20 w-20 items-center justify-center rounded-bl-[2.5rem] p-3"
          : "h-auto w-[min(20rem,90vw)] flex-col rounded-bl-[2.5rem] px-5 py-4 max-md:p-4"
      }`}
    >
      <button
        onClick={() => setIsMinimized((value) => !value)}
        className={`absolute top-3 transition-all duration-300 ${
          isMinimized
            ? "left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-3 text-foreground"
            : "right-3 rounded-full bg-foreground/10 px-2.5 py-1.5 text-foreground hover:bg-accent/14"
        }`}
        aria-label={isMinimized ? "Expand navigation" : "Minimize navigation"}
      >
        {isMinimized ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </button>

      {isMinimized ? null : (
        <div className="mt-8 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`group w-full rounded-[1rem] border px-4 py-2 text-left transition-all duration-300 ${
                  isActive
                    ? "border-primary/50 bg-primary/22 text-foreground"
                    : "border-border/70 bg-foreground/5 text-foreground hover:-translate-x-2 hover:border-accent/40 hover:bg-accent/14"
                }`}
              >
                <span className="font-display text-base font-bold text-foreground">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default CornerNav;
