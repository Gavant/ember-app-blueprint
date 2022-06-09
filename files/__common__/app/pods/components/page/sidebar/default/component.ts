import Component from '@glimmer/component';

interface PageSidebarDefaultArgs {}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PageSidebarDefault extends Component<PageSidebarDefaultArgs> {}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Page::Sidebar::Default': typeof PageSidebarDefault;
    }
}
