import {useEffect, useMemo, useState} from 'preact/hooks';

export interface BrokerOptions {
  readonly topic?: Topic;
}

export type Topic = string | symbol;

const defaultTopic: Topic = Symbol('default topic');

export class Broker {
  readonly #listenersByTopic = new Map<Topic, Set<(value: any) => void>>();

  use<TValue>(
    getValue: () => TValue,
    {topic = defaultTopic}: BrokerOptions = {}
  ): TValue {
    const [value, setValue] = useState(getValue());

    useEffect(() => this.subscribe(setValue, {topic}), [topic]);

    return useMemo(() => getValue(), [topic, value]);
  }

  publish(value: unknown, {topic = defaultTopic}: BrokerOptions = {}): void {
    const listeners = this.#listenersByTopic.get(topic);

    if (listeners) {
      for (const listener of listeners) {
        listener(value);
      }
    }
  }

  subscribe(
    listener: (value: any) => void,
    {topic = defaultTopic}: BrokerOptions = {}
  ): () => void {
    const listeners = this.#listenersByTopic.get(topic) ?? new Set();

    this.#listenersByTopic.set(topic, listeners);
    listeners.add(listener);

    return () => listeners.delete(listener);
  }
}
