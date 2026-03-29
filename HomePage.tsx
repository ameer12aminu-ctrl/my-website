import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import bookCover from "@/assets/book-cover.jpg";
import EmailSubscribeCard from "@/components/EmailSubscribeCard";
import EmailPopup from "@/components/EmailPopup";

const AMAZON_LINK =
  "https://www.amazon.com/You-Cant-Focus-30-Day-Rebuild-ebook/dp/B0GQCNLWYD/ref=sr_1_1?crid=1PLHMDQM0BM4F&dib=eyJ2IjoiMSJ9.0vkyKbnAlhi2jC-LQ9ey5YyKVti5gv4APCdYeITaMN4.cyh2n3LMKsEFyxr749mOLGESazNpwpO2SkDAGEDvhL4&dib_tag=se&keywords=you+can%27t+focus+-+here+is+why+book&nsdOptOutParam=true&qid=1773893970&sprefix=you+can%27t+focus+-+here+is+why+bo%2Caps%2C251&sr=8-1";

const bulletPoints = [
  "Focus for longer without checking your phone",
  "Finish tasks without constant distraction",
  "Build deep concentration naturally",
  "Reduce mental fatigue and overwhelm",
  "Take control of your attention again",
];

/* ── Typewriter bullet list ─────────────────────────────── */
const TypewriterList = () => {
  const ref = useRef<HTMLUListElement>(null);
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
          const counts = new Array(bulletPoints.length).fill(0);

          const tick = () => {
            if (currentItem >= bulletPoints.length) return;
            currentChar++;
            counts[currentItem] = currentChar;
            setCharCounts([...counts]);
            setVisibleCount(currentItem + 1);

            if (currentChar >= bulletPoints[currentItem].length) {
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
    <ul ref={ref} className="mt-8 w-full max-w-3xl space-y-2">
      {bulletPoints.map((point, i) => (
        <li
          key={point}
          className="text-sm uppercase tracking-[0.35em] text-foreground/55"
          style={{ visibility: i < visibleCount ? "visible" : "hidden" }}
        >
          • {point.slice(0, charCounts[i] || 0)}
          {i < visibleCount && (charCounts[i] || 0) < point.length && (
            <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
          )}
        </li>
      ))}
    </ul>
  );
};

/* ── Home page ──────────────────────────────────────────── */
const HomePage = () => {
  /* sequenced entrance */
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 200),   // "You can't concentrate"
      setTimeout(() => setStep(2), 900),   // "even for 5 minutes"
      setTimeout(() => setStep(3), 1500),  // "Fix your broken focus…"
      setTimeout(() => setStep(4), 2100),  // eyebrow unfurls
      setTimeout(() => setStep(5), 2600),  // intro fades in
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  /* book parallax */
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * -14;
    setTilt({ x, y });
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden px-6 py-20 md:px-10 lg:py-24"
      onMouseMove={handleMouseMove}
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.08fr_0.92fr]">
        {/* ── Left column ────────────────────────────── */}
        <div className="relative z-10 pt-8 lg:pt-16">
          {/* Eyebrow — unfurls from right after title, wraps on small screens */}
          <p
            className={`text-xs font-semibold uppercase tracking-[0.5em] text-accent transition-all duration-1000 ease-out ${
              step >= 4
                ? "opacity-100"
                : "opacity-0"
            }`}
            style={{
              clipPath: step >= 4 ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
              transition: "clip-path 1s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease",
            }}
          >
            THE PRACTICAL SYSTEM TO RETRAIN YOUR ATTENTION ELIMINATE DISTRACTION — AND BUILD DEEP FOCUS{" "}
            <br />
            IN A WORLD DESIGNED TO BREAK IT
          </p>

          {/* Hero headline */}
          <h1 className="mt-8 font-display leading-[0.84]">
            {/* Line 1 — "You can't Concentrate" all white, same line */}
            <span
              className={`block text-[clamp(3.6rem,9vw,7.8rem)] text-foreground transition-all duration-700 ${
                step >= 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              You can't Concentrate
            </span>

            {/* "even for 5 minutes" — small grey, below "Concentrate" */}
            <span
              className={`relative z-20 mt-1 block text-right text-[clamp(0.85rem,1.6vw,1.2rem)] font-light tracking-wide text-foreground/40 transition-all duration-500 ${
                step >= 2 ? "opacity-100" : "opacity-0"
              }`}
            >
              even for 5 minutes
            </span>

            {/* Line 2 — "Fix your broken focus in 30 days" in orange, same size as line 1 */}
            <span
              className={`mt-4 block text-[clamp(3.6rem,9vw,7.8rem)] font-bold leading-[0.84] text-primary transition-all duration-700 ${
                step >= 3 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Fix your broken focus in 30 days
            </span>
          </h1>

          {/* Intro paragraph — fades in with eyebrow */}
          <div
            className={`mt-10 max-w-3xl transition-all duration-700 ${
              step >= 5 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <p className="text-[clamp(1.1rem,2.4vw,2.1rem)] font-light leading-[1.1] text-foreground/92">
              In our modern world, <span className="font-semibold">Most people can't focus</span> for even{" "}
              <span className="font-semibold">5 minutes</span>,{" "}
              <span className="font-semibold">Can you?</span>{" "}
              This book <span className="font-semibold">explains why</span> and{" "}
              <span className="font-semibold">shows you how to fix it</span>,{" "}
              <span className="font-semibold">step by step</span>.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={AMAZON_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="reactive-highlight inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lg"
            >
              Buy Now
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-2 w-full text-xs uppercase tracking-[0.35em] text-foreground/55">
              Kindle &amp; Paperback · Available on Amazon
            </p>
          </div>

          {/* Mobile book cover */}
          <figure className="mt-10 flex justify-center lg:hidden">
            <img
              src={bookCover}
              alt="You Can't Focus Anymore book cover"
              className="floating-book w-[60vw] max-w-[280px] rounded-[2rem] shadow-[0_30px_90px_-30px_hsl(var(--background)/0.92)]"
            />
          </figure>

          <div className="relative mt-16 max-w-3xl">
            <TypewriterList />
          </div>

          <p className="mt-10 max-w-3xl text-sm uppercase leading-relaxed tracking-[0.35em] text-foreground/55">
            {"\n"}
          </p>

          <EmailSubscribeCard />
        </div>

        {/* ── Right column — book (desktop) ─────────── */}
        <div className="relative z-10 hidden lg:block">
          <div className="absolute left-[10%] top-[12%] h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-[8%] top-[6%] h-40 w-40 rounded-full bg-accent/20 blur-3xl" />

          {/* Book positioned below "Available on Amazon" text, fixed position */}
          <figure
            className="fixed right-[6%] top-[18rem] z-[9999] hidden w-[min(50vw,310px)] lg:block"
            style={{
              transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            <img
              src={bookCover}
              alt="You Can't Focus Anymore book cover"
              className="relative w-full rounded-[2rem] shadow-[0_30px_90px_-30px_hsl(var(--background)/0.92)]"
            />
          </figure>
        </div>
      </div>

      <EmailPopup />
    </section>
  );
};

export default HomePage;
