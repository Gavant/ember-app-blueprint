import { guidFor } from '@ember/object/internals';

import Serializer from '@ember-data/serializer/json-api';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
import { singularize } from 'ember-inflector';

type Constructor<T = Serializer> = new (...args: any[]) => T;

export interface SerializeAttrs {
    [x: string]: {
        serialize?: boolean;
        key?: string;
    };
}

interface HashObject {
    [x: string]: any;
}

interface JsonPayloadRecord {
    type: string;
    id?: string;
    tempId?: string;
    attributes: any;
    relationships?: {
        [x: string]: JsonPayloadRelationship;
    };
}

interface JsonPayloadRelationship {
    data: JsonPayloadRecord | JsonPayloadRecord[];
}

interface JsonPayload {
    data: JsonPayloadRecord;
    included?: JsonPayloadRecord[];
}

interface RelationshipConfig {
    kind: 'belongsTo' | 'hasMany';
    key: string;
}

export default function SidepostRelationships<TBase extends Constructor>(Base: TBase) {
    class SidepostRelationshipsClass extends Base {
        /**
         * extend the default JSONAPISerializer `attrs` object to allow an optional
         * `serialize` key to be passed in to configure which relationships will be
         * sideposted in save requests
         * @see https://api.emberjs.com/ember-data/3.17/classes/JSONAPISerializer/properties/attrs?anchor=attrs
         */
        attrs: SerializeAttrs = {};

        /**
         * The name of the key in the json payload that holds the temporary resource identifer
         * for new related records, which conforms to the JSON-API Sideposting proposal draft:
         * @see https://github.com/json-api/json-api/pull/1197
         */
        internalModelKey = 'tempId';

        /**
         * keeps track of the records that have already been serialized from relationships
         */
        private visitedRecordIds: HashObject = {};

        /**
         * Creates the final json payload hash to be sent to the server
         * @param {JsonPayload} hash
         * @param {String} typeClass
         * @param {DS.Snapshot} snapshot
         * @param {HashObject} options
         */
        serializeIntoHash(hash: JsonPayload, typeClass: string, snapshot: DS.Snapshot, options: HashObject) {
            super.serializeIntoHash(hash, typeClass, snapshot, options);
            this.flattenPayloadRelationships(hash, hash.data);
        }

        /**
         * Serialize the record with JSONAPISerializer
         * @param {DS.Snapshot} snapshot
         * @param {HasObject} options
         * @returns {Object}
         */
        serialize(snapshot: DS.Snapshot, options: HashObject) {
            if (!(options && options.__isSidepostRelationshipsMixinCallback)) {
                this.visitedRecordIds = {};
            }

            const serialized = super.serialize(snapshot, options);
            return serialized;
        }

        /**
         * Customizes hasMany serialization to include the relationship's attributes and child relationships in the payload
         * @param {DS.Snapshot} snapshot
         * @param {JsonPayloadRecord} json
         * @param {RelationshipConfig} relationship
         */
        serializeHasMany(snapshot: DS.Snapshot, json: JsonPayloadRecord, relationship: RelationshipConfig) {
            super.serializeHasMany(snapshot, json, relationship);
            this.serializeRelationship(snapshot, json, relationship);
        }

        /**
         * Customizes belongsTo serialization to include the relationship's attributes and child relationships in the payload
         * @param {DS.Snapshot} snapshot
         * @param {JsonPayloadRecord} json
         * @param {RelationshipConfig} relationship
         */
        serializeBelongsTo(snapshot: DS.Snapshot, json: JsonPayloadRecord, relationship: RelationshipConfig) {
            super.serializeBelongsTo(snapshot, json, relationship);
            this.serializeRelationship(snapshot, json, relationship);
        }

        /**
         * Serializes related record's attributes/relationships into the payload
         * @param {DS.Snapshot} snapshot
         * @param {JsonPayloadRecord} data
         * @param {RelationshipConfig} rel
         */
        serializeRelationship(snapshot: DS.Snapshot, data: JsonPayloadRecord, rel: RelationshipConfig) {
            const relKind = rel.kind;
            const relKey = rel.key;
            const shouldSerialize = this.attrs && this.attrs[relKey] && this.attrs[relKey].serialize === true;

            if (data && shouldSerialize) {
                data.relationships = data.relationships || {};
                const key = this.keyForRelationship(relKey, relKind, 'serialize');
                const relationship = (data.relationships[key] = data.relationships[key] || {});

                if (relKind === 'belongsTo') {
                    relationship.data = this.serializeRecord(snapshot.belongsTo(relKey));
                } else if (relKind === 'hasMany') {
                    // provide a default empty value
                    relationship.data = [];
                    const hasMany = snapshot.hasMany(relKey);
                    if (hasMany !== undefined) {
                        relationship.data = hasMany.map(this.serializeRecord.bind(this));
                    }
                }
            }
        }

        /**
         * Serializes related record's attributes/relationships, keeping track of records that were already serialized
         * @param {DS.Snapshot | null | undefined} obj
         * @returns {Object}
         */
        serializeRecord(obj: DS.Snapshot | null | undefined) {
            if (!obj) {
                return null;
            }

            //allow passing in a non-standard serialize() option
            const options = { __isSidepostRelationshipsMixinCallback: true } as any;
            const serialized = obj.serialize(options) as HashObject;

            if (obj.id) {
                serialized.data.id = obj.id;
                this.visitedRecordIds[obj.id] = {};
            } else {
                if (!serialized.data.attributes) {
                    serialized.data.attributes = {};
                }

                const internalModelKey = this.internalModelKey;
                serialized.data[internalModelKey] = guidFor(obj.record._internalModel);
                this.visitedRecordIds[serialized.data[internalModelKey]] = {};
            }

            for (const relationshipId in serialized.data.relationships) {
                if (this.visitedRecordIds[relationshipId]) {
                    delete serialized.data.relationships[relationshipId];
                }
            }

            if (serialized.data.relationships === {}) {
                delete serialized.data.relationships;
            }

            return serialized.data;
        }

        /**
         * Flattens all nested relationships into the json payload's `included` array
         * @param {JsonPayload} payload
         * @param {JsonPayloadRecord} record
         */
        flattenPayloadRelationships(payload: JsonPayload, record: JsonPayloadRecord) {
            if (!payload.included) {
                payload.included = [];
            }

            this.flattenEachRelationship(payload, record);
        }

        /**
         * Recursively flatten a single record's relationships and any child relationships
         * @param {JsonPayload} payload
         * @param {JsonPayloadRecord} record
         */
        flattenRelationship(payload: JsonPayload, record: JsonPayloadRecord) {
            const incRecord = { ...record };

            // remove attributes and relationships props from the related objects
            delete record.attributes;
            delete record.relationships;

            if (incRecord.relationships) {
                this.flattenEachRelationship(payload, incRecord);
            }

            //don't add duplicate records to `included`
            if (!this.recordIsIncluded(record, payload.included)) {
                payload.included!.push(incRecord);
            }
        }

        /**
         * Flattens each nested relationship in the provided record
         * @param {JsonPayload} payload
         * @param {JsonPayloadRecord} record
         */
        flattenEachRelationship(payload: JsonPayload, record: JsonPayloadRecord) {
            if (record.relationships) {
                Object.keys(record.relationships).forEach((key) => {
                    const rel = record.relationships![key].data;
                    if (Array.isArray(rel)) {
                        // hasMany
                        rel.forEach((item) => this.flattenRelationship(payload, item));
                    } else if (rel) {
                        // belongsTo
                        this.flattenRelationship(payload, rel);
                    }
                });
            }
        }

        /**
         * Checks if a given record json payload is already in the payload's `included` array
         * @param {JsonPayloadRecord} record
         * @param {JsonPayloadRecord[] | undefined} included
         */
        recordIsIncluded(record: JsonPayloadRecord, included: JsonPayloadRecord[] | undefined) {
            const internalModelKey = this.internalModelKey as keyof JsonPayloadRecord;

            if (Array.isArray(included)) {
                return included.some(
                    (incRecord: JsonPayloadRecord) =>
                        record.type === incRecord.type &&
                        ((record[internalModelKey] && record[internalModelKey] === incRecord[internalModelKey]) ||
                            (record.id && record.id === incRecord.id))
                );
            }

            return false;
        }

        /**
         * Normalizes the response data for save requests
         * @param {DS.Store} store
         * @param {DS.Model} primaryModelClass
         * @param {JsonPayload} payload
         * @param {String} id
         * @param {String} requestType
         * @returns {Object}
         */
        normalizeSaveResponse(
            store: DS.Store,
            primaryModelClass: DS.Model,
            payload: JsonPayload,
            id: string,
            requestType: string
        ) {
            const rels = payload.data.relationships;
            let included = {};

            if (payload.included) {
                included = payload.included.reduce((prev, current) => {
                    prev[current.id!] = current;
                    return prev;
                }, {} as HashObject);
            }

            if (rels) {
                Object.keys(rels).forEach((rel: string) => {
                    const relationshipData = rels[rel].data;
                    if (relationshipData) {
                        this.normalizeRelationship(relationshipData, store, included);
                    }
                });
            }

            // now run through the included objects looking for client ids
            if (payload.included) {
                for (const includedItem of payload.included) {
                    this.updateRecord(includedItem, store);
                }
            }

            return super.normalizeSaveResponse(store, primaryModelClass, payload, id, requestType);
        }

        /**
         * Normalizes relationships returned by save requests
         * @param {JsonPayloadRecord | JsonPayloadRecord[]} relationshipData
         * @param {DS.Store} store
         * @param {HashObject} included
         */
        normalizeRelationship(
            relationshipData: JsonPayloadRecord | JsonPayloadRecord[],
            store: DS.Store,
            included: HashObject
        ) {
            if (Array.isArray(relationshipData)) {
                // hasMany
                relationshipData.map((item) => this.normalizeRelationshipItem(item, store, included));
            } else if (relationshipData) {
                // belongsTo
                this.normalizeRelationshipItem(relationshipData, store, included);
            }
        }

        /**
         * Normalizes a single relationship returned by save requests
         * @param {HashObject} item
         * @param {DS.Store }store
         * @param {HashObject} included
         */
        normalizeRelationshipItem(item: HashObject, store: DS.Store, included: HashObject) {
            if (item.__normalized) {
                return;
            }

            item.__normalized = true;
            const includedData = included[item.id];

            if (includedData) {
                item = includedData;
            }

            const internalRelationships = item.relationships;

            if (internalRelationships !== undefined) {
                Object.keys(internalRelationships).forEach((rel) => {
                    this.normalizeRelationship(internalRelationships[rel].data, store, included);
                });
            }

            if (!includedData) {
                // if it's in the included block then it will be updated at the end of normalizeSaveResponse
                this.updateRecord(item, store);
            }
        }

        /**
         * Update newly created records with the response from the api by matching on their temporary identifier
         * @param {HashObject} json
         * @param {DS.Store} store
         * @returns {Object}
         */
        updateRecord(json: HashObject, store: DS.Store) {
            const internalModelKey = this.internalModelKey;
            if (json && json[internalModelKey] !== undefined) {
                json.type = singularize(json.type);

                const record = store
                    .peekAll(json.type)
                    .filterBy('currentState.stateName', 'root.loaded.created.uncommitted')
                    .find(
                        (record: { _internalModel: Record<string, unknown> }) =>
                            guidFor(record._internalModel) === json[internalModelKey]
                    );

                if (record) {
                    record.set('id', json.id);
                    record._internalModel.id = json.id;
                    record._internalModel.adapterWillCommit();
                    // @ts-ignore private api
                    // @see https://api.emberjs.com/ember-data/3.17/classes/Store/methods/didSaveRecord?anchor=didSaveRecord&show=private
                    store.didSaveRecord(record._internalModel);
                }
            }

            return json;
        }
    }

    return SidepostRelationshipsClass;
}
