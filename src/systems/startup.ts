import { active } from "../components/active";
import { attractor } from "../components/attractor";
import { Components } from "../components/components";
import { withGravity } from "../components/gravity";
import { withShapeMass } from "../components/mass";
import { withPosition } from "../components/position";
import { withShape } from "../components/shape";
import { withTarget } from "../components/target";
import { ComponentArg, System } from "../ecs";
import { Resources } from "../resources";
import { randomBetween, randomElement, randomInt } from "../utils";
import { Vec2, vec2 } from "../vec2";
import { randomColor, rgb } from "./draw";

export const BALL_RADIUS = 4;

const randomPointOnPlanetSurface = (center: Vec2, radius: number, ballRadius = BALL_RADIUS): Vec2 => {
  const angle = randomBetween(0, 2 * Math.PI);
  return center.add(vec2(Math.cos(angle), Math.sin(angle)).times(radius + ballRadius));
};

export const addPlanets = (count = 10): System<Components> => app => {
  for (let i = 0; i < count; i++) {
    const pos = vec2(randomInt(0, window.innerWidth), randomInt(0, window.innerHeight));
    const radius = randomInt(10, 60);
    const components: ComponentArg<Components>[] = [
      withPosition(pos),
      withShape({
        shape: 'circle',
        color: randomColor(),
        radius,
      }),
      withShapeMass,
      attractor,
    ];

    if (i === count - 1) {
      components.push(withTarget(randomPointOnPlanetSurface(pos, radius, 0)));
    }

    app.addEntity(...components);
  }
};

export const addBalls = (count = 1): System<Components> => app => {
  const planets = [...app.query('position', 'shape', 'attractor')];

  for (let i = 0; i < count; i++) {
    const [{ position: planetPos }, { radius: planetRadius }] = randomElement(planets);

    app.addEntity(
      withPosition(randomPointOnPlanetSurface(planetPos, planetRadius)),
      withShape({
        shape: 'circle',
        radius: BALL_RADIUS,
        color: rgb(255, 255, 255),
      }),
      withShapeMass,
      withGravity(vec2(0, 0), vec2(0, 0)),
    );
  }
};

export const addInputs: System<Components, Resources> = app => {
  const { canvas, action } = app.resources;
  canvas.addEventListener('pointerdown', ev => {
    action.start.set(ev.clientX, ev.clientY);
  });

  canvas.addEventListener('pointermove', ev => {
    if (action.start.x < Infinity) {
      action.end.set(ev.clientX, ev.clientY);
    }
  });

  canvas.addEventListener('pointerup', () => {
    const v = action.start.sub(action.end).times(500).limit(100000 * 0.6);
    for (const [{ acceleration }, entity] of app.query('gravity')) {
      if (!app.hasComponent(entity, 'active')) {
        app.addComponent(entity, active);
      }

      acceleration.addMut(v);
    }

    action.start.set(Infinity, Infinity);
    action.end.set(Infinity, Infinity);
  });
};