import { randomInt } from "./rand";

export type Color = { r: number, g: number, b: number };
export const rgb = (r: number, g: number, b: number): Color => ({ r, g, b });
export const randomColor = () => rgb(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
export const formatColor = ({ r, g, b }: Color) => `rgb(${r}, ${g}, ${b})`;
