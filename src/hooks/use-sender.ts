import {createSenderHook} from 'loxia';
import * as PreactHooks from 'preact/hooks';

export const useSender = createSenderHook(PreactHooks);
