/**
 * Based on: https://github.com/verbose/verb-default/blob/master/index.js.
 */
'use strict';

var verb = require('verb');
var gutil = require('gulp-util');

verb.task('default', function() {
  verb.src(['.verb*.md', 'docs/_verb/**/*.md'])
    .on('error', gutil.log)
    .pipe(verb.dest('./'));
});


// var helperBower = require('./verb-helper-bower');
var helperBower = require('verb-helper-bower');
verb.helper('bowerMain', helperBower.main);
verb.helper('bowerDeps', helperBower.deps);
