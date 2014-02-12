
class GrayScaleFilter
  constructor:()->
    PIXI.AbstractFilter.call @

    @passes = [@]

    @uniforms =
      dotVec:
        type: "3f"
        value:
          x: 0.299
          y: 0.587
          z: 0.114

    @fragmentSrc = [
      'precision lowp float;'
      'uniform sampler2D uSampler;'
      'varying vec2 vTextureCoord;'
      'varying vec4 vColor;'
      'uniform vec3 dotVec;'

      'void main(void) {'
      '   float grayscale = dot(texture2D(uSampler,vTextureCoord).rgb, dotVec);'
      '   gl_FragColor = vec4(grayscale,grayscale,grayscale,1);'
      '}'
    ]

  GrayScaleFilter.prototype = Object.create PIXI.AbstractFilter.prototype

  Object.defineProperties @::,
    r:
      get: ->
        @uniforms.dotVec.value.x
      set: (value) ->
        @uniforms.dotVec.value.x = value
    g:
      get: ->
        @uniforms.dotVec.value.y
      set: (value) ->
        @uniforms.dotVec.value.y = value
    b:
      get: ->
        @uniforms.dotVec.value.z
      set: (value) ->
        @uniforms.dotVec.value.z = value

