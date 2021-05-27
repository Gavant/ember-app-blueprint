import { Server } from 'ember-cli-mirage';

declare module 'ember-test-helpers' {
    export interface TestContext {
        server: Server;
    }
}
