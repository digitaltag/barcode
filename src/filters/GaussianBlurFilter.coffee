class GaussianBlurFilter
  constructor:( x = 1.0, y = 0.0 )->
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      direction:
        type: "2f"
        value:
          x: x
          y: y

    @fragmentSrc = [
      'precision highp float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform vec2 direction;'

      'void main(void) {'
      '   vec4 sum = vec4(0);'

      '   sum += texture2D(uSampler, vTextureCoord - (direction*4.0) * 0.05;'
      '   sum += texture2D(uSampler, vTextureCoord - direction*3.0) * 0.09;'
      '   sum += texture2D(uSampler, vTextureCoord - direction*2.0) * 0.12;'
      '   sum += texture2D(uSampler, vTextureCoord - direction) * 0.15;'
      '   sum += texture2D(uSampler, vTextureCoord) * 0.18;'
      '   sum += texture2D(uSampler, vTextureCoord + direction) * 0.15;'
      '   sum += texture2D(uSampler, vTextureCoord + direction*2.0) * 0.12;'
      '   sum += texture2D(uSampler, vTextureCoord + direction*3.0) * 0.09;'
      '   sum += texture2D(uSampler, vTextureCoord + direction*4.0) * 0.05;'

      '   gl_FragColor = abs(sum);'
      '}'
    ]

  GaussianBlurFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  # set the blur direction.
  set:(x,y)->
    @uniforms.direction.value.x = x
    @uniforms.direction.value.y = y
    null