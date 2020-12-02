module.exports = function (api) {
  return {
    presets: [
      [
        '@babel/env',
        {
          bugfixes: true,
          corejs: {version: 3, proposals: true},
          targets: api.caller((caller) => caller && caller.target === 'node')
            ? {node: '12'}
            : 'last 2 Chrome versions',
          useBuiltIns: 'usage',
        },
      ],
      '@babel/react',
      '@babel/typescript',
    ],
    plugins: ['@babel/proposal-optional-chaining'],
  };
};
