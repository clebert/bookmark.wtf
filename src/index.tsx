import 'tailwindcss/tailwind.css';

import {render} from 'preact';
import {App} from './components/app';
import {completeAuthorization} from './utils/complete-authorization';

completeAuthorization();

render(<App />, document.querySelector('main#app')!);
