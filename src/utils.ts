import { BALL_RADIUS } from "./systems/startup";
import { vec2, Vec2 } from "./vec2";

export const randomBetween = (min: number, max: number) => min + Math.random() * (min - max);

export const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export const randomElement = <T>(elements: T[]) => elements[Math.floor(Math.random() * elements.length)];

type Circle = {
  center: Vec2,
  radius: number,
};

const circlesTooClose = (a: Circle, b: Circle, minDist = BALL_RADIUS * 2) => {
  return a.center.distSq(b.center) <= (a.radius + b.radius + minDist) ** 2;
};

type CirclePackingStrategy = 'retry' | 'shrink';

const packCircle = (
  circles: Circle[],
  minRadius: number,
  maxRadius: number,
  width: number,
  height: number,
  strategy: CirclePackingStrategy
) => {
  const strategies = {
    retry: (): Circle => {
      const c: Circle = {
        center: vec2(randomInt(0, width), randomInt(0, height)),
        radius: randomInt(minRadius, maxRadius),
      };

      if (circles.some(c2 => circlesTooClose(c, c2))) {
        return strategies.retry();
      }

      return c;
    },
    shrink: (): Circle => {
      const c: Circle = {
        center: vec2(randomInt(0, width), randomInt(0, height)),
        radius: randomInt(minRadius, maxRadius),
      };

      while (circles.some(c2 => circlesTooClose(c, c2)) && c.radius >= minRadius) {
        c.radius -= 1;
      }

      if (c.radius < minRadius) {
        return strategies.shrink();
      }

      return c;
    },
  };

  return strategies[strategy]();
};

export const packCircles = (
  count: number,
  minRadius: number,
  maxRadius: number,
  width: number,
  height: number,
  strategy: CirclePackingStrategy
): Circle[] => {
  const circles: Circle[] = [];

  for (let i = 0; i < count; i++) {
    circles.push(packCircle(
      circles,
      minRadius,
      maxRadius,
      width,
      height,
      strategy
    ));
  }

  return circles;
};