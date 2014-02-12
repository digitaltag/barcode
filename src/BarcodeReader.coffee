
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

    # textures & sprites ( inited when capture started )
    @sourceTexture = null
    @videoSprite = null
    @imageSprite = null

    # create filters
    @grayscaleFilter = new GrayScaleFilter()
    @brightnessMapFilter = new BrightnessMapFilter()
    @gaussianBlurFilter = new PIXI.BlurFilter()
    @gradientDifferenceFilter = new GradientDifferenceFilter()

    # enable or disable filters
    @enableGrayScale = true
    @enableBrightnessMap = false
    @enableGaussian = false
    @enableGradientDifference = false

    @initImageCapture()

    null

  onConnected:()=>
    console.log "Video Connected..."
    console.log "Init Pixi.."

    @initVideoCapture()

    null

  initImageCapture:()->
    @imageSprite = new PIXI.Sprite PIXI.Texture.fromImage("barcode.png")
    @stage.addChild @imageSprite

    null

  initVideoCapture:()->
    # init
    if @captureStarted
      return

    @captureStarted = true

    if @imageSprite
      @stage.removeChild @imageSprite

    @videoSprite = new VideoSprite @videoElement
    @stage.addChild @videoSprite

    @updateFilters()

    null

  updateFilters:()->
    if @videoSprite
      sourceSprite = @videoSprite
    else
      sourceSprite = @imageSprite

    filters = []

    if @enableGrayScale
      filters.push @grayscaleFilter
    if @enableBrightnessMap
      filters.push @brightnessMapFilter
    if @enableGaussian
      filters.push @gaussianBlurFilter
    if @enableGradientDifference
      filters.push @gradientDifferenceFilter

    if filters.length
      sourceSprite.filters = filters
    else
      sourceSprite.filters = null

    null

  update:()=>
    @renderer.render @stage
    requestAnimFrame @update





