import { useEffect, useRef } from 'react';

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
}

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const COLS = Math.max(8, Math.floor(width / 90));
    const ROWS = Math.max(6, Math.floor(height / 90));
    const nodes: Node[] = [];

    for (let i = 0; i <= COLS; i++) {
      for (let j = 0; j <= ROWS; j++) {
        const x = (i / COLS) * width;
        const y = (j / ROWS) * height;
        nodes.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 });
      }
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const handleLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    let raf: number;
    const MAX_DIST = 160;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update node positions — repel from mouse
      for (const n of nodes) {
        const dx = n.baseX - mouse.current.x;
        const dy = n.baseY - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let targetX = n.baseX;
        let targetY = n.baseY;
        if (dist < MAX_DIST) {
          const force = (1 - dist / MAX_DIST) * 28;
          const angle = Math.atan2(dy, dx);
          targetX += Math.cos(angle) * force;
          targetY += Math.sin(angle) * force;
        }
        n.vx += (targetX - n.x) * 0.08;
        n.vy += (targetY - n.y) * 0.08;
        n.vx *= 0.82;
        n.vy *= 0.82;
        n.x += n.vx;
        n.y += n.vy;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // connect to right and down neighbor (grid lines)
        const rowLen = ROWS + 1;
        const right = nodes[i + rowLen];
        const down = (i % rowLen !== ROWS) ? nodes[i + 1] : null;

        for (const b of [right, down]) {
          if (!b) continue;
          const dxm = a.x - mouse.current.x;
          const dym = a.y - mouse.current.y;
          const distM = Math.sqrt(dxm * dxm + dym * dym);
          const proximity = Math.max(0, 1 - distM / 280);
          const alpha = 0.04 + proximity * 0.35;

          ctx.strokeStyle = `rgba(255,107,26,${alpha})`;
          ctx.lineWidth = 0.6 + proximity * 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const dxm = n.x - mouse.current.x;
        const dym = n.y - mouse.current.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        const proximity = Math.max(0, 1 - distM / 200);
        const r = 1.2 + proximity * 2.5;
        const alpha = 0.25 + proximity * 0.6;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${140 + Math.floor(proximity * 80)},${60 + Math.floor(proximity * 100)},${alpha})`;
        if (proximity > 0.1) {
          ctx.shadowColor = 'rgba(255,107,26,0.8)';
          ctx.shadowBlur = 8 * proximity;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
