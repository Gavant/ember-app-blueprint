import Controller from '@ember/controller';
import Route from '@ember/routing/route';

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

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Use this to declare a model property on the controller that is based upon the passed in route.
 * ```
 * e.g.
 * declare model: RouteModel<LoginRoute>;
 * ```
 */
export type RouteModel<T extends Route> = Awaited<ReturnType<T['model']>>;

/**
 * Join concatenates two strings with a dot in the middle, unless the last string is empty
 *
 * @export
 * @interface Join
 * @template K, P
 */
export type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}${'' extends P ? '' : '.'}${P}`
        : never
    : never;

/**
 * Workaround for the typescript instantiation depth limit of 50 as of 4.1
 * https://dev.to/susisu/how-to-create-deep-recursive-types-5fgg#:~:text=As%20of%20TypeScript%204.1%2C%20the%20instantiation%20depth%20limit%20is%2050.
 *
 * @export
 * @interface Recurse
 * @template T
 */
type Recurse<T> = T extends { __rec: never }
    ? never
    : T extends { __rec: { __rec: infer U } }
    ? { __rec: Recurse<U> }
    : T extends { __rec: infer U }
    ? U
    : T;

/**
 * Workaround for the typescript instantiation depth limit of 50 as of 4.1
 * https://dev.to/susisu/how-to-create-deep-recursive-types-5fgg#:~:text=As%20of%20TypeScript%204.1%2C%20the%20instantiation%20depth%20limit%20is%2050.
 *
 * @export
 * @interface ParseRecursionToken
 * @template T
 */
type ParseRecursionToken<T> = T extends { __rec: unknown } ? Recurse<Recurse<T>> : T;

/**
 * Acts as a depth limiter for recursion
 *
 * @export
 * @interface Prev
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

/**
 * Type that recursively builds nested objects with the value of `__rec` being set as the path
 *
 * @export
 * @interface PathsRecursion
 * @template T, D
 */
type PathsRecursion<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends Record<string, unknown>
    ? {
          [K in keyof T]-?: K extends string | number ? { __rec: `${K}` | Join<K, Paths<T[K], Prev[D]>> } : never;
      }[keyof T]
    : '';

/**
 * Recursively find the paths of object `T`. You may pass in a depth limiter `D` to stop the recursion
 *
 * @export
 * @interface Paths
 * @template T, D
 */
export type Paths<T, D extends number = 10> = ParseRecursionToken<PathsRecursion<T, D>>;
