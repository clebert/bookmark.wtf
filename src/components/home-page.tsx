import {Link} from './link.js';
import * as React from 'react';
import {Container, Icon, Styles, joinClassNames, useDarkMode} from 'wtfkit';

export function HomePage(): JSX.Element {
  const styles = React.useContext(Styles.Context);
  const darkMode = useDarkMode();

  return (
    <Container className={joinClassNames(styles.border({transparent: true}), styles.text())} col>
      <span>
        A free and open-source bookmark manager that uses GitHub Gist as database.{` `}
        <Link url="https://github.com/clebert/bookmark.wtf/blob/main/README.md" static>
          <Icon type="arrowTopRightOnSquare" />
          README
        </Link>
      </span>

      <div className="max-w-5xl shadow-xl">
        <img
          className="select-none"
          src={`https://raw.githubusercontent.com/clebert/bookmark.wtf/main/screenshot-${
            darkMode ? `dark` : `light`
          }-mode.png`}
        ></img>
      </div>
    </Container>
  );
}
