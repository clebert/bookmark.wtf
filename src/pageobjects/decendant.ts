import {Decendant, Decendants, parent} from './parent';

export function decendant<TDecendants extends Decendants>(
  selector: string,
  decendants: TDecendants
): Decendant {
  return (parentSelector) =>
    parent(parentSelector + ' ' + selector, decendants);
}
