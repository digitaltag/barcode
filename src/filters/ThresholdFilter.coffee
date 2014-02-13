
class ThresholdFilter

  constructor:()->
    #---
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      threshold:
        type: "1f"
        value: 0.11

    @fragmentSrc = [
      'precision mediump float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform float threshold;'

      'void main(void) {'
      '   vec4 value = texture2D(uSampler,vTextureCoord);'

      # Luminance calculations.
      # Luminance (standard, objective): (0.2126*R) + (0.7152*G) + (0.0722*B)
      # Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B)

      #'   float luminance = (0.2126*value.r) + (0.7152*value.g) + (0.0722*value.b);'
      #'   float luminance = (0.299*value.r) + (0.587*value.g) + (0.114*value.b);'

      # try taking into account only the r and g channels. nothing exists in b & a
      '   float luminance = ( value.r + value.g ) / 2.0;'
      '   if(luminance >= threshold){'
      '       luminance = 1.0;'
      '   }else{'
      '       luminance = 0.0;'
      '   }'
      '   gl_FragColor = vec4(luminance,luminance,luminance,1);'
      '}'
    ]

  ThresholdFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    threshold:
      get: ->
        @uniforms.threshold.value
      set: (value) ->
        @uniforms.threshold.value = value





