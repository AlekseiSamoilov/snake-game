import { useCallback } from "react";
import Particles from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export default function BackgroundParticles() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="bg-particles"
            init={particlesInit}
            style={{ pointerEvents: "none" }}
            options={{
                fullScreen: { enable: true, zIndex: 10 },
                fpsLimit: 60,
                background: { color: "transparent" },
                particles: {
                    number: { value: 55, density: { enable: true, width: 1200, height: 900 } },
                    color: { value: ["#f6e6a8", "#d9f2a6", "#f4d37a"] },
                    shape: { type: "circle" },
                    opacity: { value: { min: 0.1, max: 0.5 } },
                    size: { value: { min: 1, max: 3 } },
                    move: {
                        enable: true,
                        speed: 0.35,
                        direction: "none",
                        outModes: { default: "out" },
                    }
                },
                detectRetina: true,
            }}
        />
    )

}
