import {render} from 'preact';
import 'tailwindcss/tailwind.css';
import {App} from './components/app';
import {completeAuthorization} from './utils/complete-authorization';

completeAuthorization();

render(<App />, document.querySelector(`main#app`)!);
