
class GradientDifferenceFilter

  constructor:()->
    #---
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms = {}

    @fragmentSrc = [
      'precision highp float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'

      'void main(void) {'
      '   vec4 result = vec4(0);'
      '   vec4 value = texture2D(uSampler,vTextureCoord);'

      '   result.r = value.g - value.r;'
      '   result.g = value.b - value.a;'
      '   result.b = 0.0;'
      '   result.a = 1.0;'

      '   gl_FragColor = result;'
      '}'
    ]





