import 'tailwindcss/tailwind.css';

import {render} from 'preact';
import {App} from './components/app';

render(<App />, document.querySelector('main#app')!);
