import '@glint/environment-ember-loose';
import '@glint/environment-ember-loose/native-integration';
import Ember from 'ember';

declare global {
    interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
    // interface Function extends Ember.FunctionPrototypeExtensions {}
}

export {};
