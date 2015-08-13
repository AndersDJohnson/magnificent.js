module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', 'build');
  grunt.registerTask('build', [
    // 'babel',
    'browserify:dist'
  ]);

  grunt.registerTask('test', 'mocha');
  grunt.registerTask('mocha', 'simplemocha');

  grunt.initConfig({

    // babel: {
    //     options: {
    //         sourceMap: true,
    //         // modules: 'umd'
    //     },
    //     dist: {
    //         files: {
    //             'dist/babel/js/mag-jquery.js': 'src/js/mag-jquery.js'
    //         }
    //     }
    // },

    browserify: {
      options: {
         transform: [
            ["babelify", {
               loose: "all",
               sourceMap: true
            }]
         ]
      },
      dist: {
        files: {
          'dist/js/mag-jquery.js': ['src/js/mag-jquery.js'],
          'dist/js/mag-control.js': ['src/js/mag-control.js'],
          'examples/demo/dist/index.js': ['examples/demo/index.js']
        },
      }
    },

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
