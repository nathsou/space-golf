import { Component, createComponent } from "../ecs";
import { Vec2 } from "../vec2";

export type Target = Component<'target', {
  target: Vec2,
}>;

export const withTarget = (target: Vec2): Target => createComponent('target', {
  target,
});