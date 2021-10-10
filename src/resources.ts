import { Vec2 } from "./vec2";

export type Resources = {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  action: {
    start: Vec2,
    end: Vec2,
    maxLength: number,
  },
};