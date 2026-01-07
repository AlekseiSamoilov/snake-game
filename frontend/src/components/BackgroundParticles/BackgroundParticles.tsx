import React, { useEffect, useRef } from "react";
import style from "./BackgroundParticles.module.css";

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  drift: number;
  pulse: number;
  pulseSpeed: number;
};

const PARTICLE_COUNT = 70;

const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const spawnParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 1 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.5,
          speed: 0.15 + Math.random() * 0.45,
          drift: (Math.random() - 0.5) * 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.015,
        };
      });
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.pulse += particle.pulseSpeed;
        particle.alpha = 0.25 + Math.abs(Math.sin(particle.pulse)) * 0.5;
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -10) {
          particle.y = window.innerHeight + 10;
          particle.x = Math.random() * window.innerWidth;
        }

        if (particle.x < -10) particle.x = window.innerWidth + 10;
        if (particle.x > window.innerWidth + 10) particle.x = -10;

        context.beginPath();
        context.fillStyle = `rgba(255, 248, 200, ${particle.alpha})`;
        context.shadowColor = "rgba(255, 231, 150, 0.7)";
        context.shadowBlur = 8;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    spawnParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={style.particles} />;
};

export default BackgroundParticles;
