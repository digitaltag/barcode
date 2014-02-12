
class VideoStream

  constructor:(@videoElement)->

    @onConnected = null

    @connected = false
    @pending = false

    @URL = null

    navigator.getMedia =
      navigator.getUserMedia or
      navigator.webkitGetUserMedia or
      navigator.mozGetUserMedia or
      navigator.msGetUserMedia

  connect:()->
    if @connected or @pending
      return

    @pending = true

    @videoElement.onloadedmetadata = @onMetaData
    options =
      video: true
      audio: false

    navigator.getMedia options,@onStream,@onError

  onStream:(stream)=>
    if @connected
      return

    @pending = false
    @connected = true

    @URL = window.URL.createObjectURL stream
    @videoElement.src = @URL

    if @onConnected
      @onConnected()

    null

  onError:(error)=>
    console.log "Unable to get video", error
    null

  onMetaData:(event)=>
    console.log "METADATA",event
    null



