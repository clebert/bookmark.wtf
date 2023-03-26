import {App} from './components/app.js';
import {completeAuthorization} from './utils/complete-authorization.js';
import {render} from 'preact';
import 'tailwindcss/tailwind.css';

completeAuthorization();

render(<App />, document.querySelector(`main#app`)!);
