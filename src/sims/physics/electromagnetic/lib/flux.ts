import { Vector3D, Vector2D, vector3D } from './constants';
import { MagneticDipole, MagneticDipole2D, calculateDipoleField, calculateMagneticField } from './dipoleField';

export interface CircularCoil {
  center: Vector3D;
  radius: number;
  normal: Vector3D; // Normal vector to coil plane
  turns: number;
  area: number; // Total effective area
}

export interface CircularCoil2D {
  center: Vector2D;
  radius: number;
  turns: number;
  area: number; // Total effective area
}

/**
 * Calculate magnetic flux through a circular coil in 2D (simplified)
 */
export function calculateMagneticFlux2D(
  dipole: MagneticDipole2D,
  coil: CircularCoil2D
): number {
  // Simple approach: calculate field at coil center and multiply by area
  const field = calculateMagneticField(dipole, coil.center);
  const fieldMagnitude = Math.sqrt(field.x * field.x + field.y * field.y);

  // Return flux through circular coil: Φ = B * Area (for single loop)
  return fieldMagnitude * coil.area;
}

/**
 * Calculate magnetic flux through a circular coil using numerical integration
 * Φ = ∫B⋅dA over the coil area
 */
export function calculateMagneticFlux(
  dipole: MagneticDipole,
  coil: CircularCoil,
  integrationPoints: number = 20
): number {
  let totalFlux = 0;
  const deltaR = coil.radius / integrationPoints;
  const deltaTheta = (2 * Math.PI) / integrationPoints;

  // Numerical integration over coil area using polar coordinates
  for (let i = 0; i < integrationPoints; i++) {
    for (let j = 0; j < integrationPoints; j++) {
      const r = (i + 0.5) * deltaR;
      const theta = (j + 0.5) * deltaTheta;

      // Convert to Cartesian coordinates on the coil plane
      const localX = r * Math.cos(theta);
      const localY = r * Math.sin(theta);

      // Assume coil is in XZ plane for simplicity (normal = [0, 1, 0])
      const fieldPoint: Vector3D = {
        x: coil.center.x + localX,
        y: coil.center.y,
        z: coil.center.z + localY,
      };

      const field = calculateDipoleField(dipole, fieldPoint);
      const fluxDensity = vector3D.dot(field, coil.normal);

      // Area element in polar coordinates: r * dr * dtheta
      const areaElement = r * deltaR * deltaTheta;
      totalFlux += fluxDensity * areaElement;
    }
  }

  // Multiply by number of turns
  return totalFlux * coil.turns;
}

/**
 * Calculate induced EMF using Faraday's law: ε = -N × dΦ/dt
 */
export function calculateInducedEMF(
  previousFlux: number,
  currentFlux: number,
  deltaTime: number,
  turns: number
): number {
  if (deltaTime === 0) return 0;

  const dFluxDt = (currentFlux - previousFlux) / deltaTime;
  return -turns * dFluxDt; // Faraday's law with N turns
}

/**
 * Calculate induced current using Ohm's law: I = V/R
 */
export function calculateInducedCurrent(emf: number, resistance: number): number {
  return emf / resistance;
}

/**
 * Calculate power dissipated in the coil: P = I²R
 */
export function calculatePower(current: number, resistance: number): number {
  return current * current * resistance;
}
