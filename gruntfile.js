module.exports = function(grunt) {
 
  // Add the grunt-mocha-test tasks. 
  
  grunt.loadNpmTasks('grunt-mocha-test');
 
  grunt.initConfig({
    // Configure a mochaTest task 
    jshint: {
      myFiles: ['app/**/*.js', 'public/js/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
     //     ui: 'tdd',
          reporter: 'spec',
          captureFile: 'test/results.txt', // Optionally capture the reporter output to a file 
          quiet: false, // Optionally suppress output to standard out (defaults to false) 
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
        },
        src: ['test/**/integration_test.js']
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
 
  //grunt.registerTask('default', ['jshint', 'mochaTest']);

grunt.registerTask('default', ['mochaTest', 'jshint']);
};