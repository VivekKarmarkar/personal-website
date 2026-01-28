import { PHYSICS_CONSTANTS, Vector3D, Vector2D, vector3D, vector2D } from './constants';

export interface MagneticDipole {
  position: Vector3D;
  moment: Vector3D; // Magnetic dipole moment in A⋅m²
  strength: number; // 0-1 scaling factor
}

export interface MagneticDipole2D {
  position: Vector2D;
  moment: Vector2D; // Magnetic dipole moment in 2D
  strength: number; // 0-1 scaling factor
}

/**
 * Calculate magnetic field B at position r due to a magnetic dipole in 2D
 * Using simplified dipole field equation for 2D
 */
export function calculateMagneticField(
  dipole: MagneticDipole2D,
  position: Vector2D
): Vector2D {
  const r = vector2D.subtract(position, dipole.position);
  const rMag = vector2D.magnitude(r);

  // Avoid singularity at dipole position
  if (rMag < 0.01) {
    return { x: 0, y: 0 };
  }

  const rHat = vector2D.normalize(r);
  const m = vector2D.scale(dipole.moment, dipole.strength);

  // Calculate (m⋅r̂)
  const mDotRHat = vector2D.dot(m, rHat);

  // Calculate 3(m⋅r̂)r̂
  const term1 = vector2D.scale(rHat, 3 * mDotRHat);

  // Calculate 3(m⋅r̂)r̂ - m
  const numerator = vector2D.subtract(term1, m);

  // Apply visualization scaling instead of realistic physics
  // Use a much larger coefficient for visualization purposes
  const coefficient = 1000 / Math.pow(rMag, 2); // Changed from r³ to r² and increased scale

  return vector2D.scale(numerator, coefficient);
}

/**
 * Calculate magnetic field B at position r due to a magnetic dipole
 * Using the dipole field equation: B = (μ₀/4π) * (3(m⋅r̂)r̂ - m) / r³
 */
export function calculateDipoleField(
  dipole: MagneticDipole,
  position: Vector3D
): Vector3D {
  const r = vector3D.subtract(position, dipole.position);
  const rMag = vector3D.magnitude(r);

  // Avoid singularity at dipole position
  if (rMag < 0.01) {
    return { x: 0, y: 0, z: 0 };
  }

  const rHat = vector3D.normalize(r);
  const m = vector3D.scale(dipole.moment, dipole.strength);

  // Calculate (m⋅r̂)
  const mDotRHat = vector3D.dot(m, rHat);

  // Calculate 3(m⋅r̂)r̂
  const term1 = vector3D.scale(rHat, 3 * mDotRHat);

  // Calculate 3(m⋅r̂)r̂ - m
  const numerator = vector3D.subtract(term1, m);

  // Apply μ₀/4π / r³
  const coefficient = (PHYSICS_CONSTANTS.MU_0 / (4 * Math.PI)) / Math.pow(rMag, 3);

  return vector3D.scale(numerator, coefficient);
}

/**
 * Calculate magnetic field lines by tracing field vectors
 */
export function generateFieldLines(
  dipole: MagneticDipole,
  numLines: number = 16,
  stepSize: number = 0.1,
  maxSteps: number = 200
): Vector3D[][] {
  const fieldLines: Vector3D[][] = [];

  // Create starting points around the dipole
  for (let i = 0; i < numLines; i++) {
    const angle = (2 * Math.PI * i) / numLines;
    const startRadius = 0.5;

    // Start from north pole area
    const startPoint: Vector3D = {
      x: dipole.position.x + startRadius * Math.cos(angle),
      y: dipole.position.y + 0.2,
      z: dipole.position.z + startRadius * Math.sin(angle),
    };

    const line = traceFieldLine(dipole, startPoint, stepSize, maxSteps);
    if (line.length > 1) {
      fieldLines.push(line);
    }
  }

  return fieldLines;
}

function traceFieldLine(
  dipole: MagneticDipole,
  startPoint: Vector3D,
  stepSize: number,
  maxSteps: number
): Vector3D[] {
  const line: Vector3D[] = [startPoint];
  let currentPoint = { ...startPoint };

  for (let step = 0; step < maxSteps; step++) {
    const field = calculateDipoleField(dipole, currentPoint);
    const fieldMag = vector3D.magnitude(field);

    // Stop if field is too weak or we're too close to dipole
    if (fieldMag < 1e-10) break;

    const fieldDirection = vector3D.normalize(field);
    const nextPoint = vector3D.add(currentPoint, vector3D.scale(fieldDirection, stepSize));

    // Stop if we've moved too far from the dipole
    const distanceFromDipole = vector3D.magnitude(vector3D.subtract(nextPoint, dipole.position));
    if (distanceFromDipole > 5) break;

    line.push(nextPoint);
    currentPoint = nextPoint;
  }

  return line;
}
