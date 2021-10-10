import { Component, createComponent } from "../ecs";
import { vec2, Vec2 } from "../vec2";

export type Gravity = Component<'gravity', {
  velocity: Vec2,
  acceleration: Vec2,
  prevPosition: Vec2,
}>;

export const withGravity = (velocity: Vec2, acceleration: Vec2): Gravity => createComponent('gravity', {
  velocity,
  acceleration,
  prevPosition: vec2(Infinity, Infinity),
});