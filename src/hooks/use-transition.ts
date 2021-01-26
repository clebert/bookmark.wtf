import {createTransitionHook} from 'loxia';
import * as PreactHooks from 'preact/hooks';

export const useTransition = createTransitionHook(PreactHooks);
