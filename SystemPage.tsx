import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import EmailSubscribeCard from "@/components/EmailSubscribeCard";

const chapters = [
  {
    title: "Days 1–5: The Attention Reset",
    content: `The world changed faster than the brain could adapt. Constant notifications, infinite feeds, and on-demand everything created an environment where sustained attention became the exception — not the norm.

This chapter explores how the modern environment systematically dismantled our ability to concentrate, not through any single event, but through thousands of small interruptions that rewired how we engage with the world.

You'll understand why it feels harder to focus now than it did ten years ago — and why it's not your fault.`,
  },
  {
    title: "Days 6–15: Rewiring the Habit Loop",
    content: `Distraction is not just a bad habit. It is a neurological pattern that strengthens every time you give in to it. The habit loop you don't notice, why the urge feels so strong, and the five-minute barrier — these are the mechanisms running beneath your awareness.

This chapter covers the dopamine misunderstanding, the cost of constant switching, and the one-task rule. You'll learn why five minutes of focused work matters more than you think, and how to build a daily structure that protects your attention instead of draining it.`,
  },
  {
    title: "Days 16–30: Deep Focus & Recovery",
    content: `There will be a collapse day. You will feel like everything you built has disappeared. This is not failure — it is part of the process.

This chapter explains why collapse happens, the recovery rule, and the psychological effect of setbacks. You'll learn to avoid the compensation trap, handle the emotion interference, and use the externalization method to keep moving forward when your brain wants to quit.

The two-list system and the identity shift will change how you see discipline itself.`,
  },
];

/* ── Scroll-reveal hook ─────────────────────────────────── */
const useScrollReveal = (threshold = 0.25) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ── Chapter card with bounce-in ────────────────────────── */
const ChapterCard = ({
  ch,
  index,
  expanded,
  onToggle,
}: {
  ch: (typeof chapters)[0];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const { ref, visible } = useScrollReveal(0.15);
  const side = useMemo(() => (Math.random() > 0.5 ? 1 : -1), []);
  const angle = useMemo(() => side * (8 + Math.random() * 8), [side]);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={
        visible
          ? { opacity: 1, transform: "translateX(0) rotate(0deg)" }
          : {
              opacity: 0,
              transform: `translateX(${side * 110}vw) rotate(${angle}deg)`,
            }
      }
    >
      <button
        onClick={onToggle}
        className="freeform-surface group w-full max-w-md rounded-2xl px-7 py-6 text-left transition-all duration-300 hover:scale-[1.03] hover:rotate-[1.5deg] hover:border-primary/40"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-primary/80">
          Chapter {index + 1}
        </p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground md:text-2xl">
          {ch.title}
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {expanded ? "Click to close" : "Click to read more"}
        </p>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "mt-4 max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="freeform-surface rounded-2xl px-7 py-6">
          <p className="whitespace-pre-line text-sm leading-7 text-foreground/[0.78]">
            {ch.content}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Collapsible phase card ─────────────────────────────── */
const PhaseCard = ({
  phase,
  isOpen,
  onToggle,
}: {
  phase: { phase: string; title: string; desc: string };
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="freeform-surface rounded-2xl">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-7 py-5 text-left"
    >
      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-primary/80">
        {phase.phase}
      </p>
      <ChevronDown
        className={`h-4 w-4 text-foreground/50 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-400 ease-in-out ${
        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-7 pb-6">
        <h3 className="font-display text-xl font-bold text-foreground">{phase.title}</h3>
        <p className="mt-2 text-sm leading-7 text-foreground/[0.78]">{phase.desc}</p>
      </div>
    </div>
  </div>
);

/* ── Typewriter quote for "You didn't lose focus" ───────── */
const typewriterLines = [
  "The brain adapts to the environment it experiences most.",
  "If distraction is repeated, it becomes automatic.",
  "If focus is repeated, it becomes natural again.",
];

const TypewriterQuote = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [charCounts, setCharCounts] = useState<number[]>([]);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let currentItem = 0;
          let currentChar = 0;
          const counts = new Array(typewriterLines.length).fill(0);

          const tick = () => {
            if (currentItem >= typewriterLines.length) return;
            currentChar++;
            counts[currentItem] = currentChar;
            setCharCounts([...counts]);
            setVisibleCount(currentItem + 1);

            if (currentChar >= typewriterLines[currentItem].length) {
              currentItem++;
              currentChar = 0;
              setTimeout(tick, 300);
            } else {
              setTimeout(tick, 25);
            }
          };
          tick();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-4 space-y-2">
      {typewriterLines.map((line, i) => (
        <p
          key={line}
          className="text-sm leading-7 text-foreground/[0.78]"
          style={{ visibility: i < visibleCount ? "visible" : "hidden" }}
        >
          {line.slice(0, charCounts[i] || 0)}
          {i < visibleCount && (charCounts[i] || 0) < line.length && (
            <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
          )}
        </p>
      ))}
    </div>
  );
};

/* ── System page ────────────────────────────────────────── */
const SystemPage = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const diffBox = useScrollReveal(0.3);
  const [traced, setTraced] = useState(false);

  useEffect(() => {
    if (diffBox.visible && !traced) {
      const t = setTimeout(() => setTraced(true), 800);
      return () => clearTimeout(t);
    }
  }, [diffBox.visible, traced]);

  return (
    <section className="relative min-h-screen px-6 py-20 md:px-10 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-accent">
          The system
        </p>

        <h1 className="mt-8 font-display text-5xl font-black leading-[0.92] text-foreground lg:text-6xl">
          30 days to rebuild
          <br />
          your focus.
        </h1>

        <blockquote className="mt-8 max-w-xl text-base leading-8 text-foreground/[0.78]">
          <p>You do not become a different person.</p>
          <p className="mt-2">
            You become the person you were before constant distraction.
          </p>
          <footer className="mt-4 text-sm font-semibold text-foreground">
            — Ameer Aminu
          </footer>
        </blockquote>

        {/* What makes it different — zoom + border tracer */}
        <div
          ref={diffBox.ref}
          className={`relative mt-10 rounded-[2.5rem] px-6 py-5 transition-all duration-700 ease-out ${
            diffBox.visible
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        >
          {/* Tracer border overlay */}
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2.5rem] ${
              traced ? "border-tracer-active" : ""
            }`}
          />

          <div className="freeform-surface rounded-[2.5rem] px-6 py-5">
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              What makes it different
            </p>
            <p className="mt-3 text-lg leading-8 text-foreground">
              Most books tell you what to do. This one changes how your brain responds - so the right actions become automatic
            </p>
            <a
              href="https://www.amazon.com/You-Cant-Focus-30-Day-Rebuild-ebook/dp/B0GQCNLWYD/ref=sr_1_1?crid=1PLHMDQM0BM4F&dib=eyJ2IjoiMSJ9.0vkyKbnAlhi2jC-LQ9ey5YyKVti5gv4APCdYeITaMN4.cyh2n3LMKsEFyxr749mOLGESazNpwpO2SkDAGEDvhL4&dib_tag=se&keywords=you+can%27t+focus+-+here+is+why+book&nsdOptOutParam=true&qid=1773893970&sprefix=you+can%27t+focus+-+here+is+why+bo%2Caps%2C251&sr=8-1"
              target="_blank"
              rel="noopener noreferrer"
              className="reactive-highlight mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lg"
            >
              Buy Now
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-foreground/55">
              Kindle &amp; Paperback · Available on Amazon
            </p>
          </div>
        </div>

        {/* 30-Day Focus Rebuild System */}
        <div className="mt-16">
          <h2 className="font-display text-3xl font-black text-foreground lg:text-4xl">
            The 30-Day Focus Rebuild System
          </h2>

          <div className="mt-10 space-y-4">
            {[
              { phase: "Phase 1 (Days 1–5)", title: "Reset", desc: "Break the cycle of constant distraction and overstimulation" },
              { phase: "Phase 2 (Days 6–15)", title: "Rebuild", desc: "Train attention to stay longer and resist the urge to switch" },
              { phase: "Phase 3 (Days 16–30)", title: "Deep Focus", desc: "Develop the ability to work with full concentration without interruption" },
            ].map((p, i) => (
              <PhaseCard key={i} phase={p} isOpen={openPhase === i} onToggle={() => setOpenPhase(openPhase === i ? null : i)} />
            ))}
          </div>
        </div>

        {/* You didn't lose focus — typewriter */}
        <div className="mt-10">
          <div className="freeform-surface rounded-2xl px-7 py-6">
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              You didn't lose focus — you practiced losing it.
            </h2>
            <TypewriterQuote />
          </div>
        </div>

        {/* Blog section */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-accent">
            Blog
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Coming soon.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-foreground/60">
            Short essays on attention, distraction, and what it actually takes to
            rebuild focus in a world designed to break it.
          </p>
        </div>

        <EmailSubscribeCard />
      </div>
    </section>
  );
};

export default SystemPage;
