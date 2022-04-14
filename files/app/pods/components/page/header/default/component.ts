import { action } from '@ember/object';
import Component from '@glimmer/component';

interface PageHeaderDefaultArgs {}

export default class PageHeaderDefault extends Component<PageHeaderDefaultArgs> {
    @action
    logout() {}
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Page::Header::Default': typeof PageHeaderDefault;
    }
}
