module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', 'build');

  grunt.registerTask('build', [
    'test'
  ]);
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

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 6246, // MAGN in keypad
          // base: '.',
          keepalive: true
        }
      }
    },

    jsdoc : {
      dist : {
        src: ['src/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'docs/jsdoc',
          configure: 'jsdoc.json',
          template : 'node_modules/ink-docstrap/template',
          // configure : 'node_modules/ink-docstrap/template/jsdoc.conf.json'
        }
      }
    }

  });

};
