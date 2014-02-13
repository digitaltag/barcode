
class ThresholdAreaFilter

  constructor:()->
    #---
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      threshold:
        type: "1f"
        value: 0.5

    @fragmentSrc = [
      'precision mediump float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform float threshold;'

      'void main(void) {'
      '   vec4 value = texture2D(uSampler,vTextureCoord);'
      '   vec4 up = texture2D(uSampler,vTextureCoord+vec2(0,0.001));'
      '   vec4 down = texture2D(uSampler,vTextureCoord+vec2(0,-0.001));'
      '   vec4 left = texture2D(uSampler,vTextureCoord+vec2(-0.001,0));'
      '   vec4 right = texture2D(uSampler,vTextureCoord+vec2(-0.001,0));'

      # applying to a black white image so only check one channel
      '   int count = 0;'
      '   if(up.r >= threshold){'
      '       count++;'
      '   }'
      '   if(down.r >= threshold){'
      '       count++;'
      '   }'
      '   if(left.r >= threshold){'
      '       count++;'
      '   }'
      '   if(right.r >= threshold){'
      '       count++;'
      '   }'
      '   if(count > 0){'
      '       value = vec4(1);'
      '   }'
      '   gl_FragColor = value;'
      '}'
    ]

  ThresholdAreaFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    threshold:
      get: ->
        @uniforms.threshold.value
      set: (value) ->
        @uniforms.threshold.value = value





