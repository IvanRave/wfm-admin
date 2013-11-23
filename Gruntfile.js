module.exports = function (grunt) {
    'use strict';
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-bump');

    var isProd = grunt.option('prod') ? true : false;
        
    var requrl = grunt.option('requrl') || 'http://wfm-client.azurewebsites.net';
    
    var trgt = isProd ? 'dst' : 'dev';
    
    // Project configuration
    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),
        trgt: trgt,
        src: 'src',
        bowerFolder: 'bower_components',
        // Banner for scripts comments: author, licence etc.
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= pkg.license %> */\n',
        uniqueString: '<%= pkg.version %>',
        connect: {
            main: {
                options: {
                    open: true,
                    keepalive: true,
                    port: 54321,
                    base: '<%= trgt %>'
                }
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            app: {
                options: {
                    jshintrc: '<%= src %>/js/.jshintrc'
                },
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= src %>/js/',
                    src: ['app/**/*.js', 'main.js']
                }]
            }
        },
        clean: {
            main: ['<%= trgt %>']
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= src %>/',
                    dest: '<%= trgt %>/',
                    // Copy all files besides templates and app scripts (which assembled separately)
                    src: ['**/*', '!tpl/**/*', '!js/app/**/*', '!js/main.js']
                }]
            },
            bower_js: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerFolder %>/',
                    dest: '<%= trgt %>/js/',
                    src: ['jquery/jquery.js', 'moment/moment.js', 'angular/angular.js', 
                        'angular-route/angular-route.js', 'bootstrap/dist/js/bootstrap.js',
                        'requirejs/require.js', 'knockout/knockout.js']
                }]
            },
            bower_css: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerFolder %>/',
                    dest: '<%= trgt %>/css/',
                    src: ['bootstrap/dist/css/bootstrap.css', 'bootstrap/dist/css/bootstrap-theme.css']
                }]
            },
            bower_fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bowerFolder %>/',
                    dest: '<%= trgt %>/fonts/',
                    src: ['bootstrap/dist/fonts/*']
                }]
            }
        },
        assemble: {
            options: {
                engine: 'handlebars',
                // Main properties
                // TODO: Change "en" to <%= lang %> parameters - it doesn't work yet for second time of using
                data: ['<%= src %>/tpl/data/syst.json', '<%= bowerFolder %>/wfm-dict/lang/en/lang.json', 'package.json'],
                // Build configuration properties
                conf: {
                    // Request url (begin of the path)
                    // if exists - other domain (CORS requests - for local testing and side programs)
                    // if empty - the same domain (simple requests)
                    // Example {{requrl}}/api/values
                    requrl: requrl,
                    isProd: isProd
                }
            },
            html: {
                options: {
                    partials: ['<%= src %>/tpl/partials/*.hbs']
                },
                files: [{
                    expand: true,
                    cwd: '<%= src %>/tpl/pages/',
                    src: '**/*.hbs',
                    dest: '<%= trgt %>'
                }]
            },
            readme: {
                options: {
                    ext: '.md'
                },
                files: {
                    './README': 'README.md.hbs'
                }
            },
            // Assemble js files after copy in dest directory
            js: {
                options: {
                    ext: '.js'
                },
                files: [{
                    expand: true,
                    cwd: '<%= src %>/js/',
                    src: ['app/**/*.js', 'main.js'],
                    dest: '<%= trgt %>/js/'
                }]
            }
        },
        bump: {
          options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: ['pkg'],
            commit: false,
            //commitMessage: 'Release v%VERSION%',
            //commitFiles: ['-a'],
            //createTag: true,
            //tagName: 'v%VERSION%',
            //tagMessage: 'Version %VERSION%',
            push: false,
            //pushTo: 'origin'
          }
        },
        // For development: run tasks when change files
        watch: {
            jshint_gruntfile: {
                files: ['<%= jshint.gruntfile.src %>'],
                tasks: ['jshint:gruntfile']
            },
            jshint_app: {
                options: {
                    spawn: false
                },
                files: ['<%= src %>/js/app/**/*.js', '<%= src %>/js/main.js'],
                tasks: ['jshint:app']
            },
            copy_main: {
                options: {
                    cwd: '<%= src %>/',
                    spawn: false
                },
                files: ['**/*', '!tpl/**/*', '!js/app/**/*', '!js/main.js'],
                tasks: ['copy:main']
            },
            // Update all template pages when change template data
            assemble_data: {
                files: ['<%= src %>/tpl/data/syst.json', '<%= bowerFolder %>/wfm-dict/lang/en/lang.json', 'package.json'],
                tasks: ['assemble:html', 'assemble:js']
            },
            assebmle_readme: {
                files: ['README.md.hbs', 'package.json'],
                tasks: ['assemble:readme']
            },
            assemble_html: {
                files: ['<%= src %>/tpl/**/*.hbs'],
                tasks: ['assemble:html']
            },
            assemble_js: {
                options: {
                    spawn: false
                },
                files: ['<%= src %>/js/app/**/*.js', '<%= src %>/js/main.js'],
                tasks: ['assemble:js']
            }
        }
    });

    // Default task
    var tasks = [
      'jshint:gruntfile',
      'jshint:app',
      'clean:main',
      'copy:main',
      'copy:bower_js',
      'copy:bower_css',
      'copy:bower_fonts',
      'assemble:js',
      'assemble:html',
      'assemble:readme'
    ];

    grunt.registerTask('default', tasks);
};