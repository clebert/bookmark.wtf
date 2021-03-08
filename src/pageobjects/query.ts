export type Query<TCombinators extends Combinators> = (
  ...discriminators: readonly Discriminator[]
) => VirtualNode<TCombinators>;

export interface Combinators {
  readonly [key: string]: Combinator;
}

export type Combinator = (firstSelector: string) => Query<any>;
export type Discriminator = (selector: string) => string;

export type VirtualNode<TCombinators extends Combinators> = {
  readonly $: string;

  readonly $$: {
    readonly [TKey in keyof TCombinators]: ReturnType<TCombinators[TKey]>;
  };
};

export function query<TCombinators extends Combinators>(
  selector: string,
  combinators: TCombinators
): Query<TCombinators> {
  return (...discriminators) => {
    const $ = discriminators.reduce(
      (accu, discriminator) => discriminator(accu),
      selector
    );

    const $$ = Object.entries(combinators).reduce((accu, [key, combinator]) => {
      accu[key] = combinator($);

      return accu;
    }, {} as Record<string, Query<any>>) as any;

    return {$, $$};
  };
}
