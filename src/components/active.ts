import { Component, createComponent } from "../ecs";

export type Active = Component<'active'>;

export const active: Active = createComponent('active', {});