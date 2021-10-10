import { App, Component } from "../ecs";
import { Components } from "./components";

export type Mass = Component<'mass', {
  mass: number,
}>;

export const withMass = (mass: number): Mass => ({
  __type: 'mass',
  mass,
});

export const withShapeMass = (id: number, app: App<Components>): Mass => {
  const shape = app.getComponent(id, 'shape');
  if (shape === undefined) {
    return withMass(0);
  }

  switch (shape.shape) {
    case 'circle':
      return withMass(shape.radius ** 2 * 1000000000);
    default:
      return withMass(0);
  }
};