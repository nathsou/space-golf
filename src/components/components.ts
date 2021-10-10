import { Active } from "./active";
import { Attractor } from "./attractor";
import { Gravity } from "./gravity";
import { Mass } from "./mass";
import { Position } from "./position";
import { Shape } from "./shape";
import { Target } from "./target";

export type Components = Position | Shape | Gravity | Mass | Attractor | Active | Target;