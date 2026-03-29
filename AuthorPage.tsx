import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmailSubscribeCard from "@/components/EmailSubscribeCard";
import authorPortrait from "@/assets/author-portrait.jpg";

const AMAZON_LINK =
  "https://www.amazon.com/You-Cant-Focus-30-Day-Rebuild-ebook/dp/B0GQCNLWYD/ref=sr_1_1?crid=1PLHMDQM0BM4F&dib=eyJ2IjoiMSJ9.0vkyKbnAlhi2jC-LQ9ey5YyKVti5gv4APCdYeITaMN4.cyh2n3LMKsEFyxr749mOLGESazNpwpO2SkDAGEDvhL4&dib_tag=se&keywords=you+can%27t+focus+-+here+is+why+book&nsdOptOutParam=true&qid=1773893970&sprefix=you+can%27t+focus+-+here+is+why+bo%2Caps%2C251&sr=8-1";

/* ── Scroll-triggered hook ─────────────────────────────── */
const useScrollReveal = (threshold = 0.25) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(node);
    const fallbackTimer = window.setTimeout(() => setVisible(true), 1200);

    return () => {
      obs.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, [threshold]);

  return { ref, visible };
};

const AuthorPage = () => {
  const headshot = useScrollReveal(0.3);
  const mission = useScrollReveal(0.2);
  const contact = useScrollReveal(0.2);
  const [missionTraced, setMissionTraced] = useState(false);
  const [contactTraced, setContactTraced] = useState(false);

  useEffect(() => {
    if (mission.visible && !missionTraced) {
      const t = setTimeout(() => setMissionTraced(true), 800);
      return () => clearTimeout(t);
    }
  }, [mission.visible, missionTraced]);

  useEffect(() => {
    if (contact.visible && !contactTraced) {
      const t = setTimeout(() => setContactTraced(true), 800);
      return () => clearTimeout(t);
    }
  }, [contact.visible, contactTraced]);

  return (
    <section className="relative min-h-screen px-6 py-20 md:px-10 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-accent">
          About the author
        </p>

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* Headshot — pixelate-in */}
          <div
            ref={headshot.ref}
            className={`h-64 w-64 shrink-0 overflow-hidden rounded-[2rem] border-2 border-accent/40 shadow-xl transition-all duration-[1.2s] ease-out ${
              headshot.visible
                ? "opacity-100 blur-0 saturate-100"
                : "opacity-0 blur-[20px] saturate-0"
            }`}
          >
            <img
              src={authorPortrait}
              alt="Ameer Aminu — Author"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="font-display text-5xl font-black leading-[0.92] text-foreground lg:text-6xl">
              Ameer Aminu
            </h1>

            {/* Author's note — fades in with headshot */}
            <div
              className={`transition-all duration-[1.2s] ease-out ${
                headshot.visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                Author's Note
              </p>

              <div className="mt-6 max-w-xl space-y-4 text-base leading-8 text-foreground/[0.78]">
                <p>I didn't write this book as an expert looking from the outside.</p>
                <p>
                  I wrote it as someone who struggled with focus — constantly
                  distracted, unable to stay consistent, and frustrated by how
                  difficult simple tasks had become.
                </p>
                <p>
                  Over time, I began noticing a pattern — not just in myself,
                  but in others. Intelligent people who genuinely wanted to
                  improve were struggling to do simple things, not because they
                  were lazy, but because their environment had trained their
                  attention in the wrong direction.
                </p>
                <p>So I built a system to retrain focus step by step.</p>
                <p>This book is the result of that process.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission card — unfurls L→R with border tracer */}
        <div
          ref={mission.ref}
          className={`relative mt-10 w-full rounded-[2rem] transition-all duration-700 ease-out ${
            mission.visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            clipPath: mission.visible
              ? "inset(0 0 0 0)"
              : "inset(0 100% 0 0)",
            transition: "clip-path 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2rem] ${
              missionTraced ? "border-tracer-active" : ""
            }`}
          />
          <div className="freeform-surface rounded-[2rem] px-6 py-5">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              Mission
            </p>
            <p className="mt-3 text-lg leading-8 text-foreground">
              To help people take back control of their attention through
              structured, daily retraining, not willpower.
            </p>
            <a
              href={AMAZON_LINK}
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

        {/* Contact card — unfurls L→R with border tracer */}
        <div
          ref={contact.ref}
          className={`relative mt-6 w-full rounded-[2rem] transition-all duration-700 ease-out ${
            contact.visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            clipPath: contact.visible
              ? "inset(0 0 0 0)"
              : "inset(0 100% 0 0)",
            transition:
              "clip-path 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s, opacity 0.5s ease 0.15s",
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2rem] ${
              contactTraced ? "border-tracer-active" : ""
            }`}
          />
          <div className="freeform-surface rounded-[2rem] px-6 py-5">
            <p className="text-xs uppercase tracking-[0.35em] text-accent">
              Get in Touch
            </p>
            <div className="mt-4 space-y-3 text-base leading-7 text-foreground/[0.78]">
              <p>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Email
                </span>
                <br />
                <a
                  href="mailto:author@example.com"
                  className="reactive-highlight text-foreground hover:text-primary"
                >
                  author@example.com
                </a>
              </p>
              <p>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Social
                </span>
                <br />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reactive-highlight text-foreground hover:text-primary"
                >
                  Instagram
                </a>
                <span className="mx-2 text-border">·</span>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reactive-highlight text-foreground hover:text-primary"
                >
                  Twitter / X
                </a>
              </p>
            </div>
          </div>
        </div>

        <EmailSubscribeCard />
      </div>
    </section>
  );
};

export default AuthorPage;
