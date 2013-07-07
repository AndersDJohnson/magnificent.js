module.exports = function(grunt) {
  
  grunt.initConfig({
    less: {
      compile: {
        options: {
          compress: false
        },
        files: [
          {
            expand: true,
            cwd: '.',
            src: [
              'examples/**/*.less',
              'lib/**/*.less'
            ],
            ext: '.css',
            dest: '.'
          }
        ]
      }
    },
    watch: {
      less: {
        files: '**/*.less',
        tasks: 'less:compile'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('compile', ['less:compile'])

};