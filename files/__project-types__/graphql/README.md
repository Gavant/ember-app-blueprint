# <%= name %>

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)
* [concurrently](https://www.npmjs.com/package/concurrently) (`npm install -g concurrently`)
* [VSCode GraphQL extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## Installation

* `git clone <repository-url>` this repository
* `cd <%= name %>`
* `yarn install`

## GraphQL API Notes

On app build/serve (when using `yarn start`) in development, a concurrent process (using the CLI tool [concurrently](https://www.npmjs.com/package/concurrently)) will be started to auto-generate TypeScript type definitions for the GraphQL schema and all queries/mutations in the project, which are placed in `app/types/graphql.generated.ts`. To do this, the app, via the configuration in `codegen.yml`, will by default attempt to fetch a `schema.graphql` file located at the following remote URL:

```
'https://{MY_APP_NAME}.s3.amazonaws.com/schema.graphql
```
(where `{MY_APP_NAME}` is the name of the ember app, defined by the `ember new {MY_APP_NAME}` command.)

This is also the schema file that will be used by VSCode's GraphQL extension (and other IDEs/extensions) for things like autocompletion/linting, via the configuration in `.graphqlrc`.

* If the default schema location is not correct, please update it in both `codegen.yml` and `.graphqlrc` and commit the changes.
* If you want to use a custom schema (for example, for a new feature or release), edit an `.env` file in this directory to add a `SCHEMA_PATH` env var value (note: this file should NOT be tracked in the git repo). You may need to run `source .env` in your terminal after changing this file.
* If the project does not yet have a GraphQL schema available (e.g. the backend doesn't exist yet), you may start the ember app WITHOUT any automatic GraphQL codegen, by just running `ember serve`.
* Note that if the `.graphqlrc` is configured with an invalid/non-existent schema, it may cause the VSCode GraphQL extension to crash, in which case you'll need to manually restart it (`Command Palette > "VSCode Graphql: Manual Restart"`) after updating your schema config.
* GraphQL codegen can also be run manually w/o starting the ember server via `yarn graphql-codegen`

## Running / Development

* `yarn start` (runs GraphQL/TypeScript codegen and starts the ember server)
* Visit your app at [http://localhost:4200](http://localhost:4200)
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests)

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `yarn lint`
* `yarn lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

@TODO add some relevant info here about gavant's CI/deploy processes

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
