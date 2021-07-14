import {useEffect, useState} from 'preact/hooks';
import {Topic} from './topic';

export class PreactTopic<TValue> extends Topic<TValue> {
  use(): TValue {
    const [value, setValue] = useState(() => this.value);

    useEffect(() => this.subscribe(setValue), []);

    return value;
  }
}
