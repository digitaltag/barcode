(function() {
  var BarcodeReader, Main, VideoSprite, VideoStream,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BarcodeReader = (function() {
    function BarcodeReader() {
      this.update = __bind(this.update, this);
      this.onConnected = __bind(this.onConnected, this);
      this.init();
    }

    BarcodeReader.prototype.init = function() {
      this.videoElement = document.getElementById("webcam");
      this.stream = new VideoStream(this.videoElement);
      this.stream.onConnected = this.onConnected;
      this.captureStarted = false;
      this.renderer = PIXI.autoDetectRenderer(400, 300);
      this.stage = new PIXI.Stage(0x343434);
      document.body.appendChild(this.renderer.view);
      requestAnimFrame(this.update);
      this.sourceTexture = null;
      return null;
    };

    BarcodeReader.prototype.onConnected = function() {
      console.log("Video Connected...");
      console.log("Init Pixi..");
      this.initCapture();
      return null;
    };

    BarcodeReader.prototype.initCapture = function() {
      if (this.captureStarted) {
        return;
      }
      this.captureStarted = true;
      this.sourceSprite = new VideoSprite(this.videoElement);
      this.stage.addChild(this.sourceSprite);
      return null;
    };

    BarcodeReader.prototype.update = function() {
      this.renderer.render(this.stage);
      return requestAnimFrame(this.update);
    };

    return BarcodeReader;

  })();

  window.onload = function() {
    return window.main = new Main();
  };

  Main = (function() {
    function Main() {
      console.log("Startup..");
      this.reader = new BarcodeReader();
      this.configureGui();
    }

    Main.prototype.configureGui = function() {
      this.gui = new dat.GUI();
      this.gui.add(this.reader.stream, "connect").name("Connect Webcam");
      return null;
    };

    return Main;

  })();

  VideoSprite = (function() {
    function VideoSprite(videoElement) {
      var texture;
      this.videoElement = videoElement;
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.videoElement.width;
      this.canvas.height = this.videoElement.height;
      this.context = this.canvas.getContext("2d");
      texture = new PIXI.Texture.fromCanvas(this.canvas);
      PIXI.Sprite.call(this, texture);
    }

    VideoSprite.prototype = Object.create(PIXI.Sprite.prototype);

    VideoSprite.prototype._renderWebGL = function(renderSession) {
      this.context.drawImage(this.videoElement, 0, 0, this.videoElement.width, this.videoElement.height);
      PIXI.updateWebGLTexture(this.texture.baseTexture, renderSession.gl);
      PIXI.Sprite.prototype._renderWebGL.call(this, renderSession);
      return null;
    };

    return VideoSprite;

  })();

  VideoStream = (function() {
    function VideoStream(videoElement) {
      this.videoElement = videoElement;
      this.onMetaData = __bind(this.onMetaData, this);
      this.onError = __bind(this.onError, this);
      this.onStream = __bind(this.onStream, this);
      this.onConnected = null;
      this.connected = false;
      this.pending = false;
      this.URL = null;
      navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    VideoStream.prototype.connect = function() {
      var options;
      if (this.connected || this.pending) {
        return;
      }
      this.pending = true;
      this.videoElement.onloadedmetadata = this.onMetaData;
      options = {
        video: true,
        audio: false
      };
      return navigator.getMedia(options, this.onStream, this.onError);
    };

    VideoStream.prototype.onStream = function(stream) {
      if (this.connected) {
        return;
      }
      this.pending = false;
      this.connected = true;
      this.URL = window.URL.createObjectURL(stream);
      this.videoElement.src = this.URL;
      if (this.onConnected) {
        this.onConnected();
      }
      return null;
    };

    VideoStream.prototype.onError = function(error) {
      console.log("Unable to get video", error);
      return null;
    };

    VideoStream.prototype.onMetaData = function(event) {
      console.log("METADATA", event);
      return null;
    };

    return VideoStream;

  })();

}).call(this);
