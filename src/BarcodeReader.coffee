
class BarcodeReader
  constructor:()->
    @init()


  init:()->
    # Web Cam
    @videoElement = document.getElementById("webcam")
    @stream = new VideoStream @videoElement
    @stream.onConnected = @onConnected
    @captureStarted = false

    # Pixi
    @renderer = PIXI.autoDetectRenderer 400,300
    @stage    = new PIXI.Stage 0x343434
    document.body.appendChild @renderer.view
    requestAnimFrame @update

    # textures ( inited when capture started )
    @sourceTexture = null
    null

  onConnected:()=>
    console.log "Video Connected..."
    console.log "Init Pixi.."

    @initCapture()

    null

  initCapture:()->
    # init
    if @captureStarted
      return

    @captureStarted = true

    @sourceSprite = new VideoSprite @videoElement
    @stage.addChild @sourceSprite


    null



  update:()=>

    # update pixi texture if we have received webcam data
    #if @captureStarted
      #@context.drawImage @videoElement,0,0,@videoElement.width,@videoElement.height
      #PIXI.texturesToUpdate.push @sourceTexture

    @renderer.render @stage
    requestAnimFrame @update





