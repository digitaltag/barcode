
class VideoSprite
  constructor:( @videoElement )->
    @canvas = document.createElement "canvas"
    @canvas.width = @videoElement.width
    @canvas.height = @videoElement.height
    @context = @canvas.getContext "2d"

    texture = new PIXI.Texture.fromCanvas @canvas

    PIXI.Sprite.call @,texture

    #document.body.appendChild @canvas

  VideoSprite.prototype = Object.create PIXI.Sprite.prototype

  _renderWebGL:(renderSession)->
    @context.drawImage @videoElement,0,0,@videoElement.width,@videoElement.height

    PIXI.updateWebGLTexture(@texture.baseTexture, renderSession.gl);
    PIXI.Sprite.prototype._renderWebGL.call @,renderSession

    null



