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

    null
















