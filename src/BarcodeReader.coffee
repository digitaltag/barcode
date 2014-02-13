
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
    @renderer = PIXI.autoDetectRenderer @videoElement.width,@videoElement.height
    @stage    = new PIXI.Stage 0x343434
    document.body.appendChild @renderer.view
    requestAnimFrame @update

    # textures & sprites ( inited when capture started )
    @sourceTexture = null
    @videoSprite = null
    @imageSprite = null

    # create filters
    @blackWhiteFilter = new BlackWhiteAreaFilter()
    @grayscaleFilter = new GrayScaleFilter()
    @brightnessMapFilter = new BrightnessMapFilter()
    @gaussianBlurFilter = new PIXI.BlurFilter()
    @gaussianBlurFilter.blur = 20
    @gradientDifferenceFilter = new GradientDifferenceFilter()
    @thresholdFilter = new ThresholdFilter()
    @thresholdAreaFilter = new ThresholdAreaFilter()

    # enable or disable filters
    @enableBlackWhite = false
    @enableGrayScale = true
    @enableBrightnessMap = false
    @enableGaussian = false
    @enableGradientDifference = false
    @enableThreshold = false
    @enableThresholdArea = false

    @initImageCapture()

    null

  onConnected:()=>
    console.log "Video Connected..."
    console.log "Init Pixi.."

    @initVideoCapture()

    null

  initImageCapture:()->

    source = document.getElementById("image").src
    @imageSprite = new PIXI.Sprite PIXI.Texture.fromImage source
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

    if @enableBlackWhite
      filters.push @blackWhiteFilter

    if @enableGrayScale
      filters.push @grayscaleFilter

    if @enableBrightnessMap
      filters.push @brightnessMapFilter

    if @enableGaussian
      filters.push @gaussianBlurFilter

    if @enableGradientDifference
      filters.push @gradientDifferenceFilter

    if @enableThreshold
      filters.push @thresholdFilter

    if @enableThresholdArea
      filters.push @thresholdAreaFilter

    if filters.length
      sourceSprite.filters = filters
    else
      sourceSprite.filters = null

    null

  update:()=>
    @renderer.render @stage
    requestAnimFrame @update





