import {createReceiverHook} from 'loxia';
import * as PreactHooks from 'preact/hooks';

export const useReceiver = createReceiverHook(PreactHooks);
