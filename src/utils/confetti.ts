/**
 * Restrained adult confetti: strictly 40 particles, muted metallic and jewel tones
 */
export function fireRestrainedConfetti() {
  if (typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = [
    '#8b5cf6', // Violet
    '#f59e0b', // Gold
    '#10b981', // Mint
    '#0284c7', // Sky
    '#f43f5e', // Rose
    '#d1d5db', // Platinum
  ];

  // Exactly 40 particles
  const particles = Array.from({ length: 40 }).map(() => ({
    x: width * 0.5 + (Math.random() - 0.5) * 80,
    y: height * 0.45,
    vx: (Math.random() - 0.5) * 8,
    vy: -(Math.random() * 8 + 4),
    gravity: 0.18 + Math.random() * 0.08,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 1,
    wobble: Math.random() * 10,
  }));

  const startTime = performance.now();
  const maxDuration = 3200; // ms

  function animate(now: number) {
    if (!ctx) return;
    const elapsed = now - startTime;
    if (elapsed > maxDuration) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.wobble += 0.08;
      p.x += Math.sin(p.wobble) * 0.5;

      if (elapsed > maxDuration - 800) {
        p.opacity = Math.max(0, (maxDuration - elapsed) / 800);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      // Draw rectangular slip
      ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.6);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
