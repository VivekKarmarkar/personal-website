// Physics constants for electromagnetic simulation

export const PHYSICS_CONSTANTS = {
  // Vacuum permeability (μ₀) in H/m
  MU_0: 4 * Math.PI * 1e-7,

  // Scaling factors for visualization
  FIELD_SCALE: 1e6, // Scale magnetic field for visualization
  CURRENT_SCALE: 1000, // Scale current for electron animation

  // Simulation parameters
  MAX_FIELD_STRENGTH: 0.1, // Tesla
  COIL_RESISTANCE: 10, // Ohms

  // Conversion factors
  DEGREES_TO_RADIANS: Math.PI / 180,
  RADIANS_TO_DEGREES: 180 / Math.PI,
} as const;

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type Vector2D = {
  x: number;
  y: number;
};

export const vector2D = {
  add: (a: Vector2D, b: Vector2D): Vector2D => ({
    x: a.x + b.x,
    y: a.y + b.y,
  }),

  subtract: (a: Vector2D, b: Vector2D): Vector2D => ({
    x: a.x - b.x,
    y: a.y - b.y,
  }),

  scale: (v: Vector2D, s: number): Vector2D => ({
    x: v.x * s,
    y: v.y * s,
  }),

  magnitude: (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y),

  normalize: (v: Vector2D): Vector2D => {
    const mag = vector2D.magnitude(v);
    return mag === 0 ? { x: 0, y: 0 } : vector2D.scale(v, 1 / mag);
  },

  dot: (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y,
};

export const vector3D = {
  add: (a: Vector3D, b: Vector3D): Vector3D => ({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }),

  subtract: (a: Vector3D, b: Vector3D): Vector3D => ({
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }),

  scale: (v: Vector3D, s: number): Vector3D => ({
    x: v.x * s,
    y: v.y * s,
    z: v.z * s,
  }),

  magnitude: (v: Vector3D): number => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),

  normalize: (v: Vector3D): Vector3D => {
    const mag = vector3D.magnitude(v);
    return mag === 0 ? { x: 0, y: 0, z: 0 } : vector3D.scale(v, 1 / mag);
  },

  dot: (a: Vector3D, b: Vector3D): number => a.x * b.x + a.y * b.y + a.z * b.z,

  cross: (a: Vector3D, b: Vector3D): Vector3D => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
};
