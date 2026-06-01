"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // 🎛️ Configurations
    const particleCount = 110;           // Clean star count
    const mouseRadius = 100;              // Hover range for interaction
    const rippleForce = 2.5;              // Gentle push physics

    const mouse = {
      x: null as number | null,
      y: null as number | null,
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      twinkleOffset: number;
      velocityX: number;
      velocityY: number;

      // Modified to take raw dimensions to fix 'canvas is possibly null' error
      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 1.4 + 0.8; // Keeps stars sharp and clean
        this.density = Math.random() * 20 + 1;
        this.twinkleOffset = Math.random() * 100;
        this.velocityX = (Math.random() - 0.5) * 0.22;
        this.velocityY = (Math.random() - 0.5) * 0.22;
      }

      draw() {
        if (!ctx) return;

        // Subtle twinkling animation mechanics
        const timeFactor = Date.now() * 0.002; 
        const currentAlpha = Math.sin(timeFactor + this.twinkleOffset) * 0.2 + 0.6;

        // Radial gradient: Hot white core fading directly into deep true red
        let starGlowGradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        
        // Removed all pink values — purely white and rich brand red now
        starGlowGradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`);
        starGlowGradient.addColorStop(0.25, `rgba(225, 29, 72, ${currentAlpha * 0.85})`);
        starGlowGradient.addColorStop(1, "rgba(225, 29, 72, 0)");

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        
        // Clean red outer glow atmosphere
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = "rgb(225, 29, 72)";
        
        ctx.fillStyle = starGlowGradient;
        ctx.fill();
        ctx.closePath();
      }

      update() {
        if (!canvas) return;

        this.baseX += this.velocityX;
        this.baseY += this.velocityY;

        const edgePadding = 20;
        if (this.baseX > canvas.width + edgePadding) this.baseX = -edgePadding;
        if (this.baseX < -edgePadding) this.baseX = canvas.width + edgePadding;
        if (this.baseY > canvas.height + edgePadding) this.baseY = -edgePadding;
        if (this.baseY < -edgePadding) this.baseY = canvas.height + edgePadding;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouseRadius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density * rippleForce;
            let directionY = forceDirectionY * force * this.density * rippleForce;

            this.x -= directionX;
            this.y -= directionY;
            return; 
          }
        }

        // Smoothly ease back to home anchors
        if (this.x !== this.baseX) {
          let dxBase = this.x - this.baseX;
          this.x -= dxBase / 15;
        }
        if (this.y !== this.baseY) {
          let dyBase = this.y - this.baseY;
          this.y -= dyBase / 15;
        }
      }
    }

    function initParticles() {
      // Safely ensure canvas exists before parsing properties
      if (!canvas) return; 

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        // Passing current canvas dimensions into the constructor call
        particles.push(new Particle(canvas.width, canvas.height));
      }
    }

    function animate() {
      // 🛠️ FIX: Added strict runtime check to satisfy TypeScript compilation
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1, 
        pointerEvents: "none", 
        backgroundColor: "transparent",
      }}
    />
  );
}
