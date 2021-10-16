import { Circle } from "./utils/circlePacking";
import { gaussRandom, randomInt } from "./utils/rand";
import { vec2, Vec2 } from "./vec2";

export type StarTile = {
  stars: Circle[],
  position: Vec2,
};

type TilePos = `${number}:${number}`;

export class StarMap {
  public static TILE_SIZE = 512;
  private tiles: Map<TilePos, StarTile>;

  constructor() {
    this.tiles = new Map();
  }

  private createTile(position: Vec2): StarTile {
    const stars: Circle[] = [];
    const count = gaussRandom(10, 4);
    for (let i = 0; i < count; i++) {
      stars.push({
        center: vec2(
          randomInt(0, StarMap.TILE_SIZE),
          randomInt(0, StarMap.TILE_SIZE)
        ).addMut(position),
        radius: Math.floor(gaussRandom(3, 1)),
      });
    }

    return { stars, position };
  }

  public tileAt(x: number, y: number): StarTile {
    const key: TilePos = `${x}:${y}`;
    if (this.tiles.has(key)) {
      return this.tiles.get(key) as StarTile;
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