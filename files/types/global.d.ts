// Types for compiled templates
declare module '<%= modulePrefix %>/templates/*' {
    import { TemplateFactory } from 'htmlbars-inline-precompile';
    const tmpl: TemplateFactory;
    export default tmpl;
}

declare module '<%= modulePrefix %>/graphql/schema/schema.graphql' {
    import { DocumentNode } from 'graphql';
    const Schema: DocumentNode;
    export = Schema;
}
