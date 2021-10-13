import { Components } from "../components";
import { combineSystems, System } from "parsecs";
import { Vec2 } from "../vec2";
import { TARGET_RADIUS } from './draw';

const gravityForce = (
  planetPos: Vec2,
  planetMass: number,
  ballPos: Vec2,
  ballMass: number
): Vec2 => {
  const dir = planetPos.sub(ballPos);
  const len = 0.00001 * ((ballMass * planetMass) / dir.lengthSq());
  return dir.normalizeMut().timesMut(len);
};

const deltaT = 1 / 60;

export const gravitySystem: System<Components> = app => {
  const balls = app.queryIter('active', 'movement', 'body');
  const planets = app.query('attractor', 'body');

  for (const [_, { velocity, acceleration }, { position: ballPos, mass: ballMass }] of balls) {
    for (const [_, { position: planetPos, mass: planetMass }] of planets) {
      const force = gravityForce(planetPos, planetMass, ballPos, ballMass);
      acceleration.addMut(force.div(ballMass));
    }

    velocity.addMut(acceleration.times(deltaT));
    ballPos.addMut(velocity.times(deltaT));
    acceleration.set(0, 0);
  }
};

export const collisionSystem: System<Components> = app => {
  const balls = app.queryIter('active', 'movement', 'body', 'shape');
  const planets = app.query('attractor', 'body', 'shape');

  for (const [_, { velocity, prevPosition: prevBallPos }, { position: ballPos }, ballShape, ballEntity] of balls) {
    for (const [_, { position: planetPos }, planetShape, planetEntity] of planets) {
      const radiusSum = ballShape.radius + planetShape.radius;

      if (ballPos.distSq(planetPos) <= radiusSum ** 2) {
        const normal = ballPos.sub(planetPos).normalize();
        const contactPoint = planetPos.add(normal.times(radiusSum));
        velocity.reflectMut(normal).timesMut(0.8);

        const target = app.getComponent(planetEntity, 'target');
        const isNearTarget = target && target.target.distSq(ballPos) <= TARGET_RADIUS ** 2;

        if (isNearTarget) {
          contactPoint.copy(target.target);
        }

        ballPos.copy(contactPoint);

        if (prevBallPos.distSq(ballPos) < 0.3) {
          app.removeComponent(ballEntity, 'active');
        }
        break;
      }
    }
  }
};

export const physicsSystem = combineSystems(gravitySystem, collisionSystem);