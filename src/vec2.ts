
export class Vec2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public addMut({ x, y }: Vec2): Vec2 {
    this.x += x;
    this.y += y;
    return this;
  }

  public add({ x, y }: Vec2): Vec2 {
    return vec2(this.x + x, this.y + y);
  }

  public subMut({ x, y }: Vec2): Vec2 {
    this.x -= x;
    this.y -= y;
    return this;
  }

  public sub({ x, y }: Vec2): Vec2 {
    return vec2(this.x - x, this.y - y);
  }

  public timesMut(k: number): Vec2 {
    this.x *= k;
    this.y *= k;
    return this;
  }

  public times(k: number): Vec2 {
    return vec2(this.x * k, this.y * k);
  }

  public divMut(k: number): Vec2 {
    this.x /= k;
    this.y /= k;
    return this;
  }

  public div(k: number): Vec2 {
    return vec2(this.x / k, this.y / k);
  }

  public distSq({ x, y }: Vec2): number {
    return (x - this.x) ** 2 + (y - this.y) ** 2;
  }

  public dist(v: Vec2): number {
    return Math.sqrt(this.distSq(v));
  }

  public length(): number {
    return Math.sqrt(this.lengthSq());
  }

  public lengthSq(): number {
    return this.x ** 2 + this.y ** 2;
  }

  public normalize(): Vec2 {
    return this.div(this.length());
  }

  public normalizeMut(): Vec2 {
    this.divMut(this.length());
    return this;
  }

  public copy({ x, y }: Vec2): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }

  public set(x: number, y: number): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }

  public clone(): Vec2 {
    return vec2(this.x, this.y);
  }

  public dot({ x, y }: Vec2): number {
    return this.x * x + this.y * y;
  }

  public reflectMut(normal: Vec2): Vec2 {
    return this.subMut(normal.times(2 * this.dot(normal)));
  }

  public reflect(normal: Vec2): Vec2 {
    return this.sub(normal.times(2 * this.dot(normal)));
  }

  public limitMut(maxLength: number): Vec2 {
    if (this.lengthSq() > maxLength * maxLength) {
      return this.normalizeMut().timesMut(maxLength);
    }

    return this;
  }

  public limit(maxLength: number): Vec2 {
    if (this.lengthSq() > maxLength * maxLength) {
      return this.normalize().timesMut(maxLength);
    }

    return this.clone();
  }
}

export const vec2 = (x: number, y: number) => new Vec2(x, y);