import { Game } from "./main";
import { Vec2 } from "./vec2";

export type Resources = {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  action: {
    start: Vec2,
    end: Vec2,
    maxLength: number,
  },
  camera: {
    offset: Vec2,
  },
  game: Game,
};