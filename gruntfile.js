'use strict';

var tasks = require('load-grunt-tasks');
var time  = require('time-grunt');

module.exports = function (grunt) {
    time(grunt);
    tasks(grunt);

    grunt.initConfig({
        bumpup: {
            files: [
                'package.json',
                'bower.json'
            ]
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },

            src: [
                '**/*.js',
                '!demo/**/*.js',
                '!dist/**/*.js',
                '!node_modules/**/*.js'
            ]
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },

            src: [
                '**/*.js',
                '**/*.json',
                '!node_modules/**/*.js',
                '!node_modules/**/*.json',
                '!dist/**/*.js',
                '!demo/**/*.js'
            ]
        },

        webpack: {
            options: {
                module: {
                    loaders: [{
                        exclude: /(node_modules|bower_components)/,
                        loader: 'babel',
                        query: {
                            stage: 0
                        }
                    }]
                }
            },

            vanilla: {
                entry: {
                    lory: './src/lory'
                },

                output: {
                    path: __dirname + '/dist/',
                    filename: 'lory.js',
                    library: 'lory',
                    libraryTarget: 'umd'
                }
            },

            jquery: {
                entry: {
                    lory: './src/jquery.lory.js'
                },

                output: {
                    path: __dirname + '/dist/',
                    filename: 'jquery.lory.js'
                }
            }
        },

        uglify: {
            all: {
                files: [
                    {
                        cwd: 'dist/',
                        src: [
                            '*.js',
                            '!*.min.js'
                        ],

                        dest: 'dist/',
                        ext: '.min.js',
                        extDot: 'last',
                        filter: 'isFile',
                        expand: true
                    }
                ]
            }
        },

        concat: {
            dist: {
                src: ['src/lory.js', 'src/jquery.plugin.js'],
                dest: 'dist/jquery.lory.js'
            }
        },

        copy: {
            demo: {
                src: 'dist/*',
                dest: 'demo/js/',
                flatten: true,
                filter: 'isFile',
                expand: true
            }
        },

        browserSync: {
            all: {
                src: [
                    'demo/**',
                    'dist/**'
                ]
            },

            options: {
                watchTask: true,
                port: 3002,

                server: {
                    baseDir: './demo/'
                }
            }
        },

        watch: {
            all: {
                files: [
                    'src/**',
                    'demo/*.css',
                    'Gruntfile.js'
                ],

                tasks: [
                    'build-dev'
                ]
            }
        },

        notify: {
            all: {
                options: {
                    title: 'lory!',
                    message: 'A new build is ready!'
                }
            }
        },

        module: {
            'check-repository': {
                options: {
                    check: true
                }
            },

            'license-copyright': {
                options: {
                    replace: true,
                    line: 3
                },

                src: 'LICENSE'
            },

            'release-publish': {
                options: {
                    release: true,
                    publish: true
                }
            }
        },

        karma: {
            all: {
                options: {
                    configFile: 'karma.conf.js',

                    frameworks: [
                        'mocha',
                        'chai',
                        'fixture'
                    ],

                    files: [
                        'dist/lory.js',
                        'test/lory.test.js',
                        'demo/app.css',

                        {
                            pattern: 'test/*.html'
                        }
                    ],

                    plugins: [
                        'karma-mocha',
                        'karma-mocha-reporter',
                        'karma-chai',
                        'karma-fixture',
                        'karma-html2js-preprocessor'
                    ],

                    preprocessors: {
                        'test/*.html': ['html2js']
                    }
                }
            }
        }
    });

    grunt.registerTask('build', [
        // 'jscs',
        // 'jshint',
        'concat',
        'webpack',
        'uglify',
        'copy:demo'
    ]);

    grunt.registerTask('build-dev', [
        // 'jscs',
        // 'jshint',
        'concat',
        'webpack',
        'uglify',
        'notify',
        'copy:demo'
    ]);

    grunt.registerTask('lint', [
        'jscs',
        'jshint'
    ]);

    grunt.registerTask('start', [
        'build-dev',
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('publish', function (type) {
        grunt.task.run('build');
        grunt.task.run('module:check-repository');
        grunt.task.run('bumpup:' + type);
        grunt.task.run('module:license-copyright');
        grunt.task.run('module:release-publish');
    });

    grunt.registerTask('default', 'build');
};
