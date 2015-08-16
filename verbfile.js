/**
 * Based on: https://github.com/verbose/verb-default/blob/master/index.js.
 */
'use strict';

var verb = require('verb');
var gutil = require('gulp-util');

verb.disable('dest:format plugin');

verb.task('default', function() {
  verb.src(['.verb*.md', 'docs/_verb/**/*.md'])
    .on('error', gutil.log)
    .pipe(verb.dest('./'));
});

verb.data(require('./verb/data'));

var helperBower = require('verb-helper-bower');
verb.helper('bowerMain', helperBower.main);
verb.helper('bowerMainHTML', helperBower.mainHTML);
verb.helper('bowerDeps', helperBower.deps);
verb.helper('bowerDepsHTML', helperBower.depsHTML);
