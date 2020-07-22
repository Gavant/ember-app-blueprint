import DS from 'ember-data';
import { isArray } from '@ember/array';
import { camelize } from '@ember/string';
import ModelRegistry from 'ember-data/types/registries/model';

export default class ApplicationSerializer extends DS.JSONAPISerializer {
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
     * @param snapshot {DS.Snapshot<string | number>}
     * @param json {Object}
     * @param key {String}
     * @param attribute {Object}
     * @see https://github.com/emberjs/data/issues/3467#issuecomment-543176123
     */
    serializeAttribute(
        snapshot: DS.Snapshot<string | number>,
        json: { attributes: Object | null },
        key: string,
        attribute: {}
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
        json: { data: { attributes: Object } },
        type: ModelRegistry,
        snapshot: DS.Snapshot<string | number>,
        options: Object
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
