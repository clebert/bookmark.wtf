export type Query<TDecendants extends Decendants> = (
  pseudoClass?: PseudoClass
) => VirtualNode<TDecendants>;

export interface Decendants {
  readonly [key: string]: Decendant;
}

export type Decendant = (parentSelector: string) => Query<any>;
export type PseudoClass = (selector: string) => string;

export type VirtualNode<TDecendants extends Decendants> = {
  readonly $: string;

  readonly $$: {
    readonly [TKey in keyof TDecendants]: ReturnType<TDecendants[TKey]>;
  };
};

export function parent<TDecendants extends Decendants>(
  selector: string,
  decendants: TDecendants
): Query<TDecendants> {
  return (pseudoClass) => {
    const $ = pseudoClass?.(selector) ?? selector;

    const $$ = Object.entries(decendants).reduce((accu, [key, decendant]) => {
      accu[key] = decendant($);

      return accu;
    }, {} as Record<string, Query<any>>) as any;

    return {$, $$};
  };
}
