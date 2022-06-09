'use strict';

const stringUtil = require('ember-cli-string-utils');
const chalk = require('chalk');
const path = require('path');
const util = require('util');
const fs = require('fs');
const mv = util.promisify(fs.rename);
const prependEmoji = require('./lib/utilities/prepend-emoji');

module.exports = {
  description: 'The Gavant blueprint for ember-cli projects.',

    locals(options) {
        let entity = options.entity;
        let rawName = entity.name;
        let name = stringUtil.dasherize(rawName);
        let namespace = stringUtil.classify(rawName);
        console.log('BLUEPRINT OPTIONS!', options, rawName, name, namespace);

        return {
            name,
            modulePrefix: name,
            namespace,
            emberCLIVersion: require('./package').version,
            yarn: options.yarn,
            blueprint: '@gavant/ember-app-blueprint',
            backend: options.backend || options.be || 'json-api'
        };
    },

    beforeInstall() {
        console.log('beforeInstall project!', this.project);
        console.log('------------------------------------------------------');
        console.log('this context', this);

        const version = require('./package').version;
        this.ui.writeLine(chalk.blue(`Gavant Ember App Blueprint v${version}`));
        this.ui.writeLine('');
        this.ui.writeLine(prependEmoji('✨', `Creating a new Gavant Ember.js app in ${chalk.yellow(process.cwd())}:`));
    },

    async afterInstall() {
        await this._super.afterInstall.apply(this, arguments);

        const projRoot = this.project.root;

        // TODO if the cli hasn't run yarn install yet, we could possibly move around/merge the file dirs here of the selected BE type and then delete the unused ones
        console.log('does node_modules exist?', fs.existsSync(path.join(projRoot, 'node_modules')));
        console.log('afterInstall project!', this.project);
        console.log('------------------------------------------------------');
        console.log('this context', this);

        //rename the gitignore file to the proper .gitignore (as npm otherwise strips .gitignore files in published artifacts)
        await mv(path.join(projRoot, '__git_ignore__'), path.join(projRoot, '.gitignore'));

        //move the .env-* files into the ember app's parent directory (i.e. the repo root dir)
        await mv(path.join(projRoot, '.env-development'), path.join(projRoot, '..', '.env-development'));
        await mv(path.join(projRoot, '.env-candidate'), path.join(projRoot, '..', '.env-candidate'));
        await mv(path.join(projRoot, '.env-production'), path.join(projRoot, '..', '.env-production'));

        this.ui.writeLine(prependEmoji('🍻', `Woohoo! Your brand spankin' new Gavant Ember.js app is almost ready!`));
    }
};