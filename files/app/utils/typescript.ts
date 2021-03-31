import Controller from '@ember/controller';
export type ConcreteSubclass<T> = new (...args: any[]) => T;
export type ControllerInstance = ConcreteSubclass<Controller>;
/**
 * Generic type guard
 *
 * @template T
 * @param {*} itemToCheck
 * @param {(Array<keyof T> | keyof T)} propertyNames
 * @returns {itemToCheck is T}
 */
export const guard = <T>(itemToCheck: any, propertyNames: Array<keyof T> | keyof T): itemToCheck is T => {
    return Array.isArray(propertyNames)
        ? Object.keys(itemToCheck as T).some((key) => propertyNames.indexOf(key as keyof T) >= 0)
        : (itemToCheck as T)[propertyNames as keyof T] !== undefined;
};
export const isArrayOf = <T>(itemToCheck: any[], propertyNames: Array<keyof T> | keyof T): itemToCheck is T[] => {
    return itemToCheck.some((item) => guard<T>(item, propertyNames));
};
/**
 * Pluck - allows you to pick one / multiple properties from one object
 *
 * @template T
 * @template K
 * @param {T} o
 * @param {(K[] | K)} propertyNames
 * @returns {(T[K][] | T[K])}
 */
export const pluck = <T, K extends keyof T>(o: T, propertyNames: K[] | K): T[K][] | T[K] => {
    return Array.isArray(propertyNames) ? propertyNames.map((n) => o[n]) : o[propertyNames];
};
/**
 * Flatten enum to get array of enum values
 *
 * @template T
 * @param {T} e
 * @return {*}  {T[]}
 */
export const flattenEnum = <T>(e: any): T[] => {
    return Object.values(e).filter((value) => typeof value === 'string') as T[];
};

/**
 * Modifies the type of an object to override certain properties.
 * Generally used with Ember Changesets to signify that properties
 * can be of different types when being updated.
 *
 * ex:
 * ```
 * interface User { accountBalance: number };
 *
 * type UserChangeset = GenericChangeset<Modify<User, { accountBalance?: string | number}>>;
 * ```
 */
export type Modify<T, R> = Omit<T, keyof R> & R;
