export default {
    presets: [
      ['@babel/preset-env', {
        targets: { node: '16' },
        useBuiltIns: 'usage',
        corejs: '3.33',
        shippedProposals: true
      }]
    ],
    plugins: [
      ['babel-plugin-transform-import-meta', {
        module: 'ES6',
        meta: 'import.meta'
      }]
    ]
  };