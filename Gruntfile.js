
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
        }
    });

    grunt.loadNpmTasks('phantomizer-imgopt');


    grunt.registerTask('default',
        [
            'phantomizer-imgopt:demo'
        ]);
};
