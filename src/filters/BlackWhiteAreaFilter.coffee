
class BlackWhiteAreaFilter

  constructor:()->
    #---
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      upper:
        type: "1f"
        value: 0.8
      lower:
        type: "1f"
        value: 0.2

    @fragmentSrc = [
      'precision mediump float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform float upper;'
      'uniform float lower;'

      'void main(void) {'
      '   vec4 pix = texture2D(uSampler,vTextureCoord);'
      '   vec4 result;'
      # Luminance calculations.
      # Luminance (standard, objective): (0.2126*R) + (0.7152*G) + (0.0722*B)
      # Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B)

      #'   float luminance = (0.2126*value.r) + (0.7152*value.g) + (0.0722*value.b);'

      '   float luminance = (0.299*pix.r) + (0.587*pix.g) + (0.114*pix.b);'
      '   if(luminance <= lower){'
      '       result = vec4(luminance,luminance,luminance,1);'
      '   }else'
      '   if(luminance >= upper ){'
      '       result = vec4(luminance,luminance,luminance,1);'
      '   }else{'
      '       result = vec4(0);'
      '   }'
      '   gl_FragColor = result;'
      '}'
    ]

  BlackWhiteAreaFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    upper:
      get: ->
        @uniforms.upper.value
      set: (value) ->
        @uniforms.upper.value = value
    lower:
      get: ->
        @uniforms.lower.value
      set: (value) ->
        @uniforms.lower.value = value





