import {render} from 'preact';
import 'tailwindcss/tailwind.css';
import {App} from './components/app.js';
import {completeAuthorization} from './utils/complete-authorization.js';

completeAuthorization();

render(<App />, document.querySelector(`main#app`)!);
