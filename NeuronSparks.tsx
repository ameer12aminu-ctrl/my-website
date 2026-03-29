import { useEffect, useRef } from "react";

/**
 * Brain boundary — an ellipse that approximates where the brain sits
 * in the background image (centered upper area).
 * Values are fractions of viewport width/height.
 */
const BRAIN_BOUNDS = {
  cx: 0.42,   // center x (slightly left of center)
  cy: 0.30,   // center y (upper third)
  rx: 0.34,   // horizontal radius
  ry: 0.30,   // vertical radius
};

/** Check if a point is inside the brain ellipse */
function insideBrain(x: number, y: number, w: number, h: number): boolean {
  const dx = (x / w - BRAIN_BOUNDS.cx) / BRAIN_BOUNDS.rx;
  const dy = (y / h - BRAIN_BOUNDS.cy) / BRAIN_BOUNDS.ry;
  return dx * dx + dy * dy <= 1;
}

/** Pick a random point inside the brain ellipse */
function randomBrainPoint(w: number, h: number): { x: number; y: number } {
  // rejection sampling inside ellipse
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()); // sqrt for uniform distribution
    const x = (BRAIN_BOUNDS.cx + BRAIN_BOUNDS.rx * r * Math.cos(angle)) * w;
    const y = (BRAIN_BOUNDS.cy + BRAIN_BOUNDS.ry * r * Math.sin(angle)) * h;
    if (x >= 0 && x <= w && y >= 0 && y <= h) return { x, y };
  }
  return { x: BRAIN_BOUNDS.cx * w, y: BRAIN_BOUNDS.cy * h };
}

/** Generate a jagged lightning bolt path between two points */
function lightningPath(
  x1: number, y1: number, x2: number, y2: number, detail: number = 5
): { x: number; y: number }[] {
  const points = [{ x: x1, y: y1 }];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return points;
  const nx = -dy / len;
  const ny = dx / len;

  const segments = detail + Math.floor(Math.random() * 3);
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const offset = (Math.random() - 0.5) * len * 0.25;
    points.push({
      x: x1 + dx * t + nx * offset,
      y: y1 + dy * t + ny * offset,
    });
  }
  points.push({ x: x2, y: y2 });
  return points;
}

interface Arc {
  points: { x: number; y: number }[];
  life: number;
  maxLife: number;
  hue: number;
  width: number;
  branches: { points: { x: number; y: number }[] }[];
}

const NeuronSparks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let arcs: Arc[] = [];
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Scroll-driven arc spawning
    let scrollAccum = 0;
    const onScroll = () => {
      scrollAccum += 1;
      if (scrollAccum >= 3) {
        spawnArc(performance.now());
        scrollAccum = 0;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const spawnArc = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Start and end points must be inside the brain boundary
      const start = randomBrainPoint(w, h);
      const angle = Math.random() * Math.PI * 2;
      const length = 40 + Math.random() * 100;
      let end = {
        x: start.x + Math.cos(angle) * length,
        y: start.y + Math.sin(angle) * length,
      };

      // Clamp end point to brain boundary
      if (!insideBrain(end.x, end.y, w, h)) {
        // Shorten the arc to stay inside
        for (let t = 0.9; t > 0.1; t -= 0.1) {
          const tx = start.x + Math.cos(angle) * length * t;
          const ty = start.y + Math.sin(angle) * length * t;
          if (insideBrain(tx, ty, w, h)) {
            end = { x: tx, y: ty };
            break;
          }
        }
      }

      const hue = Math.random() > 0.5 ? 24 : 196;
      const points = lightningPath(start.x, start.y, end.x, end.y);

      // 1-2 small branches (also clamped to brain)
      const branches: { points: { x: number; y: number }[] }[] = [];
      const branchCount = Math.floor(Math.random() * 2) + 1;
      for (let b = 0; b < branchCount; b++) {
        const idx = 1 + Math.floor(Math.random() * (points.length - 2));
        const bp = points[idx];
        const bAngle = angle + (Math.random() - 0.5) * 1.5;
        const bLen = 15 + Math.random() * 35;
        let bEnd = {
          x: bp.x + Math.cos(bAngle) * bLen,
          y: bp.y + Math.sin(bAngle) * bLen,
        };
        if (!insideBrain(bEnd.x, bEnd.y, w, h)) {
          bEnd = { x: bp.x + Math.cos(bAngle) * bLen * 0.4, y: bp.y + Math.sin(bAngle) * bLen * 0.4 };
        }
        branches.push({
          points: lightningPath(bp.x, bp.y, bEnd.x, bEnd.y, 3),
        });
      }

      arcs.push({
        points,
        life: 0,
        maxLife: 12 + Math.random() * 18,
        hue,
        width: 1 + Math.random() * 1.5,
        branches,
      });
      lastSpawn = time;
    };

    const drawBolt = (
      pts: { x: number; y: number }[],
      alpha: number,
      hue: number,
      width: number
    ) => {
      if (pts.length < 2) return;

      // Glow layer
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha * 0.3})`;
      ctx.lineWidth = width * 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Core line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = `hsla(${hue}, 85%, 85%, ${alpha * 0.7})`;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn every 1.5-3s when idle
      if (time - lastSpawn > 1500 + Math.random() * 1500) {
        spawnArc(time);
      }

      arcs = arcs.filter((a) => a.life < a.maxLife);

      for (const a of arcs) {
        a.life++;
        const progress = a.life / a.maxLife;
        const alpha = progress < 0.1 ? 1 : Math.max(0, 1 - (progress - 0.1) / 0.9);

        drawBolt(a.points, alpha, a.hue, a.width);
        for (const branch of a.branches) {
          drawBolt(branch.points, alpha * 0.6, a.hue, a.width * 0.6);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    setTimeout(() => spawnArc(performance.now()), 1500);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
};

export default NeuronSparks;
