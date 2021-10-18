import { App, combineSystems, System } from 'parsecs';
import { BALLS, Components, MOVING_BODIES, PLANETS, TARGETS } from "../components";
import { Resources } from "../resources";
import { StarMap } from "../starMap";
import { Vec2 } from "../utils/vec2";
import { BALL_RADIUS } from "./startup";

const TWO_PI = 2 * Math.PI;
export const TARGET_RADIUS = BALL_RADIUS * 2;

const BACKGROUND_COLOR = 'rgb(9, 7, 56)';

export const clearCanvasSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  const { canvas, context: ctx } = app.resources;
  ctx.clearRect(0, 0, app.resources.canvas.width, canvas.height);
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  center: Vec2,
  radius: number,
  color: string
): void => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(center.x, center.y, radius, 0, TWO_PI);
  ctx.closePath();
  ctx.fill();
};

export const drawPlanetsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  for (const [_, { position }, shape] of app.queryIter(PLANETS)) {
    if (shape.kind === 'circle') {
      drawCircle(
        app.resources.context,
        Vec2.v1.copy(position).addMut(app.resources.game.camera.offset),
        shape.radius,
        shape.color,
      );
    }
  }
};

export const drawBallsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  for (const [_, { position }, shape, entity] of app.queryIter(BALLS)) {
    if (shape.kind === 'circle') {
      const pos = Vec2.v1.copy(position).addMut(app.resources.game.camera.offset);
      const color = app.hasComponent(entity, 'active') ? shape.color : 'lightgrey';
      drawCircle(app.resources.context, pos, shape.radius, color);
    }
  }
};

const drawArrowsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  const { context: ctx, action } = app.resources;
  const offset = app.resources.game.camera.offset;

  if (action.start.x < Infinity) {
    const v = Vec2.v1
      .copy(action.start)
      .subMut(action.end)
      .timesMut(0.5)
      .limitMut(action.maxLength);

    for (const [_, { position }] of app.queryIter(MOVING_BODIES)) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.moveTo(position.x + offset.x, position.y + offset.y);
      ctx.lineTo(position.x + offset.x + v.x, position.y + offset.y + v.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
};

const drawTargetsSystem: System<Components, Resources> = app => {
  const { context: ctx } = app.resources;
  const offset = app.resources.game.camera.offset;

  for (const [{ target }] of app.queryIter(TARGETS)) {
    ctx.beginPath();
    ctx.fillStyle = BACKGROUND_COLOR;

    ctx.arc(target.x + offset.x, target.y + offset.y, TARGET_RADIUS, 0, TWO_PI);
    ctx.closePath();
    ctx.fill();
  }
};

const STAR_COLOR = 'rgb(234, 231, 163)';

const drawStarsSystem: System<Components, Resources> = app => {
  const { context: ctx, stars } = app.resources;
  const offset = app.resources.game.camera.offset;

  for (const tile of stars.visibleTiles(offset, ctx.canvas.width, ctx.canvas.height)) {
    for (const { center, radius } of tile.stars) {
      const x = offset.x - center.x + ctx.canvas.width - StarMap.TILE_SIZE;
      const y = offset.y - center.y + ctx.canvas.height - StarMap.TILE_SIZE;
      drawCircle(ctx, Vec2.v1.set(x, y), radius, STAR_COLOR);
    }
  }
};

export const drawSystem = combineSystems(
  clearCanvasSystem,
  drawStarsSystem,
  drawPlanetsSystem,
  drawTargetsSystem,
  drawBallsSystem,
  drawArrowsSystem,
);