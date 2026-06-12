/**
 * Canvas: slow drifting gradient orbs (static page bg via CSS)
 */
export function initCanvasEnvironment() {
  const canvas = document.getElementById("environment-canvas");
  if (!canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0;
  let height = 0;
  const orbs = [
    { x: 0.75, y: 0.25, r: 0.35, color: [139, 157, 131], phase: 0 },
    { x: 0.2, y: 0.7, r: 0.4, color: [212, 175, 55], phase: 2 },
    { x: 0.55, y: 0.55, r: 0.28, color: [100, 90, 70], phase: 4 },
  ];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawOrb = (orb) => {
    const ox = orb.x;
    const oy = orb.y;
    const radius = Math.min(width, height) * orb.r;

    const gradient = ctx.createRadialGradient(
      ox * width,
      oy * height,
      0,
      ox * width,
      oy * height,
      radius
    );

    const [r, g, b] = orb.color;
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.04)`);
    gradient.addColorStop(1, "rgba(10, 12, 10, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ox * width, oy * height, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const paint = () => {
    ctx.clearRect(0, 0, width, height);
    orbs.forEach((orb) => drawOrb(orb));
  };

  resize();
  paint();
  window.addEventListener("resize", () => {
    resize();
    paint();
  });

  return {
    destroy: () => {
      window.removeEventListener("resize", resize);
    },
  };
};