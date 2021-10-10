import { Component, createComponent } from "../ecs";
import { Vec2 } from "../vec2";

export type Position = Component<'position', {
  position: Vec2,
}>;

export const withPosition = (position: Vec2): Position => createComponent('position', {
  position,
});