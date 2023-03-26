import type {JSX} from 'preact';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import {useCallback} from 'preact/hooks';

const titles = {auto: `System theme`, light: `Day theme`, dark: `Night theme`};
const iconTypes = {auto: `cog`, light: `sun`, dark: `moon`} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorScheme = AppTopics.colorScheme.use();

  const toggleColorScheme = useCallback(() => {
    if (colorScheme === `auto`) {
      AppTopics.colorScheme.publish(`dark`);
    } else if (colorScheme === `dark`) {
      AppTopics.colorScheme.publish(`light`);
    } else {
      AppTopics.colorScheme.publish(`auto`);
    }
  }, [colorScheme]);

  return (
    <Button
      class="ColorSchemeButton"
      title={titles[colorScheme]}
      onClick={toggleColorScheme}
    >
      <Icon type={iconTypes[colorScheme]} standalone />
    </Button>
  );
}
