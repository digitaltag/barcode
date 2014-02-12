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

    @gaussianFolder.add( @reader.gaussianBlurFilter, "blur", 0,20 ).step(0.5)

    # Gradient Difference.
    @gradientDifferenceFolder = @gui.addFolder "Gradient Difference"
    @gradientDifferenceFolder.open()
    @gradientDifferenceFolder.add(@reader, "enableGradientDifference").name("enable").onChange ()=>
      @reader.updateFilters()    



    null
















