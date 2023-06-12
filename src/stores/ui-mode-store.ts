import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `uiMode`,
  z.literal(`showControls`).or(z.literal(`hideControls`)),
);

export const uiModeStore = createStateMachine({
  initialState: storageItem.value ?? `showControls`,
  initialValue: undefined,
  transformerMap: {
    showControls: () => undefined,
    hideControls: () => undefined,
  },
  transitionsMap: {
    showControls: {toggle: `hideControls`},
    hideControls: {toggle: `showControls`},
  },
});

uiModeStore.subscribe(() => {
  const {state} = uiModeStore.get();

  storageItem.value = state === `showControls` ? undefined : state;
});
