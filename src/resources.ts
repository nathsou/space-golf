import { Game } from "./main";
import { StarMap } from "./starMap";
import { Vec2 } from "./utils/vec2";

export type Resources = {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  action: {
    start: Vec2,
    end: Vec2,
    maxLength: number,
  },
  game: Game,
  stars: StarMap,
};