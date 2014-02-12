child_process = require "child_process"

module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    # coffee
    coffee:
      client:
        options:
          join:true
        files:
          "deploy/barcode.js":"src/**/*.coffee"

    uglify:
      main:
        files:
          "bin/threeflow.min.js":"bin/threeflow.js"
          "bin/threeflow_datgui.min.js":"bin/threeflow_datgui.js"
    copy:
      examples:
        expand:true
        flatten:true
        src:"bin/*.*"
        dest: "examples/js/"

    watch:
      main:
        files:[ "src/**/*.coffee" ]
        tasks:["coffee"]

    connect:
      server:
        options:
          port:9000
          base:"deploy"


  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"

  grunt.registerTask "default",["dev"]
  grunt.registerTask "dev",["connect","watch"]

