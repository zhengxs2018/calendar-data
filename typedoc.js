const pkg = require('./package.json')

module.exports = {
  name: pkg.name,
  mode: 'file',
  readme: './README.md',
  gitRevision: 'master',
  out: 'doc',
  inputFiles: ['./src'],
  excludePrivate: true,
  excludeExternals: true,
  excludeNotExported: true,
  exclude: ['**/*.spec.ts', '**/*.test.ts'],
  ignoreCompilerErrors: true
}
