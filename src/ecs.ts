
export type Entity = number;

export type Component<Name extends string, T extends object = {}> = T & { __type: Name, };

export const createComponent = <
  Name extends string,
  T extends object = {}
>(name: Name, props: T): Component<Name, T> => ({
  __type: name,
  ...props,
});

export type System<C extends Component<string>, R extends object = {}> = (app: App<C, R>) => void;

export const combineSystems = <
  C extends Component<string>,
  R extends object = {}
>(...systems: System<C, R>[]): System<C, R> => {
  return app => {
    systems.forEach(system => {
      system(app);
    });
  };
};

type MapComponentTypes<U, C> =
  U extends [infer H, ...infer TL] ?
  [C & { __type: H }, ...MapComponentTypes<TL, C>] :
  U extends [infer T] ? [C & { __type: T }, Entity] : [Entity];

export type ComponentArg<C extends Component<string>, R extends object = {}> = C | ((entity: Entity, app: App<C, R>) => C);

export class App<C extends Component<string>, R extends object = {}> {
  private entities: Set<Entity>;
  private components: Map<C['__type'], Map<Entity, Component<C['__type']>>>;
  private startupSystems: System<C, R>[];
  private systems: System<C, R>[];
  private nextId = 0;
  public resources: R;

  constructor(resources: R) {
    this.resources = resources;
    this.entities = new Set();
    this.components = new Map();
    this.startupSystems = [];
    this.systems = [];
  }

  public addEntity(...components: ComponentArg<C, R>[]): number {
    const id = this.nextId++;
    this.entities.add(id);

    for (const comp of components) {
      if (typeof comp === 'function') {
        this.addComponent(id, comp(id, this));
      } else {
        this.addComponent(id, comp);
      }
    }

    return id;
  }

  public addComponent(entity: Entity, component: C): App<C, R> {
    const type = component.__type;
    if (!this.components.has(type)) {
      this.components.set(type, new Map());
    }

    this.components.get(type)?.set(entity, component);

    return this;
  }

  public removeComponent(entity: Entity, componentType: C['__type']): App<C, R> {
    this.components.get(componentType)?.delete(entity);
    return this;
  }

  public removeEntity(entity: Entity): App<C> {
    for (const type of this.components.keys()) {
      this.components.get(type)?.delete(entity);
    }

    this.entities.delete(entity);
    return this;
  }

  public getComponent<K extends C['__type']>(id: Entity, type: K): C & { __type: K } | undefined {
    return this.components.get(type)?.get(id) as C & { __type: K };
  }

  public hasComponent<K extends C['__type']>(id: Entity, type: K): boolean {
    return this.components.get(type)?.has(id) ?? false;
  }

  public addSystem(system: System<C, R>): App<C, R> {
    this.systems.push(system);
    return this;
  }

  public addStartupSystem(system: System<C, R>): App<C, R> {
    this.startupSystems.push(system);
    return this;
  }

  public getEntities = () => this.entities[Symbol.iterator];

  public *query<
    H extends C['__type'],
    T extends C['__type'][]
  >(head: H, ...tail: T): IterableIterator<MapComponentTypes<[H, ...T], C>> {
    for (const entity of this.components.get(head)?.keys() ?? []) {
      if (tail.every(type => this.hasComponent(entity, type))) {
        const tuple = new Array(tail.length + 2);
        tuple[0] = this.getComponent(entity, head);

        tail.forEach((type, index) => {
          tuple[index + 1] = this.getComponent(entity, type);
        });

        tail.forEach(type => {
          tuple.push(this.getComponent(entity, type));
        });

        tuple[tail.length + 1] = entity;
        yield tuple as MapComponentTypes<[H, ...T], C>;
      }
    }
  }

  private step = () => {
    this.systems.forEach(system => {
      system(this);
    });

    requestAnimationFrame(this.step);
  };

  public run(): App<C, R> {
    this.startupSystems.forEach(system => {
      system(this);
    });

    this.step();
    return this;
  }
}

export const createApp = <C extends Component<string>, R extends object = {}>(resources: R) =>
  new App<C, R>(resources);