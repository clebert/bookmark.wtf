import * as React from 'react';
import {Container, Styles, joinClassNames} from 'wtfkit';

export function ErrorPage(): JSX.Element {
  const styles = React.useContext(Styles.Context);

  return (
    <Container className={joinClassNames(styles.border({transparent: true}), styles.text())} col>
      Oops, an error occurred!
    </Container>
  );
}
