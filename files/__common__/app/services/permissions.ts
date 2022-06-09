import Service from 'ember-can/services/can';

export default class PermissionsService extends Service {
    /**
     * Parse ablityString into an object with extracted propertyName and abilityName
     *
     * @param {string} str
     * @returns {Object} extracted propertyName and abilityName
     * @memberof PermissionsService
     */
    parse(str: string) {
        const [abilityName, propertyName] = str.split('.');
        return {
            propertyName,
            abilityName
        };
    }
}
