import { Components } from "../components";
import { combineSystems, System } from "parsecs";
import { Vec2 } from "../vec2";
import { TARGET_RADIUS } from './draw';
import { Resources } from "../resources";
import { memory } from "../memory";

const gravityForce = (
  planetPos: Vec2,
  planetMass: number,
  ballPos: Vec2,
  ballMass: number
): Vec2 => {
  const dir = memory.v1.copy(planetPos).subMut(ballPos);
  const len = 0.00001 * ((ballMass * planetMass) / dir.lengthSq());
  return dir.normalizeMut().timesMut(len);
};

export const gravitySystem: System<Components, Resources> = app => {
  const balls = app.queryIter('active', 'movement', 'body');
  const deltaT = app.resources.game.deltaT;

  for (const [_, { velocity, acceleration }, { position: ballPos, mass: ballMass }] of balls) {
    for (const [_, { position: planetPos, mass: planetMass }] of app.queryIter('attractor', 'body')) {
      const force = gravityForce(planetPos, planetMass, ballPos, ballMass);
      acceleration.addMut(force.divMut(ballMass));
    }

    velocity.addMut(memory.v1.copy(acceleration).timesMut(deltaT));
    ballPos.addMut(memory.v1.copy(velocity).timesMut(deltaT));
    acceleration.set(0, 0);
  }
};

export const collisionSystem: System<Components, Resources> = app => {
  const balls = app.queryIter('active', 'movement', 'body', 'shape');

  for (const [_, { velocity, prevPosition: prevBallPos }, { position: ballPos }, ballShape, ballEntity] of balls) {
    for (const [_, { position: planetPos }, planetShape, planetEntity] of app.queryIter('attractor', 'body', 'shape')) {
      const radiusSum = ballShape.radius + planetShape.radius;

      if (ballPos.distSq(planetPos) <= radiusSum ** 2) {
        const normal = memory.v1.copy(ballPos).subMut(planetPos).normalizeMut();
        const contactPoint = memory.v2.copy(planetPos).addMut(
          memory.v3.copy(normal).timesMut(radiusSum)
        );

        velocity.reflectMut(normal).timesMut(0.8);

        const target = app.getComponent(planetEntity, 'target');
        const isNearTarget = target && target.target.distSq(ballPos) <= TARGET_RADIUS ** 2;

        if (isNearTarget) {
          contactPoint.copy(target.target);
          app.resources.game.nextLevel();
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