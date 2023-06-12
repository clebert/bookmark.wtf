import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `sortOrder`,
  z.union([z.literal(`isClickCount`), z.literal(`isTimeAsc`), z.literal(`isTimeDesc`)]),
);

export const sortOrder = createStateMachine({
  initialState: storageItem.value ?? `isClickCount`,
  initialValue: undefined,
  transformerMap: {
    isClickCount: () => undefined,
    isTimeAsc: () => undefined,
    isTimeDesc: () => undefined,
  },
  transitionsMap: {
    isClickCount: {toggle: `isTimeAsc`},
    isTimeAsc: {toggle: `isTimeDesc`},
    isTimeDesc: {toggle: `isClickCount`},
  },
});

sortOrder.subscribe(() => {
  const {state} = sortOrder.get();

  storageItem.value = state === `isClickCount` ? undefined : state;
});
