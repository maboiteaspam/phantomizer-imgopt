'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var ph_libutil = require("phantomizer-libutil");

  grunt.registerMultiTask("phantomizer-imgopt", "Optimize png/jpeg pictures", function () {


    var sub_tasks = []
    var current_grunt_task = this.nameArgs;

    var options = this.options({
      optimizationLevel: 0
      ,"progressive":true
      ,"cache":false
      ,out_dir: ""
      ,paths: []
      ,in_files: {}
    });

    grunt.verbose.writeflags(options, 'Options'); // debug call
    var out_dir = options.out_dir;
    var paths = options.paths;
    var files = options.in_files || {};
    var sub_task_options = {};

    var current_task_name = "phantomizer-imgopt";


    var Phantomizer = ph_libutil.Phantomizer;
    var phantomizer = new Phantomizer(process.cwd(),grunt);
    var meta_manager = phantomizer.get_meta_manager();

    for( var src_file in files ){
      var out_file = out_dir+"/"+files[src_file];
      var meta_file = "/"+files[src_file]+"";
      var meta_infile = src_file+"";

      if( meta_manager.is_fresh(meta_file) == false
        && meta_manager.is_fresh(meta_infile,current_task_name+src_file) == false ){

        var file = find_in_paths(paths,src_file);

        // create a cache entry, so that later we can regen or check freshness
        var entry = meta_manager.create([]);
        entry.append_dependency( __filename )
        entry.append_dependency( file )

        var sub_task_name = "jit"+sub_tasks.length;
        sub_task_options[sub_task_name] = {
          options: {
            cache: options.cache,
            optimizationLevel: options.optimizationLevel
            ,progressive: options.progressive
          },
          files: {
          }
        }
        sub_task_options[sub_task_name].files[out_file] = file;
        grunt.log.ok("Creating "+out_file)
        grunt.log.ok("optimizationLevel:"+options.optimizationLevel)

        entry.require_task(current_grunt_task, options);
        entry.save(meta_file);

        //-

        grunt.config.set("imagemin", sub_task_options)
        sub_tasks.push( "imagemin"+":"+sub_task_name )
      }else{
        grunt.log.ok("your build is fresh !\n\t"+out_file)
      }
    }

    grunt.task.run( sub_tasks )
  });


  function find_in_paths(paths, src){
    for( var t in paths ){
      if( grunt.file.exists(paths[t]+src) ){
        return path.resolve(paths[t]+src)
      }
    }
    return false
  }

  grunt.registerMultiTask("phantomizer-dir-imgopt", "Optimize png/jpeg pictures", function () {

    var sub_tasks = []
    var current_target = this.target;

    var options = this.options({
      optimizationLevel: 2
      ,"progressive":true
      ,"cache":false
      ,"pngquant":true
      ,"interlaced":true
      ,paths: []
      ,out_path: ""
      ,pattern: '**/*.{png,jpg,jpeg,gif}'
      ,outputFormat: "progress"
    });

    grunt.verbose.writeflags(options, 'Options');

    var paths = options.paths;
    var out_path = options.out_path;
    if(paths.toLowerCase) paths = [paths];

    for( var n in paths ){
      var p = paths[n];
      var sub_task_name = "imgmin"+sub_tasks.length;

      p = path.normalize(p);

      var sub_task_options = grunt.config.get("imagemin") || {};
      sub_task_options = clone_subtasks_options(sub_task_options, sub_task_name, current_target);
      sub_task_options[sub_task_name].options.verbose = true;
      sub_task_options[sub_task_name] = {
        options: {
          cache: options.cache,
          optimizationLevel: options.optimizationLevel,
          progressive: options.progressive,
          pngquant: options.pngquant,
          interlaced: options.interlaced,
          outputFormat: options.outputFormat
        },
        files: [{
          expand: true,
          cwd: p+'',
          src: options.pattern,
          dest: out_path
        }]
      };
      grunt.log.ok("Optimizing images\n\t"+p);
      grunt.config.set("imagemin", sub_task_options)
      sub_tasks.push( "imagemin"+":"+sub_task_name )
    }

    grunt.task.run( sub_tasks )
  });

  function clone_subtasks_options(task_options, task_name, current_target){
    var _ = grunt.util._;
    if( task_options[current_target] ) task_options[task_name] = _.clone(task_options[current_target], true);
    if( !task_options[task_name] ) task_options[task_name] = {};
    if( !task_options[task_name].options ) task_options[task_name].options = {};
    return task_options;
  }

};