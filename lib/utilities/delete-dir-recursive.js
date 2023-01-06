'use strict';

const fs = require('fs');
const path = require('path');

function deleteDirRecursive(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(file) {
            const curPath = path.join(dir, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(dir);
    }
}

module.exports = deleteDirRecursive;
