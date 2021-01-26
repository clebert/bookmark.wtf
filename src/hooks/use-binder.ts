import {createBinderHook} from 'loxia';
import * as PreactHooks from 'preact/hooks';

export const useBinder = createBinderHook(PreactHooks);
