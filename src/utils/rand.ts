export const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (min - max);
};

export const randomInt = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const randomElement = <T>(elements: T[]) => {
  return elements[Math.floor(Math.random() * elements.length)];
}

export const gaussRandom = (mean: number, stdev: number) => {
  const x =
    Math.random() + Math.random() +
    Math.random() + Math.random() +
    Math.random();

  return ((x - 2.5) * 0.5 * stdev) + mean;
};
