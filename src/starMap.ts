import { Circle } from "./utils/circlePacking";
import { gaussRandom, randomInt } from "./utils/rand";
import { vec2, Vec2 } from "./utils/vec2";

export type StarTile = {
  stars: Circle[],
  position: Vec2,
  lastUsed: number,
  static: boolean,
};

type TilePos = `${number}:${number}`;

export class StarMap {
  public static TILE_SIZE = 1024;
  private tiles: Map<TilePos, StarTile>;
  private static MAX_CACHE_SIZE = 200;
  private static UNUSED_THRESHOLD = 10 * 1000;

  constructor() {
    this.tiles = new Map();
  }

  public setStaticRegion(topLeft: Vec2, width: number, height: number): void {
    for (const tile of this.visibleTiles(topLeft, width, height)) {
      tile.static = true;
    }
  }

  private removeUnused(): void {
    const now = Date.now();
    const adjustedThreshold = StarMap.UNUSED_THRESHOLD * Math.exp(-(this.tiles.size - StarMap.MAX_CACHE_SIZE) / 90);
    for (const [pos, tile] of this.tiles.entries()) {
      if (!tile.static && now - tile.lastUsed > adjustedThreshold) {
        this.tiles.delete(pos);
      }
    }
  }

  private createTile(position: Vec2, isStatic = false): StarTile {
    if (this.tiles.size >= StarMap.MAX_CACHE_SIZE) {
      this.removeUnused();
    }

    const stars: Circle[] = [];
    const count = gaussRandom(20, 10);
    for (let i = 0; i < count; i++) {
      stars.push({
        center: vec2(
          randomInt(0, StarMap.TILE_SIZE),
          randomInt(0, StarMap.TILE_SIZE)
        ).addMut(position),
        radius: Math.floor(gaussRandom(3, 1)),
      });
    }

    return {
      stars,
      position,
      lastUsed: Date.now(),
      static: isStatic
    };
  }

  public tileAt(x: number, y: number): StarTile {
    const key: TilePos = `${x}:${y}`;
    if (this.tiles.has(key)) {
      const tile = this.tiles.get(key) as StarTile;
      tile.lastUsed = Date.now();
      return tile;
    }

    const tile = this.createTile(vec2(
      x * StarMap.TILE_SIZE,
      y * StarMap.TILE_SIZE
    ));

    this.tiles.set(key, tile);
    return tile;
  }

  public *visibleTiles(topLeft: Vec2, width: number, height: number): IterableIterator<StarTile> {
    for (let x = topLeft.x - StarMap.TILE_SIZE; x <= topLeft.x + width; x += StarMap.TILE_SIZE) {
      for (let y = topLeft.y - StarMap.TILE_SIZE; y <= topLeft.y + height; y += StarMap.TILE_SIZE) {
        yield this.tileAt(
          Math.floor(x / StarMap.TILE_SIZE),
          Math.floor(y / StarMap.TILE_SIZE)
        );
      }
    }
  }

  public clear(): void {
    this.tiles.clear();
  }
}