module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: ['script/app.js', 'script/**/*.js'],
				dest: 'Build/app.js'
			}
		},
		jshint: {
			all: ['script/**/*.js']
		}
	})

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'concat']);
}