export interface LiveCollection<T> {
  [Symbol.iterator](): Iterator<T>;

  addEventListener(name: 'change', listener: () => void): void;
}
