import { Components } from './components';
import { App, combineSystems, createApp } from 'parsecs';
import { Resources } from './resources';
import { drawSystem } from './systems/draw';
import { physicsSystem } from './systems/physics';
import { addBalls, addPlanets, addInputs } from './systems/startup';
import { Vec2, vec2 } from './vec2';
import { gaussRandom } from './utils/rand';
import { cameraSystem } from './systems/camera';
import { StarMap } from './starMap';

type Camera = {
  offset: Vec2,
  targetOffset: Vec2,
};

export class Game {
  public app: App<Components, Resources>;
  public canvas: HTMLCanvasElement;
  public camera: Camera;
  public deltaT = 1 / 60;

  constructor() {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    const dpr = window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    if (context === null) {
      throw `could not get canvas 2d context`;
    }

    context.scale(dpr, dpr);

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
        maxLength: 180,
      },
      game: this,
      stars: new StarMap(),
      // screenSizeFactor: window.innerWidth / 1000,
      screenSizeFactor: 1,
    })
      .addStartupSystem(addInputs)
      .addSystem(physicsSystem)
      .addSystem(drawSystem)
      .addSystem(cameraSystem);

    this.nextLevel(true);
  }

  public nextLevel(immediate = false) {
    const initLevel = combineSystems(
      addPlanets(Math.round(gaussRandom(4, 2))),
      addBalls(1),
    );

    setTimeout(() => {
      this.app.clearEntities();
      this.app.resources.stars.clear();
      this.app.resources.stars.setStaticRegion(
        Vec2.v1.set(0, 0),
        this.canvas.width,
        this.canvas.height
      );

      initLevel(this.app);
    }, immediate ? 0 : 1000);
  }

  public run() {
    this.app.run();
  }
}

const game = new Game();
game.run();

document.body.appendChild(game.canvas);

/// @ts-ignore
window['game'] = game;