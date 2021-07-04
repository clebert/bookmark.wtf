import {useEffect, useMemo, useState} from 'preact/hooks';

export class Broker {
  readonly #listenersByTopic = new Map<string, Set<(value: any) => void>>();

  use<TValue>(topic: string, getValue: () => TValue): TValue {
    const [value, setValue] = useState(getValue());

    useEffect(() => this.subscribe(topic, setValue), [topic]);

    return useMemo(() => getValue(), [topic, value]);
  }

  publish(topic: string, value: unknown): void {
    const listeners = this.#listenersByTopic.get(topic);

    if (listeners) {
      for (const listener of listeners) {
        listener(value);
      }
    }
  }

  subscribe(topic: string, listener: (value: any) => void): () => void {
    const listeners = this.#listenersByTopic.get(topic) ?? new Set();

    this.#listenersByTopic.set(topic, listeners);
    listeners.add(listener);

    return () => listeners.delete(listener);
  }
}
