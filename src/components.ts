import { ComponentTypes } from "parsecs";
import { Vec2 } from "./vec2";

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