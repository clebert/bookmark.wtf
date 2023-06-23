import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `uiMode`,
  z.literal(`isShowingControls`).or(z.literal(`isHidingControls`)),
);

export const uiModeMachine = createMachine({
  initialState: storageItem.value ?? `isShowingControls`,
  initialValue: undefined,
  transformerMap: {
    isShowingControls: () => undefined,
    isHidingControls: () => undefined,
  },
  transitionsMap: {
    isShowingControls: {toggle: `isHidingControls`},
    isHidingControls: {toggle: `isShowingControls`},
  },
});

uiModeMachine.subscribe(() => {
  const {state} = uiModeMachine.get();

  storageItem.value = state === `isShowingControls` ? undefined : state;
});
