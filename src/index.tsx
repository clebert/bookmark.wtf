import {App} from './components/app.js';
import {completeAuthorization} from './utils/complete-authorization.js';
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import 'tailwindcss/tailwind.css';

completeAuthorization();

createRoot(document.querySelector(`main#app`)!).render(<App />);
