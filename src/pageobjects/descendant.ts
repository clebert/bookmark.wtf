import {Combinator, Combinators, query} from './query';

export function descendant<TCombinators extends Combinators>(
  selector: string,
  combinators: TCombinators
): Combinator {
  return (firstSelector) => query(firstSelector + ' ' + selector, combinators);
}
