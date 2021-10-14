import { Components } from './components';
import { App, combineSystems, createApp } from 'parsecs';
import { Resources } from './resources';
import { drawSystem } from './systems/draw';
import { physicsSystem } from './systems/physics';
import { addBalls, addPlanets, addInputs } from './systems/startup';
import { vec2 } from './vec2';
import { randomInt } from './utils';

export class Game {
  public app: App<Components, Resources>;
  public canvas: HTMLCanvasElement;

  constructor() {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    if (context === null) {
      throw `could not get canvas 2d context`;
    }

    this.app = createApp<Components, Resources>({
      canvas,
      context,
      action: {
        start: vec2(Infinity, Infinity),
        end: vec2(Infinity, Infinity),
        maxLength: 150,
      },
      camera: {
        offset: vec2(0, 0),
      },
      game: this,
    })
      .addStartupSystem(addInputs)
      .addSystem(physicsSystem)
      .addSystem(drawSystem);
  }

  public nextLevel(immediate = false) {
    const initLevel = combineSystems(
      addPlanets(randomInt(2, 10)),
      addBalls(1),
    );

    this.app.removeSystem(physicsSystem);

    setTimeout(() => {
      this.app.query('body').forEach(([_, entity]) => {
        this.app.removeEntity(entity);
      });

      initLevel(this.app);
      this.app.addSystem(physicsSystem);
    }, immediate ? 0 : 1000);
  }

  public run() {
    this.app.run();
  }
}

const game = new Game();

game.nextLevel(true);
game.run();

document.body.appendChild(game.canvas);
