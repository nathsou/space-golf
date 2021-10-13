import { Components } from "../components";
import { System } from "parsecs";
import { Resources } from "../resources";
import { randomBetween, randomElement, randomInt } from "../utils";
import { Vec2, vec2 } from "../vec2";
import { randomColor, rgb } from "./draw";

export const BALL_RADIUS = 4;

const massFromRadius = (radius: number) => radius ** 2 * 1000000000;

const randomPointOnPlanetSurface = (center: Vec2, radius: number, ballRadius = BALL_RADIUS): Vec2 => {
  const angle = randomBetween(0, 2 * Math.PI);
  return center.add(vec2(Math.cos(angle), Math.sin(angle)).times(radius + ballRadius));
};

export const addPlanets = (count = 10): System<Components> => app => {
  for (let i = 0; i < count; i++) {
    const pos = vec2(randomInt(0, window.innerWidth), randomInt(0, window.innerHeight));
    const radius = randomInt(10, 60);

    const planet = app.addEntity([{
      type: 'body',
      position: pos,
      mass: massFromRadius(radius),
    }, {
      type: 'shape',
      kind: 'circle',
      color: randomColor(),
      radius,
    }, {
      type: 'attractor'
    }]);

    if (i === count - 1) {
      planet.add({
        type: 'target',
        target: randomPointOnPlanetSurface(pos, radius, 0)
      });
    }
  }
};

export const addBalls = (count = 1): System<Components> => app => {
  const planets = app.query('body', 'shape', 'attractor');

  for (let i = 0; i < count; i++) {
    const [{ position: planetPos }, { radius: planetRadius }] = randomElement(planets);

    app.addEntity([{
      type: 'body',
      position: randomPointOnPlanetSurface(planetPos, planetRadius),
      mass: massFromRadius(BALL_RADIUS),
    }, {
      type: 'movement',
      acceleration: vec2(0, 0),
      velocity: vec2(0, 0),
      prevPosition: vec2(Infinity, Infinity),
    }, {
      type: 'shape',
      kind: 'circle',
      radius: BALL_RADIUS,
      color: rgb(255, 255, 255),
    }]);
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

    if (!isNaN(v.x) && !isNaN(v.y)) {
      for (const [{ acceleration }, entity] of app.queryIter('movement')) {
        if (!app.hasComponent(entity, 'active')) {
          app.addComponent(entity, { type: 'active' });
        }

        acceleration.addMut(v);
      }
    }

    action.start.set(Infinity, Infinity);
    action.end.set(Infinity, Infinity);
  });
};