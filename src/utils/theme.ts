export class Theme {
  static readonly activeTextColor: string = 'active:text-black';
  static readonly activeBorderColor: string = 'active:border-black';
  static readonly outlineColor: string = 'focus:outline-blue-400';

  static default(): Theme {
    return new Theme(
      'text-gray-600',
      'placeholder-gray-600',
      'border-gray-200',
      'hover:border-gray-400'
    );
  }

  static link(): Theme {
    return new Theme(
      'text-blue-600',
      'placeholder-blue-600',
      'border-blue-200',
      'hover:border-blue-400'
    );
  }

  static success(): Theme {
    return new Theme(
      'text-green-600',
      'placeholder-green-600',
      'border-green-200',
      'hover:border-green-400'
    );
  }

  static danger(): Theme {
    return new Theme(
      'text-red-600',
      'placeholder-red-600',
      'border-red-200',
      'hover:border-red-400'
    );
  }

  constructor(
    readonly textColor: string,
    readonly placeholderColor: string,
    readonly borderColor: string,
    readonly hoverBorderColor: string
  ) {}
}
