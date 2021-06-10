export {};
// Types for compiled templates
declare module '<%= modulePrefix %>/templates/*' {
    import { TemplateFactory } from 'htmlbars-inline-precompile';
    const tmpl: TemplateFactory;
    export default tmpl;
}

declare global {
    const FastBoot:
        | undefined
        | {
              require(moduleName: string): any;
          };
}
