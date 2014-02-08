
module.exports = function(grunt) {

  var d = __dirname+"/vendors/phantomizer-imgopt";

  var in_dir = d+"/demo/in/";
  var out_dir = d+"/demo/out/";
  var meta_dir = d+"/demo/out/";


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    ,"out_dir":out_dir
    ,"meta_dir":meta_dir

    ,'phantomizer-imgopt': {                    // Task
      demo: {                                 // Target
        options: {                          // Target options
          optimizationLevel: 3
          ,"out_dir":'<%= out_dir %>'
          ,"meta_dir":'<%= meta_dir %>'
          ,paths:[in_dir]
          ,in_files: {
            'img.png':'img-opt.png'
            ,'img.jpg':'img-opt.jpg'
          }
        }
      },
      demo_0: {                               // Another target
        options: {                          // Target options
          optimizationLevel: 0
          ,"out_dir":'<%= out_dir %>'
          ,"meta_dir":'<%= meta_dir %>'
          ,paths:[in_dir]
          ,in_files: {
            'img_0.png':'img_0-opt.png'
            ,'img_0.jpg':'img_0-opt.jpg'
          }
        }
      }
    },
    docco: {
      debug: {
        src: [
          'tasks/build.js'
        ],
        options: {
          layout:'linear',
          output: 'documentation/'
        }
      }
    },
    'gh-pages': {
      options: {
        base: '.',
        add: true
      },
      src: ['documentation/**']
    },
    release: {
      options: {
        bump: true,
        add: false,
        commit: false,
        npm: false,
        npmtag: true,
        tagName: '<%= version %>',
        github: {
          repo: 'maboiteaspam/phantomizer-imgopt',
          usernameVar: 'GITHUB_USERNAME',
          passwordVar: 'GITHUB_PASSWORD'
        }
      }
    }
  });

  /*

   grunt.registerTask('default',
   [
   'phantomizer-imgopt:demo'
   ]);
   */
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-release');
  grunt.registerTask('cleanup-grunt-temp', [],function(){
    var wrench = require('wrench');
    wrench.rmdirSyncRecursive(__dirname + '/.grunt', !true);
    wrench.rmdirSyncRecursive(__dirname + '/documentation', !true);
  });

  // to generate and publish the docco style documentation
  // execute this
  // grunt
  grunt.registerTask('default', ['docco','gh-pages', 'cleanup-grunt-temp']);

  // to release the project in a new version
  // use one of those commands
  // grunt --no-write -v release # test only
  // grunt release:patch
  // grunt release:minor
  // grunt release:major
  // grunt release:prerelease
};
