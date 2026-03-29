import { useEffect, useRef } from "react";

const EmailSubscribeCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.src = "https://ameer-aminu.kit.com/1b2fe43ade/index.js";
    script.async = true;
    script.dataset.uid = "1b2fe43ade";
    containerRef.current.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="mx-auto mt-20 max-w-2xl" ref={containerRef} />
  );
};

export default EmailSubscribeCard;
