import { Components } from './components';
import { createApp } from 'parsecs';
import { Resources } from './resources';
import { drawSystem } from './systems/draw';
import { physicsSystem } from './systems/physics';
import { addBalls, addPlanets, addInputs } from './systems/startup';
import { vec2 } from './vec2';

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

if (context === null) {
  throw `could not get canvas 2d context`;
}

const resources: Resources = {
  canvas,
  context,
  action: {
    start: vec2(Infinity, Infinity),
    end: vec2(Infinity, Infinity),
    maxLength: 150,
  }
};

createApp<Components, Resources>(resources)
  .addStartupSystem(addPlanets(10))
  .addStartupSystem(addBalls(1))
  .addStartupSystem(addInputs)
  .addSystem(physicsSystem)
  .addSystem(drawSystem)
  .run();

document.body.appendChild(canvas);
