import ApplicationInstance from '@ember/application/instance';

export default class CookieStorage {
    static owner: ApplicationInstance;

    /**
     * Looks up and returns the ember-cookies provided `cookies` service instance
     *
     * @readonly
     * @static
     * @memberof CookieStorage
     */
    static get cookies() {
        return this.owner.lookup('service:cookies');
    }

    /**
     * Sets an item in cookies
     *
     * @static
     * @param {string} key
     * @param {string} value
     * @returns string
     * @memberof CookieStorage
     */
    static setItem(key: string, value: string): string {
        this.cookies.write(key, value);
        return this.cookies.read(key);
    }

    /**
     * Gets an item from cookies
     *
     * @static
     * @param {string} key
     * @returns string
     * @memberof CookieStorage
     */
    static getItem(key: string): string {
        return this.cookies.read(key);
    }

    /**
     * Removes an item from cookies
     *
     * @static
     * @param {string} key
     * @returns void
     * @memberof CookieStorage
     */
    static removeItem(key: string): void {
        return this.cookies.clear(key);
    }

    /**
     * Does nothing, as we don't want to give it the ability to clear ALL cookies
     * as other systems use cookies as well, such as ember-simple-auth
     *
     * @static
     * @memberof CookieStorage
     * @returns void
     */
    static clear(): void {
        //no-op
    }
}
