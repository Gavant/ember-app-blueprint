'use strict';

const stringUtil = require('ember-cli-string-utils');
const chalk = require('chalk');
const path = require('path');
const util = require('util');
const fs = require('fs');
const mv = util.promisify(fs.rename);
const mergedirs = require('merge-dirs').default;

const deleteDirRecursive = require('./lib/utilities/delete-dir-recursive');
const prependEmoji = require('./lib/utilities/prepend-emoji');

const ENVS = ['development', 'test', 'candidate', 'production'];
const SUPPORTED_BACKENDS = ['json-api', 'graphql'];
const DEFAULT_BACKEND = 'json-api';
const COMMON_DIR = '__common__';
const PROJECT_TYPES_DIR = '__project-types__';

module.exports = {
  description: 'The Gavant blueprint for ember-cli projects.',

    locals(options) {
        let entity = options.entity;
        let rawName = entity.name;
        let name = stringUtil.dasherize(rawName);
        let namespace = stringUtil.classify(rawName);

        return {
            name,
            modulePrefix: name,
            namespace,
            emberCLIVersion: require('./package').version,
            yarn: options.yarn,
            blueprint: '@gavant/ember-app-blueprint'
        };
    },

    beforeInstall() {
        const version = require('./package').version;
        this.ui.writeLine(chalk.blue(`Gavant Ember App Blueprint v${version}`));
        this.ui.writeLine('');
        this.ui.writeLine(prependEmoji('✨', `Creating a new Gavant Ember.js app in ${chalk.yellow(process.cwd())}:`));
    },

    async afterInstall() {
        await this._super.afterInstall.apply(this, arguments);

        const projRoot = this.project.root;

        // get the selected backend type
        const backendOption = this.options.backend || this.options.be; 
        const backend = backendOption && SUPPORTED_BACKENDS.includes(backendOption) ? backendOption : DEFAULT_BACKEND;

        // copy and merge the selected backend files with the common project files in the project root
        mergedirs(path.join(projRoot, COMMON_DIR), projRoot, 'overwrite');
        mergedirs(path.join(projRoot, PROJECT_TYPES_DIR, backend), projRoot, 'overwrite');

        // delete the __commom_ and __project-type__ template dirs
        deleteDirRecursive(path.join(projRoot, COMMON_DIR));
        deleteDirRecursive(path.join(projRoot, PROJECT_TYPES_DIR));

        //rename the gitignore file to the proper .gitignore (as npm otherwise strips .gitignore files in published artifacts)
        await mv(path.join(projRoot, '__git_ignore__'), path.join(projRoot, '.gitignore'));

        //move the .env-* files into the ember app's parent directory (i.e. the repo root dir)
        await Promise.all(ENVS.map(env => mv(path.join(projRoot, `.env-${env}`), path.join(projRoot, '..', `.env-${env}`))));

        this.ui.writeLine(prependEmoji('🍻', `Woohoo! Your brand spankin' new Gavant Ember.js app is almost ready!`));
    }
};