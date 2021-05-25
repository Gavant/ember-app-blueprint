import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import LoadingBar from '<%= modulePrefix %>/services/loading-bar';

interface ProgressBarArgs {
    light: boolean;
}

export default class ProgressBar extends Component<ProgressBarArgs> {
    @service declare loadingBar: LoadingBar;

    /**
     * Returns whether or not the loading bar is visible
     *
     * @readonly
     * @type {boolean}
     */
    get isShown(): boolean {
        return this.loadingBar.isShown;
    }

    /**
     * Returns whether or not the loading bar is light
     *
     * @readonly
     * @type {boolean}
     */
    get light(): boolean {
        return this.args.light ?? false;
    }
}
