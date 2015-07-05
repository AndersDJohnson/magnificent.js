module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', 'test')

  grunt.registerTask('test', 'mocha');
  grunt.registerTask('mocha', 'simplemocha');

  grunt.initConfig({

    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },

      all: { src: ['test/**/*.js'] }
    },

    watch: {
      test: {
        options: {
          atBegin: true
        },
        files: ['src/**/*', 'test/**/*'],
        tasks: 'test'
      }
    },

    jsdoc : {
      dist : {
        src: ['src/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'docs/jsdoc',
          configure: 'jsdoc.json',
          template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          // configure : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'
        }
      }
    }

  });

};
