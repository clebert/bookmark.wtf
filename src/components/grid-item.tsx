import {Label} from './label.js';
import * as React from 'react';
import {Container, Styles, joinClassNames} from 'wtfkit';

export interface GridItemProps {
  className?: string;
  leftCol?: React.ReactNode;
  row1: React.ReactNode;
  row2?: React.ReactNode;
  rightCol?: React.ReactNode;
}

export function GridItem({className, leftCol, row1, row2, rightCol}: GridItemProps): JSX.Element {
  const styles = React.useContext(Styles.Context);

  return (
    <Container
      className={joinClassNames(className, `p-2 shadow`, styles.background({shaded: true}))}
      center
    >
      {leftCol && <Container col>{leftCol}</Container>}

      <Container col grow>
        <Container grow>{row1}</Container>
        <Container grow>{row2 || <Label static>{`\u00A0`}</Label>}</Container>
      </Container>

      {rightCol && <Container col>{rightCol}</Container>}
    </Container>
  );
}
