module.exports = {
  extends: [],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'REVERT',
        'FIX',
        'INFRA',
        'UI',
        'FEAT',
        'CLEANUP',
        'REFACTOR',
        'UTIL',
        'CONFIG'
      ]
    ],
    'type-case': [2, 'always', 'upper-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always']
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(\w+)\]\s(.+)$/,
      headerCorrespondence: ['type', 'subject']
    }
  }
}
