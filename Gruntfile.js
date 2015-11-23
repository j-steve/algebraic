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
				loopfunc: true
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['clean', 'copy', 'concat']
		},
		copy: {
			build: {
				cwd: 'www',
				src: ['**', '!scripts/**'],
				dest: 'www-built',
				expand: true
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'www/scripts/polyfill.js',
					'www/scripts/**/*.js'
				],
				dest: 'www-built/scripts/algebraic.js'
			}
		},
		clean: {
			build: {
				src: 'www-built'
			}
		}/*,
		 requirejs: {
		 compile: {
		 options: {
		 baseUrl: "www/scripts/requirejs",
		 mainConfigFile: "path/to/config.js",
		 out: "www/scripts/requirejs.js"
		 }
		 }
		 }*/
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask(
		'default',
		'Watches the project for changes, automatically builds them and runs a server.',
		['watch']
	);

	grunt.registerTask(
		'build',
		'Compiles all of the assets and copies the files to the build directory.',
		['jshint', 'clean', 'copy', 'concat', 'watch']
	);

};