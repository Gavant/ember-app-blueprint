import { isArray } from '@ember/array';
import { camelize } from '@ember/string';

import Serializer from '@ember-data/serializer/json-api';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import ModelRegistry from 'ember-data/types/registries/model';

export default class ApplicationSerializer extends Serializer {
    keyForAttribute(key: string) {
        return key;
    }

    keyForRelationship(key: string) {
        return key;
    }

    payloadKeyFromModelName<K extends keyof ModelRegistry>(modelName: K) {
        const key = super.payloadKeyFromModelName(modelName);
        return camelize(key);
    }

    /**
     * Do not serialize attributes if the record is being updated and the attribute
     * value was not modified. Also never serialize attributes that have been
     * annotated with the `@unsendable` decorator.
     *
     * @param {(DS.Snapshot<string | number>)} snapshot
     * @param {({ attributes: Record<string, unknown> | null })} json
     * @param {string} key
     * @param {Record<string, unknown>} attribute
     * @memberof ApplicationSerializer
     */
    serializeAttribute(
        snapshot: DS.Snapshot<string | number>,
        json: { attributes: Record<string, unknown> | null },
        key: string,
        attribute: Record<string, unknown>
    ) {
        if (
            snapshot.record.get('isNew') ||
            snapshot.changedAttributes()[key] ||
            (isArray(snapshot.record.alwaysSentAttributes) &&
                snapshot.record.alwaysSentAttributes.indexOf(key) !== -1 &&
                (!isArray(snapshot.record.unsendableAttributes) ||
                    snapshot.record.unsendableAttributes.indexOf(key) === -1))
        ) {
            super.serializeAttribute(snapshot, json, key, attribute);
        }
    }


    /**
     * Append an `attributes: {}` to the request json
     * if `attributes` aren't present
     *
     * @param {{ data: { attributes: Object } }} json
     * @param {ModelRegistry} type
     * @param {(DS.Snapshot<string | number>)} snapshot
     * @param {Object} options
     */
    serializeIntoHash(
        json: { data: { attributes: Record<string, unknown> } },
        type: ModelRegistry,
        snapshot: DS.Snapshot<string | number>,
        options: Record<string, unknown>
    ) {
        super.serializeIntoHash(json, type, snapshot, options);
        if (!json.data.attributes) {
            json.data.attributes = {};
        }
    }

}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        application: ApplicationSerializer;
    }
}
