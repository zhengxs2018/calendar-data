const pkg = require('./package.json')

module.exports = {
  name: pkg.name,
  mode: 'modules',
  readme: './README.md',
  gitRevision: 'master',
  out: 'doc',
  inputFiles: ['./src'],
  excludePrivate: true,
  excludeExternals: true,
  excludeNotExported: true,
  exclude: ['src/index.ts', '**/*.spec.ts', '**/*.test.ts'],
  ignoreCompilerErrors: true
}
