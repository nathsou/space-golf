import { ComponentTypes } from "parsecs";
import { Vec2 } from "./utils/vec2";

export type Components = ComponentTypes<{
  body: { position: Vec2, mass: number },
  movement: {
    acceleration: Vec2,
    velocity: Vec2,
    prevPosition: Vec2,
  },
  shape: {
    kind: 'circle',
    radius: number,
    color: string,
  },
  attractor: {},
  active: {},
  target: { target: Vec2 },
}>;

export const ACTIVE_BALLS = ['active', 'movement', 'body', 'shape'] as const;
export const BALLS = ['movement', 'body', 'shape'] as const;
export const PLANETS = ['attractor', 'body', 'shape'] as const;
export const ACTIVE_MOVING_BODIES = ['active', 'movement', 'body'] as const;
export const MOVING_BODIES = ['movement', 'body'] as const;
export const ATTRACTING_BODIES = ['attractor', 'body'] as const;
export const TARGETS = ['target'] as const;