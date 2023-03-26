import {Topic} from './topic.js';
import {useEffect, useState} from 'preact/hooks';

export class PreactTopic<TValue> extends Topic<TValue> {
  use(): TValue {
    const [value, setValue] = useState(() => this.value);

    useEffect(() => this.subscribe(setValue), []);

    return value;
  }
}
