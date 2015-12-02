/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var GLOBALS = /\s*\/\* global[^*]+\*\/\s*/g;
var LINE = '// ====================================================================================================\n'; 

module.exports = function (grunt) {

	grunt.initConfig({
		jshint: {
			files: ['Gruntfile.js', 'www/scripts/**/*.js'],
			options: {
				loopfunc: true
			}
		},
		watch: {
			files: ['www/**/*'],
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
				banner: '\'use strict\';\n',
				process: function(src, filepath) {
					src = src.trim().replace(GLOBALS, ''); 
					var fileName = filepath.replace('www/scripts', '');
					var header = '//      ..' + fileName + '\n'; 
					return '\n\n' + LINE + header + LINE + '\n' + src;
				}
			},
			dist: {
				src: [
					'www/scripts/polyfill.js',
					'www/scripts/**/BaseNode.js',
					'www/scripts/**/OperatorNode.js',
					'www/scripts/**/CommutativeOpNode.js', 
					'www/scripts/**/LeafNode.js',
					'www/scripts/**/*.js'
				],
				dest: 'www-built/scripts/algebraic.js'
			}
		},
		
		// Clean stuff up before a build.
		clean: { 
			build: ['www-built'], // Clean the 'built' directory.
			hooks: ['.git/hooks/pre-commit'] // Clean any pre-commit hooks in .git/hooks directory
		},
		
		// Run shell commands.
		shell: {
			hooks: {
				// Copy the project's pre-commit hook into .git/hooks
				command: '@echo #!/bin/sh > .git/hooks/pre-commit && ' + 
						 '@echo node_modules/.bin/grunt build >> .git/hooks/pre-commit' //'cp git-hooks/pre-commit .git/hooks/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-shell');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask(
		'default',
		'Watches the project for changes, automatically builds them and runs a server.',
		['watch']
	);

	grunt.registerTask(
		'build',
		'Compiles all of the assets and copies the files to the build directory.',
		['jshint', 'clean', 'copy', 'concat']
	);
	
	// Clean the .git/hooks/pre-commit file then copy in the latest version
	grunt.registerTask('installGitHooks', ['clean:hooks', 'shell:hooks']);

};