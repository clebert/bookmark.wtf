import {Topic} from './topic.js';
import * as React from 'react';

export class ReactTopic<TValue> extends Topic<TValue> {
  use(): TValue {
    const [value, setValue] = React.useState(() => this.value);

    React.useEffect(() => this.subscribe(setValue), []);

    return value;
  }
}
