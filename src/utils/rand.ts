
export const randomBetween = (min: number, max: number): number => {
  return min + Math.random() * (min - max);
};

export const randomInt = (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const randomElement = <T>(elements: T[]): T => {
  return elements[Math.floor(Math.random() * elements.length)];
}

export const gaussRandom = (mean: number, stdev: number): number => {
  const x =
    Math.random() + Math.random() +
    Math.random() + Math.random() +
    Math.random();

  return ((x - 2.5) * 0.5 * stdev) + mean;
};

export const shuffleMut = <T>(elems: T[]): void => {
  for (let i = elems.length - 1; i >= 1; i--) {
    const j = randomInt(0, i);
    [elems[j], elems[i]] = [elems[i], elems[j]];
  }
};