export type Container<TValue> = {value: TValue};
export type Listener<TValue> = (value: TValue) => void;
export type Transformer<TValueA, TValueB> = (value: TValueA) => TValueB;

export class Topic<TExtrinsicValue, TIntrinsicValue> {
  readonly #listeners = new Set<Listener<TExtrinsicValue>>();

  constructor(
    readonly container: Container<TIntrinsicValue>,
    readonly inputTransformer: Transformer<TExtrinsicValue, TIntrinsicValue>,
    readonly outputTransformer: Transformer<TIntrinsicValue, TExtrinsicValue>
  ) {
    this.publish = this.publish.bind(this);
    this.republish = this.republish.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  get value(): TExtrinsicValue {
    return this.outputTransformer(this.container.value);
  }

  publish(newValue: TExtrinsicValue): void {
    this.container.value = this.inputTransformer(newValue);

    const {value} = this;

    for (const listener of this.#listeners) {
      listener(value);
    }
  }

  republish(): void {
    this.publish(this.value);
  }

  subscribe(listener: Listener<TExtrinsicValue>): () => void {
    this.#listeners.add(listener);

    return () => this.#listeners.delete(listener);
  }
}
