'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask("phantomizer-imgopt", "Optimize png/jpeg pictures", function () {

        var ph_libutil = require("phantomizer-libutil")
        var path = require('path')

        var sub_tasks = []
        var current_grunt_task = this.nameArgs

        var meta = ph_libutil.meta

        var wd = process.cwd()
        var meta_manager = new meta( wd )

        function find_in_paths(paths, src){
            for( var t in paths ){
                if( grunt.file.exists(paths[t]+src) ){
                    return path.resolve(paths[t]+src)
                }
            }
            return false
        }


        var options = this.options({
            optimizationLevel: 0
            ,"progressive":true
            ,out_dir: ""
            ,meta_dir: ""
            ,paths: []
            ,in_files: {}
        });

        grunt.verbose.writeflags(options, 'Options'); // debug call
        var out_dir = options.out_dir
        var meta_dir = options.meta_dir
        var paths = options.paths
        var files = options.in_files || {}
        var sub_task_options = {}


        for( var src_file in files ){
            var out_file = out_dir+"/"+files[src_file]
            var meta_file = meta_dir+"/"+files[src_file]+".meta"

            if( meta_manager.is_fresh(meta_file) == false ){

                var file = find_in_paths(paths,src_file);

                var deps = []
                deps.push(file)

                if ( grunt.file.exists(process.cwd()+"/Gruntfile.js")) {
                    deps.push(process.cwd()+"/Gruntfile.js")
                }
                deps.push(__filename)

                var sub_task_name = "jit"+sub_tasks.length
                sub_task_options[sub_task_name] = {
                    options: {
                        optimizationLevel: options.optimizationLevel
                        ,progressive: options.progressive
                    },
                    files: {
                    }
                }
                sub_task_options[sub_task_name].files[out_file] = file
                grunt.log.ok("Creating "+out_file)
                grunt.log.ok("optimizationLevel:"+options.optimizationLevel)

                // create a cache entry, so that later we can regen or check freshness
                var entry = meta_manager.create(deps)
                entry.require_task(current_grunt_task, options)
                entry.save(meta_file)

                //-

                grunt.config.set("imagemin", sub_task_options)
                sub_tasks.push( "imagemin"+":"+sub_task_name )
            }else{
                grunt.log.ok("your build is fresh !")
            }
        }

        grunt.task.run( sub_tasks )
    });

};