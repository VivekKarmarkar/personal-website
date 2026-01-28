import { useState, useEffect, useRef } from 'react';
import { PHYSICS_CONSTANTS } from '../lib/constants';
import { MagneticDipole2D } from '../lib/dipoleField';
import { CircularCoil2D, calculateMagneticFlux2D, calculateInducedCurrent, calculatePower } from '../lib/flux';

export interface SimulationState {
  // Control parameters
  magnetStrength: number; // 0-100
  loopCount: number;
  loopArea: number; // 20-100
  rpm: number;
  isPlaying: boolean;

  // Visibility toggles
  showMagneticField: boolean;
  showElectrons: boolean;
  showCompass: boolean;

  // Physics state
  magnetRotation: number; // radians
  magneticFlux: number;
  inducedEMF: number;
  inducedCurrent: number;
  power: number;
  lightBrightness: number; // 0-1
}

export function useSimulationState() {
  const [state, setState] = useState<SimulationState>({
    magnetStrength: 75,
    loopCount: 2,
    loopArea: 60,
    rpm: 30,
    isPlaying: true,
    showMagneticField: true,
    showElectrons: true,
    showCompass: true,
    magnetRotation: 0,
    magneticFlux: 0,
    inducedEMF: 0,
    inducedCurrent: 0,
    power: 0,
    lightBrightness: 0,
  });

  const previousFluxRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Create magnetic dipole from current state
  const createMagneticDipole = (): MagneticDipole2D => ({
    position: { x: -180, y: 0 },
    moment: {
      x: Math.cos(state.magnetRotation) * PHYSICS_CONSTANTS.MAX_FIELD_STRENGTH,
      y: Math.sin(state.magnetRotation) * PHYSICS_CONSTANTS.MAX_FIELD_STRENGTH,
    },
    strength: state.magnetStrength / 100,
  });

  // Create circular coil from current state
  const createCircularCoil = (): CircularCoil2D => {
    const radius = 30 + (state.loopArea / 100) * 40; // 30 to 70 units
    return {
      center: { x: 70, y: 0 }, // Moved 120 units to the right (from -50 to 70)
      radius,
      turns: state.loopCount,
      area: Math.PI * radius * radius,
    };
  };

  // Animation loop
  useEffect(() => {
    let animationId: number;
    let shouldStop = false;

    const animate = () => {
      if (shouldStop) return;

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      setState((prevState) => {
        if (!prevState.isPlaying) {
          return prevState; // Early exit if paused
        }

        // Update magnet rotation based on RPM
        const angularVelocity = (prevState.rpm * 2 * Math.PI) / 60; // rad/s
        const newRotation = prevState.magnetRotation + angularVelocity * deltaTime;

        // Create physics objects with new rotation
        const dipole: MagneticDipole2D = {
          position: { x: -180, y: 0 },
          moment: {
            x: Math.cos(newRotation) * PHYSICS_CONSTANTS.MAX_FIELD_STRENGTH,
            y: Math.sin(newRotation) * PHYSICS_CONSTANTS.MAX_FIELD_STRENGTH,
          },
          strength: prevState.magnetStrength / 100,
        };

        const coil = createCircularCoil();

        // Calculate physics
        const magneticFlux = calculateMagneticFlux2D(dipole, coil);

        // Analytical EMF calculation: EMF = N * B₀ * Area * ω * sin(ωt)
        const distance = Math.sqrt(
          (dipole.position.x - coil.center.x) ** 2 + (dipole.position.y - coil.center.y) ** 2
        );
        const effectiveFieldStrength =
          (PHYSICS_CONSTANTS.MAX_FIELD_STRENGTH * dipole.strength) / distance ** 2;
        const inducedEMF =
          coil.turns * effectiveFieldStrength * coil.area * angularVelocity * Math.sin(newRotation);

        const inducedCurrent = calculateInducedCurrent(inducedEMF, PHYSICS_CONSTANTS.COIL_RESISTANCE);
        const power = calculatePower(inducedCurrent, PHYSICS_CONSTANTS.COIL_RESISTANCE);

        // Update flux reference for next calculation
        previousFluxRef.current = magneticFlux;

        // Calculate light brightness based on power (clamped 0-1)
        const lightBrightness = Math.min(1, Math.abs(power) * 1000);

        return {
          ...prevState,
          magnetRotation: newRotation % (2 * Math.PI),
          magneticFlux,
          inducedEMF,
          inducedCurrent,
          power,
          lightBrightness,
        };
      });

      animationId = requestAnimationFrame(animate);
    };

    if (state.isPlaying) {
      lastTimeRef.current = performance.now(); // Reset time reference
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      shouldStop = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.isPlaying, state.rpm, state.magnetStrength, state.loopCount, state.loopArea]);

  const updateState = (updates: Partial<SimulationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return {
    state,
    updateState,
    magneticDipole: createMagneticDipole(),
    circularCoil: createCircularCoil(),
  };
}
