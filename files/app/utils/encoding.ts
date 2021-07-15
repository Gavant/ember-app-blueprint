/**
 * Returns a base64 encoded string.
 * Used in place of just `btoa()` since that method
 * is browser-only and can't be used in fastboot.
 * For this method to work, you have to add 'buffer'
 * to your fastboot-dependencies in package.json
 * @param {string} val
 */
 export function fastbootSafeBtoa(val: string) {
    // Uses recommended fastboot checking syntax, for more info:
    // https://ember-fastboot.com/docs/user-guide#using-whitelisted-node-dependencies
    if (typeof FastBoot === 'undefined') {
        return btoa(val);
    } else {
        var buffer = FastBoot.require('buffer');
        return buffer.Buffer.from(val).toString('base64');
    }
}