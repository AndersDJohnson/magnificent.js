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


verb.helper('bowerMain', require('./helper-bower').main);
verb.helper('bowerDeps', require('./helper-bower').deps);
