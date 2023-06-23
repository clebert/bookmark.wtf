import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `colorScheme`,
  z.union([z.literal(`isSystem`), z.literal(`isLight`), z.literal(`isDark`)]),
);

export const colorSchemeMachine = createMachine({
  initialState: storageItem.value ?? `isSystem`,
  initialValue: undefined,
  transformerMap: {
    isSystem: () => undefined,
    isLight: () => undefined,
    isDark: () => undefined,
  },
  transitionsMap: {
    isSystem: {toggle: `isLight`},
    isLight: {toggle: `isDark`},
    isDark: {toggle: `isSystem`},
  },
});

colorSchemeMachine.subscribe(() => {
  const {state} = colorSchemeMachine.get();

  storageItem.value = state === `isSystem` ? undefined : state;
});
