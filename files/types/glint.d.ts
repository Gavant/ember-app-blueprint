import TranslationHelper from '@gavant/glint-template-types/types/ember-intl/translation-helper';
import DidInsertModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-insert';
import DidUpdateModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-update';
import And from '@gavant/glint-template-types/types/ember-truth-helpers/and';
import Eq from '@gavant/glint-template-types/types/ember-truth-helpers/eq';
import Not from '@gavant/glint-template-types/types/ember-truth-helpers/not';
import Or from '@gavant/glint-template-types/types/ember-truth-helpers/or';

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'did-insert': typeof DidInsertModifier;
        'did-update': typeof DidUpdateModifier;
        t: typeof TranslationHelper;
        and: typeof And;
        eq: typeof Eq;
        or: typeof Or;
        not: typeof Not;
    }
}
