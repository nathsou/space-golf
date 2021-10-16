import { BALL_RADIUS, MIN_DIST_BETWEEN_PLANETS } from "./systems/startup";
import { vec2, Vec2 } from "./vec2";

export const randomBetween = (min: number, max: number) => min + Math.random() * (min - max);

export const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export const randomElement = <T>(elements: T[]) => elements[Math.floor(Math.random() * elements.length)];

export const gaussRandom = (stdev: number, mean: number) => {
  const x = Math.random() + Math.random() + Math.random() + Math.random() + Math.random();
  return ((x - 2.5) * 0.5 * stdev) + mean;
};

export type Color = { r: number, g: number, b: number };
export const rgb = (r: number, g: number, b: number): Color => ({ r, g, b });
export const randomColor = () => rgb(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
export const formatColor = ({ r, g, b }: Color) => `rgb(${r}, ${g}, ${b})`;

type Circle = {
  center: Vec2,
  radius: number,
};

const circlesTooClose = (a: Circle, b: Circle) => {
  return a.center.distSq(b.center) <= (a.radius + b.radius + MIN_DIST_BETWEEN_PLANETS) ** 2;
};

type CirclePackingStrategy = 'retry' | 'shrink' | 'exact';

const randomCircle = (
  minRadius: number,
  maxRadius: number,
  width: number,
  height: number,
): Circle => {
  return {
    center: vec2(randomInt(0, width), randomInt(0, height)),
    radius: randomInt(minRadius, maxRadius),
  };
};

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
      const c = randomCircle(minRadius, maxRadius, width, height);

      if (circles.some(c2 => circlesTooClose(c, c2))) {
        return strategies.retry();
      }

      return c;
    },
    shrink: (): Circle => {
      const c = randomCircle(minRadius, maxRadius, width, height);

      while (circles.some(c2 => circlesTooClose(c, c2)) && c.radius >= minRadius) {
        c.radius -= 1;
      }

      if (c.radius < minRadius) {
        return strategies.shrink();
      }

      return c;
    },
    exact: (): Circle => {
      const center = vec2(randomInt(0, width), randomInt(0, height));
      const radius = Math.min(
        randomInt(minRadius, maxRadius),
        ...circles.map(c2 => c2.center.dist(center) - c2.radius)
      );

      if (radius < minRadius + MIN_DIST_BETWEEN_PLANETS) {
        return strategies.exact();
      }

      return { center, radius };
    }
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