
class BrightnessMapFilter

  constructor:()->
    PIXI.AbstractFilter.call @
    @passes = [this]

    @uniforms =
      matrix0:
        type: 'mat2'
        value: [-0.25,-0.25,
                0.25,0.25]
      matrix90:
        type: 'mat2'
        value: [0.25,-0.25,
                0.25,-0.25]
      matrix45:
        type: 'mat3'
        value: [0,-0.25,0,
                0.25,0,-0.25,
                0,0.25,0]
      matrix135:
        type: 'mat3'
        value: [0,0.25,0,
                0.25,0,-0.25,
                0,-0.25,0]
      size:
        type: '1f'
        value: 1/512

    @fragmentSrc = [
      'precision mediump float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform mat2 matrix0;'
      'uniform mat3 matrix45;'
      'uniform mat2 matrix90;'
      'uniform mat3 matrix135;'
      'uniform float size;'

      # R = 0
      # G = 90
      # B = 45
      # A = 135

      'void main(void) {'
      '   vec4 result = vec4(0);'
      '   vec4 result00 = texture2D(uSampler, vTextureCoord)*3.0;'
      '   result.r += result00.r * matrix0[0][0];'
      '   result.g += result00.r * matrix90[0][0];'

      '   vec4 result10 = texture2D(uSampler, vTextureCoord-vec2(size,0))*3.0;'
      '   result.r += result10.r * matrix0[0][1];'
      '   result.g += result10.r * matrix90[0][1];'

      '   result.b += result10.r * matrix45[0][1];'
      '   result.a += result10.r * matrix135[0][1];'

      '   vec4 result01 = texture2D(uSampler, vTextureCoord-vec2(0,size))*3.0;'
      '   result.r += result01.r * matrix0[1][0];'
      '   result.g += result01.r * matrix90[1][0];'

      '   result.b += result01.r * matrix45[1][0];'
      '   result.a += result01.r * matrix135[1][0];'

      '   vec4 result11 = texture2D(uSampler, vTextureCoord-vec2(size,size))*3.0;'
      '   result.r += result11.r * matrix0[1][1];'
      '   result.g += result11.r * matrix90[1][1];'

      '   vec4 result12 = texture2D(uSampler, vTextureCoord-vec2(size,2.0*size))*3.0;'
      '   result.b += result12.r * matrix45[2][1];'
      '   result.a += result12.r * matrix135[2][1];'

      '   vec4 result21 = texture2D(uSampler, vTextureCoord-vec2(2.0*size,size))*3.0;'

      '   result.b += result21.r * matrix45[1][2];'
      '   result.a += result21.r * matrix135[1][2];'

      '   gl_FragColor = abs(result);'
      '}'
    ]

  BrightnessMapFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    size:
      get: ->
        @uniforms.size.value
      set: (value) ->
        @uniforms.size.value = value


