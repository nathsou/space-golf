import { System } from "parsecs";
import { Components } from "../components";
import { memory } from "../memory";
import { Resources } from "../resources";

const OFFSET_MARGIN = 100;

export const cameraSystem: System<Components, Resources> = app => {
  const camera = app.resources.game.camera;
  const balls = app.query('movement', 'body');

  if (balls.length === 1) {
    const [_, { position }] = balls[0];
    const { canvas } = app.resources;
    const offset = memory.v1.set(0, 0);

    if (position.x < 0) {
      offset.x = -position.x;
    }

    if (position.x > canvas.width) {
      offset.x = -(position.x - canvas.width);
    }

    if (position.y < 0) {
      offset.y = -position.y;
    }

    if (position.y > canvas.height) {
      offset.y = -(position.y - canvas.height);
    }

    if (offset.x !== 0 || offset.y !== 0) {
      offset.addMut(
        memory.v2.set(canvas.width / 2, canvas.height / 2)
          .subMut(position)
          .normalizeMut()
          .timesMut(OFFSET_MARGIN)
      );
    }

    camera.targetOffset.copy(offset);
    camera.offset.addMut(
      memory.v3
        .copy(camera.targetOffset)
        .subMut(camera.offset)
        .timesMut(0.06)
    );
  }
};