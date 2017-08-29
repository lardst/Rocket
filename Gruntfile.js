'use strict';
module.exports = function (grunt) {
    var packageJSON = grunt.file.readJSON('./package.json'),
        path = require('path');

    require('load-grunt-config')(grunt, {
        config: {
            package: packageJSON,
            environment: process.env.NODE_ENV,
            path: {
                cwd: path.resolve(),
                lib: path.resolve('./lib')
            }
        }
    });

  grunt.registerTask('js', 'Runs jscs and jshint', [
    'jscs',
    'jshint'
  ]);
};
