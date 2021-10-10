
export const randomBetween = (min: number, max: number) => min + Math.random() * (min - max);

export const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export const randomElement = <T>(elements: T[]) => elements[Math.floor(Math.random() * elements.length)];