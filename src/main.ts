import { Components } from './components';
import { App, combineSystems, createApp } from 'parsecs';
import { Resources } from './resources';
import { drawSystem } from './systems/draw';
import { physicsSystem } from './systems/physics';
import { addBalls, addPlanets, addInputs } from './systems/startup';
import { Vec2, vec2 } from './vec2';
import { gaussRandom } from './utils';
import { cameraSystem } from './systems/camera';

type Camera = {
  offset: Vec2,
  targetOffset: Vec2,
};

export class Game {
  public app: App<Components, Resources>;
  public canvas: HTMLCanvasElement;
  public camera: Camera;

  constructor() {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    if (context === null) {
      throw `could not get canvas 2d context`;
    }

    this.camera = {
      offset: vec2(0, 0),
      targetOffset: vec2(0, 0),
    };

    this.app = createApp<Components, Resources>({
      canvas,
      context,
      action: {
        start: vec2(Infinity, Infinity),
        end: vec2(Infinity, Infinity),
        maxLength: 150,
      },
      game: this,
    })
      .addStartupSystem(addInputs)
      .addSystem(physicsSystem)
      .addSystem(drawSystem)
      .addSystem(cameraSystem)

    this.nextLevel(true);
  }

  public nextLevel(immediate = false) {
    const initLevel = combineSystems(
      addPlanets(Math.round(gaussRandom(2, 4))),
      addBalls(1),
    );

    this.app.removeSystem(physicsSystem);

    setTimeout(() => {
      for (const entity of this.app.getEntities()) {
        this.app.removeEntity(entity);
      }

      initLevel(this.app);
      this.app.addSystem(physicsSystem);
    }, immediate ? 0 : 1000);
  }

  public run() {
    this.app.run();
  }
}

const game = new Game();
game.run();

document.body.appendChild(game.canvas);
