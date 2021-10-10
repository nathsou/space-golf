import { Component, createComponent } from "../ecs";
import { Color } from "../systems/draw";

type Circle = Component<'shape', {
  shape: 'circle',
  radius: number,
  color: Color,
}>;

export type Shape = Circle;

export const withShape = (shape: Omit<Circle, '__type'>) =>
  createComponent('shape', shape);