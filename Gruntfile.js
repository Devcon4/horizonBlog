'use strict';

module.exports = function (grunt) {

	var vendor = grunt.file.readJSON("vendor.json");

	require('load-grunt-tasks')(grunt);

	//Using exclusion patterns slows down Grunt significantly
	//instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
	//this method is used to create a set of inclusive patterns for all subdirectories
	//skipping node_modules, bower_components, dist, and any .dirs
	//This enables users to create any directory structure they desire.
	var createFolderGlobs = function (fileTypePatterns) {
		fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
		var ignore = ['node_modules', 'bower_components', 'dist', 'temp', 'Scripts', 'obj', 'deploy'];
		var fs = require('fs');
		return fs.readdirSync(process.cwd())
			.map(function (file) {
				if (ignore.indexOf(file) !== -1 ||
					file.indexOf('.') === 0 ||
					!fs.lstatSync(file).isDirectory()) {
					return null;
				} else {
					return fileTypePatterns.map(function (pattern) {
						return file + '/**/' + pattern;
					});
				}
			})
			.filter(function (patterns) {
				return patterns;
			})
			.concat(fileTypePatterns);
	};

	// Project configuration.
	grunt.initConfig({
		msbuild: {
			src: ['../RPS.sln'],
			options: {
				targets: ['Build'],
				verbosity: 'quiet'
			}
		},
		ts: {
			options: {
			},
			default: {
				options: { fast: "always" },
				tsconfig: 'tsconfig.json'
			}
		},
		copy: {
			environmentDev: {
				files: [
					{
						expand: true, cwd: "", src: "config/environment.dev.ts", dest: 'app/',
						rename: function (dest, src) {
							return dest + "environment.ts";
						}
					}
				]
			},
			environmentDist: {
				files: [
					{ expand: true, cwd: "", src: "config/environment.prod.ts", dest: 'app/',
						rename: function (dest, src) {
							return dest + "environment.ts";
						}
					 }
				]
			},
			htmlDist: {
				files: [
					{ expand: true, cwd: '', src: ['app/**/*.html'], dest: 'dist/' },
				]
			},
			imgDev: {
				files: [
					{ expand: true, cwd: '', src: ['img/**'], dest: 'temp/build/' }
				]
			},
			imgDist: {
				files: [
					{ expand: true, cwd: '', src: ['img/**'], dest: 'dist/' }
				]
			},
			fontsDist: {
				files: [
					{ expand: true, cwd: 'bower_components/bootstrap/fonts', src: '**', dest: 'dist/bower_components/bootstrap/fonts' },
					{ expand: true, cwd: 'node_modules/font-awesome/fonts', src: '**', dest: 'dist/node_modules/font-awesome/fonts' },
					{ expand: true, cwd: 'fonts', src: '**', dest: 'dist/fonts/' }
				]
			},
			maintDist: {
				files: [
					{ expand: true, cwd: 'maintenance/dist', src: '**', dest: 'dist/maintenance' }
				]
			},
			deploy: {
				files: [
					{ expand: true, src: ['Global.asax'], dest: 'deploy/' },
					{ expand: true, src: ['Web.config'], dest: 'deploy/' },
					{ expand: true, cwd: 'dist', src: ['**'], dest: 'deploy/' },
					{ expand: true, cwd: 'bin', src: ['**'], dest: 'deploy/bin/' }
				]
			},
			systemJsDist: {
				files: [
					{ expand: true, cwd: "", src: "systemjs.config.js", dest: 'dist/' }
				]
			},
			ieshim: {
				files: [
					{ expand: true, cwd: "node_modules/es6-shim/", src: "es6-shim.min.js", dest: 'temp/build/' },
					{ expand: true, cwd: "node_modules/systemjs/dist/", src: "system-polyfills.js", dest: 'temp/build/' }
				]
			},
			ieshimdist: {
				files: [
					{ expand: true, cwd: "node_modules/es6-shim/", src: "es6-shim.min.js", dest: 'dist/' },
					{ expand: true, cwd: "node_modules/systemjs/dist/", src: "system-polyfills.js", dest: 'dist/' }
				]
			}
		},
		clean: {
			preDev: ['temp/build/*', 'app/**/*.js*', '!app/router.config.js', 'app/**/*.css', '.tscache'],
			preTest: ['temp/**/*', 'app/**/*.js*', '!app/router.config.js', 'app/**/*.css'],
			preDist: ['dist/**', 'app/**/*.js*', '!app/router.config.js', 'app/**/*.css'],
			deploy: ['deploy']
		},
		less: {
			dev: {
				options: {
					compress: true,
					sourceMap: true,
					sourceMapFileInline: true,
					banner: "/*DON'T TOUCH THIS FILE, THIS IS COMPILED!*/"
				},
				files: [
					{
						expand: true,
						cwd: "",
						src: ["main.less"],
						dest: '',
						ext: '.css',
						extDot: 'last'
					},
					{
						expand: true,
						cwd: "app",
						src: ["**/*.less", "!style/**/*.less"],
						dest: 'app',
						ext: '.css',
						extDot: 'last'
					}
				]
			},
			dist: {
				options: {
					compress: true,
					sourceMap: false,
				},
				files: [
					{
						expand: true,
						cwd: "",
						src: ["main.less"],
						dest: 'dist/',
						ext: '.css',
						extDot: 'last'
					},
					{
						expand: true,
						cwd: "app",
						src: ["**/*.less", "!style/**/*.less"],
						dest: 'dist/app',
						ext: '.css',
						extDot: 'last'
					}
				]
			}
		},
		exec: {
			maintDist: {
				cmd: 'grunt dist',
				cwd: 'maintenance/'
			},
			tsDev: {
				cmd: 'tsc',
				cwd: './'
			}
		},
		systemjs: {
			options: {
				baseURL: ".",
				configFile: "./systemjs.config.js",
				sfx: false
			},
			dist: {
				options: {
					sourceMaps: false
				},
				files: [{ src: "./main.js", dest: "./dist/app.min.js" }]
			}
		},
		dom_munger: {
			dist: {
				options: {
					update: [
						{ selector: "html base", attribute: 'href', value: '.' },
						{ selector: "#style", attribute: 'href', value: 'main.css' },
						{ selector: "#vendor_scripts", attribute: "src", value: 'vendor.js' },
						{ selector: "#app_scripts", attribute: "src", value: 'app.min.js' }
					]
				},
				src: 'index.html',
				dest: 'dist/index.html'
			}
		},
		concat: {
			options: {
				separator: ';\n',
				sourceMap: true
			},
			vendorDev: {
				src: vendor.vendor,
				dest: 'temp/build/vendor.js'
			},
			vendorDist: {
				options: {
					sourceMap: false
				},
				src: vendor.vendor,
				dest: 'dist/vendor.js'
			}
		},
		watch: {
			options: {
				livereload: true,
				atBegin: false,
				event: ['changed', 'added', 'deleted'],
				interrupt: true,
				interval: 200
			},
			html: {
				files: ['app/**/*.html', 'index.html'],
				tasks: []
			},
			ts: {
				files: ['app/**/*.ts', 'system-config.ts', 'main.ts'],
				tasks: ['ts']
			},
			less: {
				files: ['app/**/*.less', 'main.less', 'style/*.less'],
				tasks: ['less:dev']
			}
		},
		karma: {
			unit: { configFile: 'config/karma.conf.js' },
			single: {
				configFile: 'karma.conf.js',
				singleRun: true
			},
			teamcity: { configFile: 'config/karma.teamcity.conf.js'	}
		},
		concurrent: {
		}
	});

	grunt.registerTask('build', [
		'copy:environmentDev',
		'ts',
		'concat:vendorDev',
		'less:dev',
		'copy:imgDev',
		'copy:ieshim']);
	grunt.registerTask('rebuild', ['clean:preDev', 'build']);
	grunt.registerTask('w', ['build', 'watch']);
	grunt.registerTask('retry', ['build', 'watch']);
	grunt.registerTask('test', ['build','karma:unit']);
	grunt.registerTask('singletest', ['build','karma:single']);
	grunt.registerTask('dist', [
		'clean:preDev',
		'clean:preDist',
		'copy:environmentDist',
		'exec:maintDist',
		'ts',
		'concat:vendorDist',
		'copy:htmlDist',
		'less:dist',
		'systemjs:dist',
		'copy:imgDist',
		'copy:fontsDist',
		'copy:systemJsDist',
		'dom_munger:dist',
		'copy:maintDist',
		'copy:ieshimdist']);
	grunt.registerTask('deploy', [
		'clean:deploy',
		'dist',
		'copy:deploy'
	]);
};