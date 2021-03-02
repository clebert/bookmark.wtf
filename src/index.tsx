import 'tailwindcss/tailwind.css';

import {h, render} from 'preact';
import {App} from './components/app';

render(<App />, document.querySelector('main#app')!);
