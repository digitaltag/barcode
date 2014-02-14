
# Quick implementation of edge detection
# Used after a threshold filter.


class FastEdgeFilter

  constructor:()->
    #---
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      size:
        type: "1f"
        value: 1/512

    @fragmentSrc = [
      'precision mediump float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform float size;'

      'void main(void) {'
      '   vec4 value = texture2D(uSampler,vTextureCoord);'
      '   vec4 up = texture2D(uSampler,vTextureCoord+vec2(0,size));'
      '   vec4 down = texture2D(uSampler,vTextureCoord+vec2(0,-size));'
      '   vec4 left = texture2D(uSampler,vTextureCoord+vec2(-size,0));'
      '   vec4 right = texture2D(uSampler,vTextureCoord+vec2(size,0));'

      '   int count = 0;'
      '   if(up.r >= 1.0){'
      '       count++;'
      '   }'
      '   if(down.r >= 1.0){'
      '       count++;'
      '   }'
      '   if(left.r >= 1.0){'
      '       count++;'
      '   }'
      '   if(right.r >= 1.0){'
      '       count++;'
      '   }'
      '   if(count == 1){'
      '       value = vec4(1);'
      '   }else{'
      '       value = vec4(0);'
      '       value.a = 1.0;'
      '   }'
      '   gl_FragColor = value;'
      '}'
    ]

  FastEdgeFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    size:
      get: ->
        @uniforms.size.value
      set: (value) ->
        @uniforms.size.value = value





