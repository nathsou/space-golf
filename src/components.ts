import { ComponentTypes } from "parsecs";
import { Circle } from "./utils/circlePacking";
import { Color } from "./utils/color";
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
    color: Color,
  },
  attractor: {},
  active: {},
  target: { target: Vec2 },
  starTile: { stars: Circle[], position: Vec2 },
}>;