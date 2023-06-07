import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppTopics} from '../pub-sub/app-topics.js';
import * as React from 'react';

const titles = {auto: `System Theme`, light: `Day Theme`, dark: `Night Theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorScheme = AppTopics.colorScheme.use();

  const toggleColorScheme = React.useCallback(() => {
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
      className="ColorSchemeButton border-dashed"
      title={titles[colorScheme]}
      onClick={toggleColorScheme}
    >
      <Icon type={iconTypes[colorScheme]} standalone />
    </Button>
  );
}
