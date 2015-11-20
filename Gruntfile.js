/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {

	grunt.initConfig({
		jshint: {
			files: ['Gruntfile.js', 'www/scripts/**/*.js'],
			options: {
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['build']
		},
		copy: {
			build: {
				cwd: 'www',
				src: ['**'],
				dest: 'www-built',
				expand: true
			}
		},
		clean: {
			build: {
				src: 'www-built'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask(
	  'default', 
	  'Watches the project for changes, automatically builds them and runs a server.', 
	  [ 'build', 'watch' ]
	);
	
	grunt.registerTask(
	  'build', 
	  'Compiles all of the assets and copies the files to the build directory.', 
	  ['jshint', 'clean', 'copy' ]
	);

};