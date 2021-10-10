import { Components } from "../components/components";
import { App, System } from "../ecs";
import { Resources } from "../resources";
import { Vec2 } from "../vec2";
import { BALL_RADIUS } from "./startup";

const TWO_PI = 2 * Math.PI;
export const TARGET_RADIUS = BALL_RADIUS * 2;

export type Color = { r: number, g: number, b: number };
export const rgb = (r: number, g: number, b: number): Color => ({ r, g, b });
export const randomColor = () => rgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
const formatColor = ({ r, g, b }: Color) => `rgb(${r}, ${g}, ${b})`;

const BACKGROUND_COLOR = 'rgb(0, 13, 36)';

export const drawSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  clearCanvasSystem(app);
  drawPlanetsSystem(app);
  drawTargetsSystem(app);
  drawBallsSystem(app);
  drawArrowsSystem(app);
};

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
  color: Color
): void => {
  ctx.beginPath();
  ctx.fillStyle = formatColor(color);
  ctx.arc(center.x, center.y, radius, 0, TWO_PI);
  ctx.closePath();
  ctx.fill();
};

export const drawPlanetsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  for (const [{ position }, shape] of app.query('position', 'shape', 'attractor')) {
    if (shape.shape === 'circle') {
      drawCircle(app.resources.context, position, shape.radius, shape.color);
    }
  }
};

export const drawBallsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  for (const [{ position }, shape] of app.query('position', 'shape', 'gravity')) {
    if (shape.shape === 'circle') {
      drawCircle(app.resources.context, position, shape.radius, shape.color);
    }
  }
};

const drawArrowsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  const { context: ctx, action } = app.resources;
  if (action.start.x < Infinity) {
    const v = action.start.sub(action.end).times(0.5).limit(action.maxLength);

    for (const [{ position }] of app.query('position', 'gravity')) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x + v.x, position.y + v.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
};

const drawTargetsSystem: System<Components, Resources> = (app: App<Components, Resources>) => {
  const { context: ctx } = app.resources;
  for (const [{ target }] of app.query('target')) {
    ctx.beginPath();
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.arc(target.x, target.y, TARGET_RADIUS, 0, TWO_PI);
    ctx.closePath();
    ctx.fill();
  }
};