'use strict';

exports.description = 'Create a basic html/sass/css/js project.';

exports.notes = 'yeah, html!';

exports.after = 'Now you need to install project and dev dependencies by running:' +
  '\n\n' +
  'npm install && bower install';

exports.warnOn = '*';

exports.template = function(grunt, init, done){

  init.process({ type: 'html'}, [
    init.prompt('name'),
    init.prompt('description'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('licenses', 'MIT'),
    init.prompt('version', '0.0.0'),
    init.prompt('node_version', '>= 0.10.0'),
  ], function(err, props){
    // A few additional properties.
    
    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'js/lib/**'});

    props.npm_test = 'grunt qunit';
    props.devDependencies = {
      'grunt-contrib-sass': '~0.5.0',
      'grunt-contrib-jshint': '~0.6.0',
      'grunt-contrib-qunit': '~0.2.0',
      'grunt-contrib-concat': '~0.3.0',
      'grunt-contrib-uglify': '~0.2.0',
      'grunt-contrib-watch': '~0.4.0',
      "grunt-contrib-copy": "~0.4.1",
      "grunt-contrib-clean": "~0.5.0",
      'grunt-preprocess': '~3.0.0',
      'grunt-env': '~0.4.0',
      'grunt-contrib-connect': '~0.5.0',
    };
    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', props);

    // All done!
    done();

  });
};
