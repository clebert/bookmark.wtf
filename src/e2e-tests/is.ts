import {Primitive, fn, select} from 'sonnar';

export function is(classOrId: string): Primitive {
  if (classOrId.startsWith('.')) {
    return fn(
      'contains',
      fn(
        'concat',
        ' ',
        fn('normalize-space', select('attribute', 'class')),
        ' '
      ),
      ` ${classOrId.slice(1)} `
    );
  }

  if (classOrId.startsWith('#')) {
    return select('attribute', 'id').is('=', classOrId.slice(1));
  }

  throw new Error();
}
