/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//var TOP_LVL_FUNCTION = /^(function[^)]*\)\s*{\s*?)(\r?\n?[ \t]*)(?=[^\s}])(?!'use strict')/gm;
//src = src.replace(TOP_LVL_FUNCTION, '$1$2\'use strict\';$2');
var GLOBALS = /\s*\/\* global[^*]+\*\/\s*/g;
//var USE_STRICT = /\s*'use strict';/g;

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
					
					var line = '// ====================================================================================================\n'; 
					filePath = filepath.replace('www/scripts', '');
					var header = '//      ..' + filepath.replace('www/scripts', '') + '\n';  
					
					return '\n\n' + line + header + line + '\n' + src;
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
		['jshint', 'clean', 'copy', 'concat']
	);

};