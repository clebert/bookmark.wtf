import {createMachine} from 'state-guard';
import {createJsonStorageItem} from 'wtfkit';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `sortOrder`,
  z.union([z.literal(`isClickCount`), z.literal(`isTimeAsc`), z.literal(`isTimeDesc`)]),
);

export const sortOrderMachine = createMachine({
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

sortOrderMachine.subscribe(() => {
  const {state} = sortOrderMachine.get();

  storageItem.value = state === `isClickCount` ? undefined : state;
});
