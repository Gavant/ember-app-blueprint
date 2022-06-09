'use strict';

const fs = require('fs');

function deleteDirRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            const curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) {
                deleteDirRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

module.exports = deleteDirRecursive;
