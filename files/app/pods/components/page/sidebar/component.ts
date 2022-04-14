import { getOwner } from '@ember/application';
import Component from '@glimmer/component';

export interface PageSidebarArgs {
    id?: string;
    empty?: boolean;
    document?: Document;
}

export interface PageSidebarSignature {
    Args: PageSidebarArgs;
    Blocks: { default: []; initial: [] };
}

export default class PageSidebar extends Component<PageSidebarSignature> {
    get id() {
        return this.args.id ?? 'application-sidebar';
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
        'Page::Sidebar': typeof PageSidebar;
    }
}
