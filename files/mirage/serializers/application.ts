import { camelize } from '@ember/string';

import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
    keyForAttribute(attribute: string) {
        return camelize(attribute);
    }
});
