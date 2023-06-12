import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `uiMode`,
  z.literal(`isShowingControls`).or(z.literal(`isHidingControls`)),
);

export const uiMode = createStateMachine({
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

uiMode.subscribe(() => {
  const {state} = uiMode.get();

  storageItem.value = state === `isShowingControls` ? undefined : state;
});
