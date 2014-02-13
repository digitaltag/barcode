
class GradientDifferenceFilter

  constructor:()->
    #---
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      multiplier:
        type: "1f"
        value: 2.5

    @fragmentSrc = [
      'precision mediump float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform float multiplier;'

      'void main(void) {'
      '   vec4 value = texture2D(uSampler,vTextureCoord);'
      '   vec4 result = vec4(0);'

      '   result.r = value.r - value.g;'
      '   result.g = value.b - value.a;'
      '   result.b = 0.0;'
      '   result.a = 1.0;'
      '   result.r = result.r * multiplier;'
      '   result.g = result.g * multiplier;'

      '   gl_FragColor = abs(result);'
      '}'
    ]

  GradientDifferenceFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    multiplier:
      get: ->
        @uniforms.multiplier.value
      set: (value) ->
        @uniforms.multiplier.value = value





