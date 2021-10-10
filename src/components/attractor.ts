import { Component, createComponent } from "../ecs";

export type Attractor = Component<'attractor'>;

export const attractor: Attractor = createComponent('attractor', {});