import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Component from '@glimmer/component';

import { guard } from '<%= modulePrefix %>/utils/typescript';

import { SimpleNode } from '@simple-dom/interface';

export interface PageLayoutArgs {
    id: string;
    empty: boolean;
    document: Document;
}

interface PageLayoutSignature {
    Args: PageLayoutArgs;
    Blocks: { default: []; initial: [] };
    Element: HTMLDivElement;
}

export default class PageLayout extends Component<PageLayoutSignature> {
    get targetElement() {
        const element = this.findElementById(this.args.document, this.args.id);
        return element;
    }

    childNodesOfElement(element: SimpleNode) {
        const children = [];
        let child = element.firstChild;
        while (child) {
            children.push(child);
            child = child.nextSibling;
        }
        return children;
    }

    /**
     * Find element by ID passing in the document (normal or simpledom)
     *
     * @export
     * @param {*} doc
     * @param {*} id
     * @return {*}
     */
    findElementById(doc: Document | SimpleNode, id: string) {
        if (guard<Document>(doc, 'getElementById')) {
            return doc.getElementById(id);
        }

        let nodes = this.childNodesOfElement(doc);
        let node: SimpleNode | undefined;

        while (nodes.length) {
            node = nodes.shift();
            if (guard(node, 'getAttribute') && node?.getAttribute('id') === id) {
                return node;
            }

            if (node) {
                nodes = this.childNodesOfElement(node).concat(nodes);
            }
        }

        return node;
    }

    /**
     * Find count of elements by id
     *
     * @export
     * @param {*} doc
     * @param {*} id
     * @return {*}
     */
    countByID(doc: Document | SimpleNode, id: string) {
        if (guard<Document>(doc, 'querySelectorAll')) {
            return doc.querySelectorAll(`#${id}`).length;
        }

        let children = this.childNodesOfElement(doc);
        const nodes = [];
        let node;

        while (children.length) {
            node = children.shift();
            if (guard(node, 'getAttribute') && node?.getAttribute('id') === id) {
                nodes.push(node);
            }

            if (node) {
                children = this.childNodesOfElement(node).concat(children);
            }
        }

        return nodes.length;
    }

    /**
     * only allow one inline usage of the component in the app, to prevent multiple element targets
     *
     * @memberof PageLayout
     */
    @action
    onTargetInsert() {
        const elementsWithId = this.countByID(this.args.document, this.args.id);
        assert('cannot have multiple page header targets rendered in the app!', elementsWithId === 1);
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Page::Layout': typeof PageLayout;
    }
}
