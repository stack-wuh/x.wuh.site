module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [
      2,
      'always',
      'lowerCase'
    ],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'feat',
        'chore',
        'style',
        'docs',
        'ui',
        'fix',
        'refactor',
        'ci',
        'test'
      ]
    ]
  }
}