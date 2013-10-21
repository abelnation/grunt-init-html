'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    
    "name": "my-project-name",
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    env : {
      options : {
          /* Shared Options Hash */
          //globalOption : 'foo'
      },
      dev: {
          NODE_ENV : 'DEVELOPMENT',
          DEST: "build/dev"
      },
      prod : {
          NODE_ENV : 'PRODUCTION',
          DEST: "build/prod"
      }
    },
    
    preprocess : {
      dev : {
        src : './index.html',
        dest : '<%= env.dev.DEST %>/' + 'index.html'
      },
      prod : {
        src : './index.html',
        dest : '<%= env.prod.DEST %>/' + 'index.html',
        options : {
          context : {
            name : '<%= pkg.name %>',
            version : '<%= pkg.version %>',
            now : '<%= now %>',
            ver : '<%= ver %>'
          }
        }
      }
    },

    clean: {
      files: ['css/{%= name %}.css', 'js/<%= pkg.name %>.min.js', 'js/<%= pkg.name %>.js', 'build/**']
    },

    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'compressed',
          compass: true,
        },
        files: {                         // Dictionary of files
          'css/{%= name %}.min.css': 'scss/{%= name %}.scss',       // 'destination': 'source'
        }
      },
      dev: {
        options: {                       // Target options
          style: 'expanded',
          compass: true,
          lineNumbers: true,
        },
        files: {                         // Dictionary of files
          'css/{%= name %}.css': 'scss/{%= name %}.scss',       // 'destination': 'source'
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        separator: ';'
      },
      dist: {
        src: ['js/src/**/*.js'],
        dest: 'js/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'js/<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'js/.jshintrc'
        },
        src: ['js/src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },

    copy: {
      prod:  {
        files: [
          // Copy require.js file from dev/libs/require/ to prod/scripts/.
          { expand: true,  src: ['js/lib/**'], dest: '<%= env.prod.DEST %>' } ,
          { expand: true,  src: ['<%= uglify.dist.dest %>'], dest: '<%= env.prod.DEST %>/' } ,
          // { expand: true,  src: ['*.html'], dest: '<%= env.prod.DEST %>' } ,
          { expand: true,  src: ['css/**'], dest: '<%= env.prod.DEST %>' } ,
          { expand: true, src: ['img/**'], dest: '<%= env.dev.DEST %>' } ,
        ]
      },
      dev: {
        files: [
          { expand: true,  src: ['js/lib/**'], dest: '<%= env.dev.DEST %>' } ,
          { expand: true,  src: ['js/src/**'], dest: '<%= env.dev.DEST %>' } ,
          // { expand: true,  src: ['*.html'], dest: '<%= env.dev.DEST %>' } ,
          { expand: true,  src: ['css/**'], dest: '<%= env.dev.DEST %>' } ,
          { expand: true, src: ['img/**'], dest: '<%= env.dev.DEST %>' } ,
        ]
      }
    },

    connect: {
      dev: {
        options: {
          port: 8081,
          base: 'build/dev/',
          keepalive: true,
          open: true
        }
      },
      prod: {
        options: {
          port: 8081,
          base: 'build/prod/',
          keepalive: true
        }
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      sass: {
        files: '**/*.scss',
        tasks: ['sass']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['env:dev', 'preprocess:dev', 'jshint', 'sass', 'copy:dev', 'qunit']);
  grunt.registerTask('prod', ['env:prod', 'preprocess:prod', 'jshint', 'concat', 'uglify', 'copy:prod', 'sass']);
};