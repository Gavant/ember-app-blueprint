import FaIconComponent from '@gavant/glint-template-types/types/@fortawesome/ember-fontawesome/fa-icon';
import ChangesetInput from '@gavant/glint-template-types/types/@gavant/gavant-ember-validations/changeset-input';
import FormValidator from '@gavant/glint-template-types/types/@gavant/gavant-ember-validations/form-validator';
import { FormValidatorChildSignature } from '@gavant/glint-template-types/types/@gavant/gavant-ember-validations/form-validator/child';
import InputValidator, { InputValidatorSignature } from '@gavant/glint-template-types/types/@gavant/gavant-ember-validations/input-validator';
import TranslationHelper from '@gavant/glint-template-types/types/ember-intl/translation-helper';
import DidInsertModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-insert';
import DidUpdateModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-update';
import And from '@gavant/glint-template-types/types/ember-truth-helpers/and';
import Eq from '@gavant/glint-template-types/types/ember-truth-helpers/eq';
import Not from '@gavant/glint-template-types/types/ember-truth-helpers/not';
import Or from '@gavant/glint-template-types/types/ember-truth-helpers/or';

import { ComponentLike } from '@glint/template';

export type InputValidatorLikeComponent = ComponentLike<InputValidatorSignature>;
export type FormValidatorChildLikeComponent = ComponentLike<FormValidatorChildSignature<unknown>>;



declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'did-insert': typeof DidInsertModifier;
        'did-update': typeof DidUpdateModifier;
        FaIcon: typeof FaIconComponent;
        'fa-icon': typeof FaIconComponent;
        t: typeof TranslationHelper;
        and: typeof And;
        eq: typeof Eq;
        or: typeof Or;
        not: typeof Not;
        InputValidator: typeof InputValidator;
        FormValidator: typeof FormValidator;
        ChangesetInput: typeof ChangesetInput;

    }
}
