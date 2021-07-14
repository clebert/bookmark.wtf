export type Container<TValue> = {value: TValue};
export type Listener<TValue> = (value: TValue) => void;

export class Topic<TValue> {
  readonly #listeners = new Set<Listener<TValue>>();
  readonly #container: Container<TValue>;

  constructor(container: Container<TValue>) {
    this.#container = container;
    this.publish = this.publish.bind(this);
    this.republish = this.republish.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  get value(): TValue {
    return this.#container.value;
  }

  publish(newValue: TValue): void {
    this.#container.value = newValue;

    const {value} = this;

    for (const listener of this.#listeners) {
      listener(value);
    }
  }

  republish(): void {
    this.publish(this.value);
  }

  subscribe(listener: Listener<TValue>): () => void {
    this.#listeners.add(listener);

    return () => this.#listeners.delete(listener);
  }
}
