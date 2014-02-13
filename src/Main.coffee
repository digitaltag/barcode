window.onload = ()->
  window.main = new Main()

class Main
  constructor:()->
    console.log "Startup.."

    @reader = new BarcodeReader()

    @configureGui()

  configureGui:()->
    @gui = new dat.GUI()
    @gui.add(@reader.stream, "connect").name("Connect Webcam")

    # Black White Area
    @blackWhiteFolder = @gui.addFolder "Black White Area"

    @blackWhiteFolder.open()
    @blackWhiteFolder.add(@reader,"enableBlackWhite").name("enable").onChange ()=>
      @reader.updateFilters()
    @blackWhiteFolder.add(@reader.blackWhiteFilter,"upper", 0,1).step(0.01)
    @blackWhiteFolder.add(@reader.blackWhiteFilter,"lower", 0,1).step(0.01)

    # GrayScale
    @grayScaleFolder = @gui.addFolder "Grayscale"
    @grayScaleFolder.open()
    @grayScaleFolder.add(@reader,"enableGrayScale").name("enable").onChange ()=>
      @reader.updateFilters()

    @grayScaleFolder.add @reader.grayscaleFilter,"r"
    @grayScaleFolder.add @reader.grayscaleFilter,"g"
    @grayScaleFolder.add @reader.grayscaleFilter,"b"

    # Brightness Map
    @brightnessMapFolder = @gui.addFolder "Brightness Map"
    @brightnessMapFolder.open()
    @brightnessMapFolder.add(@reader,"enableBrightnessMap").name("enable").onChange ()=>
      @reader.updateFilters()

    @brightnessMapFolder.add(@reader.brightnessMapFilter,"size",0,0.01).step(0.0001)

    # Gaussian Blur
    @gaussianFolder = @gui.addFolder "Gaussian Blur"
    @gaussianFolder.open()
    @gaussianFolder.add(@reader, "enableGaussian").name("enable").onChange ()=>
      @reader.updateFilters()

    @gaussianFolder.add( @reader.gaussianBlurFilter, "blur", 0,100 ).step(.5)

    # Gradient Difference.
    @gradientDifferenceFolder = @gui.addFolder "Gradient Difference"
    @gradientDifferenceFolder.open()
    @gradientDifferenceFolder.add(@reader, "enableGradientDifference").name("enable").onChange ()=>
      @reader.updateFilters()

    @gradientDifferenceFolder.add(@reader.gradientDifferenceFilter, "multiplier",0,5.0).step(0.01)

    # Threshold Filter
    @thresholdFolder = @gui.addFolder "Threshold"
    @thresholdFolder.open()
    @thresholdFolder.add(@reader, "enableThreshold").name("enable").onChange ()=>
      @reader.updateFilters()

    @thresholdFolder.add(@reader.thresholdFilter,"threshold",0,1).step(0.01)

    # Threshold Filter
    @thresholdAreaFolder = @gui.addFolder "Threshold Area"
    @thresholdAreaFolder.open()
    @thresholdAreaFolder.add(@reader, "enableThresholdArea").name("enable").onChange ()=>
      @reader.updateFilters()

    @thresholdAreaFolder.add(@reader.thresholdAreaFilter,"threshold",0,1).step(0.01)

    null
















