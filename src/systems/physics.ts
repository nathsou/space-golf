import { combineSystems, System } from "parsecs";
import { Components } from "../components";
import { Resources } from "../resources";
import { Vec2 } from "../vec2";
import { TARGET_RADIUS } from './draw';

const G = 2.4;
const FRICTION_K = 0.02;

export const gravitySystem: System<Components, Resources> = app => {
  const balls = app.queryIter('active', 'movement', 'body');
  const deltaT = app.resources.game.deltaT;

  for (const [_, { velocity, acceleration }, { position: ballPos, mass: ballMass }] of balls) {
    for (const [_, { position: planetPos, mass: planetMass }] of app.queryIter('attractor', 'body')) {
      const forceDir = Vec2.v1.copy(planetPos).subMut(ballPos);
      const forceLen = G * app.resources.screenSizeFactor * ((ballMass * planetMass) / forceDir.lengthSq());
      const force = forceDir.normalizeMut().timesMut(forceLen);
      acceleration.addMut(force.divMut(ballMass));
    }

    velocity.addMut(Vec2.v1.copy(acceleration).timesMut(deltaT));
    ballPos.addMut(Vec2.v1.copy(velocity).timesMut(deltaT));
    acceleration.set(0, 0);
  }
};

export const collisionSystem: System<Components, Resources> = app => {
  const balls = app.queryIter('active', 'movement', 'body', 'shape');

  for (const [_, { velocity, prevPosition: prevBallPos }, { position: ballPos }, ballShape, ballEntity] of balls) {
    for (const [_, { position: planetPos }, planetShape, planetEntity] of app.queryIter('attractor', 'body', 'shape')) {
      const radiusSum = ballShape.radius + planetShape.radius;

      if (ballPos.distSq(planetPos) <= radiusSum ** 2) {
        const normal = Vec2.v1.copy(ballPos).subMut(planetPos).normalizeMut();
        const contactPoint = Vec2.v2.copy(planetPos).addMut(
          Vec2.v3.copy(normal).timesMut(radiusSum)
        );

        // friction
        velocity.subMut(Vec2.v3.copy(velocity).timesMut(FRICTION_K));

        // repulsion
        velocity.reflectMut(normal).timesMut(0.76);

        const target = app.getComponent(planetEntity, 'target');
        const isNearTarget = target && target.target.distSq(ballPos) <= TARGET_RADIUS ** 2;

        if (isNearTarget) {
          contactPoint.copy(target.target);
          app.removeComponent(ballEntity, 'active');
          app.resources.game.nextLevel();
        }

        ballPos.copy(contactPoint);

        if (prevBallPos.distSq(ballPos) < 0.3) {
          app.removeComponent(ballEntity, 'active');
        }

        prevBallPos.copy(ballPos);
        break;
      }
    }
  }
};

export const physicsSystem = combineSystems(gravitySystem, collisionSystem);