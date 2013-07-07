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
            cwd: 'examples',
            src: '**/*.less',
            ext: '.css',
            dest: 'examples'
          }
        ]
      }
    },
    watch: {
      less: {
        files: 'examples/**/*.less',
        tasks: 'less:compile'
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('compile', ['less:compile'])

};