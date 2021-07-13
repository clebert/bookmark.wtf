import {useEffect, useState} from 'preact/hooks';
import {Topic} from './topic';

export class PreactTopic<TExtrinsicValue, TIntrinsicValue> extends Topic<
  TExtrinsicValue,
  TIntrinsicValue
> {
  use(): TExtrinsicValue {
    const [value, setValue] = useState(() => this.value);

    useEffect(() => this.subscribe(setValue), []);

    return value;
  }
}
