import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const EmailPopup = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (dismissed) return;

    const handleLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setVisible(true);
    };

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.4) setVisible(true);
    };

    window.addEventListener("mouseout", handleLeave);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mouseout", handleLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dismissed]);

  useEffect(() => {
    if (!visible || scriptLoaded.current || !containerRef.current) return;
    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://ameer-aminu.kit.com/1b2fe43ade/index.js";
    script.async = true;
    script.dataset.uid = "1b2fe43ade";
    containerRef.current.appendChild(script);
  }, [visible]);

  const close = () => {
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem("email-popup-dismissed", "true"); } catch {}
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="freeform-surface relative mx-4 w-full max-w-md rounded-[2rem] px-8 py-10 shadow-2xl">
        <button
          onClick={close}
          className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-accent">
          Before you go
        </p>
        <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
          Don't lose your focus.
        </h2>
        <div ref={containerRef} className="mt-6" />
      </div>
    </div>
  );
};

export default EmailPopup;
