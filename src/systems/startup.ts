import { System } from "parsecs";
import { Components } from "../components";
import { Resources } from "../resources";
import { packCircles } from "../utils/circlePacking";
import { randomPalette } from "../utils/color";
import { randomBetween } from "../utils/rand";
import { Vec2, vec2 } from "../vec2";

export const BALL_RADIUS = 6;
export const MIN_DIST_BETWEEN_PLANETS = BALL_RADIUS * 4;

const massFromRadius = (radius: number) => radius ** 2 * 2700;

const randomPointOnPlanetSurface = (center: Vec2, radius: number, ballRadius = BALL_RADIUS): Vec2 => {
  const angle = randomBetween(0, 2 * Math.PI);
  return center.add(vec2(Math.cos(angle), Math.sin(angle)).times(radius + ballRadius));
};

export const addPlanets = (count = 10): System<Components> => app => {
  const nextColor = randomPalette();
  packCircles(
    count,
    40,
    90,
    window.innerWidth,
    window.innerHeight,
    'retry'
  ).forEach(({ center, radius }, i) => {
    const planet = app.addEntity([{
      type: 'body',
      position: center,
      mass: massFromRadius(radius),
    }, {
      type: 'shape',
      kind: 'circle',
      color: nextColor(),
      radius,
    }, {
      type: 'attractor'
    }]);

    if (i === count - 1) {
      planet.add({
        type: 'target',
        target: randomPointOnPlanetSurface(center, radius, 0)
      });
    }
  });
};

export const addBalls = (count = 1): System<Components> => app => {
  const planets = app.query('body', 'shape', 'attractor');

  const [
    { position: planetPos },
    { radius: planetRadius }
  ] = planets.find(([_b, _s, _q, entity]) =>
    !app.hasComponent(entity, 'target') || planets.length === 1
  ) as (typeof planets)[number];

  for (let i = 0; i < count; i++) {
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
      color: 'rgb(255, 255, 255)',
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
    const v = Vec2.v1
      .copy(action.start)
      .subMut(action.end)
      .timesMut(500)
      .limitMut(100000 * 0.6);

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

  window.addEventListener('keydown', event => {
    if (event.key === ' ') {
      app.resources.game.deltaT = 1 / 20;
    }
  });

  window.addEventListener('keyup', event => {
    if (event.key === ' ') {
      app.resources.game.deltaT = 1 / 60;
    }
  });
};