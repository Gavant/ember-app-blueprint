'use strict';

module.exports = {
    extends: ['recommended', '@gavant/ember-template-lint-forms:forms'],
    plugins: ['@gavant/ember-template-lint-forms'],
    rules: {
        'self-closing-void-elements': false,
        'no-bare-strings': ['&copy', '&nbsp'],
        'block-indentation': 4,
        'attribute-indentation': {
            indentation: 4,
            'open-invocation-max-len': 120
        }
    }
};
