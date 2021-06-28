import {useCallback, useState} from 'preact/hooks';

export function useToggle(initialValue: boolean): [boolean, () => void] {
  const [toggle, setToggle] = useState(initialValue);

  return [
    toggle,
    useCallback(() => setToggle((prevToggle) => !prevToggle), []),
  ];
}
