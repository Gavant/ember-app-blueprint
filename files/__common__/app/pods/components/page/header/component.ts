import { getOwner } from '@ember/application';
import Component from '@glimmer/component';

export interface PageHeaderArgs {
    id?: string;
    empty?: boolean;
    document?: Document;
}

export interface PageHeaderSignature {
    Args: PageHeaderArgs;
    Blocks: { default: []; initial: [] };
}

export default class PageHeader extends Component<PageHeaderSignature> {
    get id() {
        return this.args.id ?? 'application-header';
    }

    get empty() {
        return this.args.empty ?? false;
    }

    get document() {
        return this.args.document ?? (getOwner(this) as any).lookup('service:-document');
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Page::Header': typeof PageHeader;
    }
}
