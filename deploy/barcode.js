(function() {
  var BarcodeReader, BrightnessMapFilter, GaussianBlurFilter, GradientDifferenceFilter, GrayScaleFilter, Main, VideoSprite, VideoStream,
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
      this.videoSprite = null;
      this.imageSprite = null;
      this.grayscaleFilter = new GrayScaleFilter();
      this.brightnessMapFilter = new BrightnessMapFilter();
      this.gaussianBlurFilter = new PIXI.BlurFilter();
      this.gradientDifferenceFilter = new GradientDifferenceFilter();
      this.enableGrayScale = true;
      this.enableBrightnessMap = false;
      this.enableGaussian = false;
      this.enableGradientDifference = false;
      this.initImageCapture();
      return null;
    };

    BarcodeReader.prototype.onConnected = function() {
      console.log("Video Connected...");
      console.log("Init Pixi..");
      this.initVideoCapture();
      return null;
    };

    BarcodeReader.prototype.initImageCapture = function() {
      this.imageSprite = new PIXI.Sprite(PIXI.Texture.fromImage("barcode.png"));
      this.stage.addChild(this.imageSprite);
      return null;
    };

    BarcodeReader.prototype.initVideoCapture = function() {
      if (this.captureStarted) {
        return;
      }
      this.captureStarted = true;
      if (this.imageSprite) {
        this.stage.removeChild(this.imageSprite);
      }
      this.videoSprite = new VideoSprite(this.videoElement);
      this.stage.addChild(this.videoSprite);
      this.updateFilters();
      return null;
    };

    BarcodeReader.prototype.updateFilters = function() {
      var filters, sourceSprite;
      if (this.videoSprite) {
        sourceSprite = this.videoSprite;
      } else {
        sourceSprite = this.imageSprite;
      }
      filters = [];
      if (this.enableGrayScale) {
        filters.push(this.grayscaleFilter);
      }
      if (this.enableBrightnessMap) {
        filters.push(this.brightnessMapFilter);
      }
      if (this.enableGaussian) {
        filters.push(this.gaussianBlurFilter);
      }
      if (this.enableGradientDifference) {
        filters.push(this.gradientDifferenceFilter);
      }
      if (filters.length) {
        sourceSprite.filters = filters;
      } else {
        sourceSprite.filters = null;
      }
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
      var _this = this;
      this.gui = new dat.GUI();
      this.gui.add(this.reader.stream, "connect").name("Connect Webcam");
      this.grayScaleFolder = this.gui.addFolder("Grayscale");
      this.grayScaleFolder.open();
      this.grayScaleFolder.add(this.reader, "enableGrayScale").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.grayScaleFolder.add(this.reader.grayscaleFilter, "r");
      this.grayScaleFolder.add(this.reader.grayscaleFilter, "g");
      this.grayScaleFolder.add(this.reader.grayscaleFilter, "b");
      this.brightnessMapFolder = this.gui.addFolder("Brightness Map");
      this.brightnessMapFolder.open();
      this.brightnessMapFolder.add(this.reader, "enableBrightnessMap").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.brightnessMapFolder.add(this.reader.brightnessMapFilter, "size", 0, 0.01).step(0.0001);
      this.gaussianFolder = this.gui.addFolder("Gaussian Blur");
      this.gaussianFolder.open();
      this.gaussianFolder.add(this.reader, "enableGaussian").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.gaussianFolder.add(this.reader.gaussianBlurFilter, "blur", 0, 20).step(0.5);
      this.gradientDifferenceFolder = this.gui.addFolder("Gradient Difference");
      this.gradientDifferenceFolder.open();
      this.gradientDifferenceFolder.add(this.reader, "enableGradientDifference").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
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

  BrightnessMapFilter = (function() {
    function BrightnessMapFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        matrix0: {
          type: 'mat2',
          value: [-0.25, -0.25, 0.25, 0.25]
        },
        matrix90: {
          type: 'mat2',
          value: [0.25, -0.25, 0.25, -0.25]
        },
        matrix45: {
          type: 'mat3',
          value: [0, -0.25, 0, 0.25, 0, -0.25, 0, 0.25, 0]
        },
        matrix135: {
          type: 'mat3',
          value: [0, 0.25, 0, 0.25, 0, -0.25, 0, -0.25, 0]
        },
        size: {
          type: '1f',
          value: 0.0025
        }
      };
      this.fragmentSrc = ['precision mediump float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform mat2 matrix0;', 'uniform mat3 matrix45;', 'uniform mat2 matrix90;', 'uniform mat3 matrix135;', 'uniform float size;', 'void main(void) {', '   vec4 result = vec4(0);', '   vec4 result00 = texture2D(uSampler, vTextureCoord)*3.0;', '   result.r += result00.r * matrix0[0][0];', '   result.g += result00.r * matrix90[0][0];', '   vec4 result10 = texture2D(uSampler, vTextureCoord-vec2(size,0))*3.0;', '   result.r += result10.r * matrix0[0][1];', '   result.g += result10.r * matrix90[0][1];', '   result.b += result10.r * matrix45[0][1];', '   result.a += result10.r * matrix135[0][1];', '   vec4 result01 = texture2D(uSampler, vTextureCoord-vec2(0,size))*3.0;', '   result.r += result01.r * matrix0[1][0];', '   result.g += result01.r * matrix90[1][0];', '   result.b += result01.r * matrix45[1][0];', '   result.a += result01.r * matrix135[1][0];', '   vec4 result11 = texture2D(uSampler, vTextureCoord-vec2(size,size))*3.0;', '   result.r += result11.r * matrix0[1][1];', '   result.g += result11.r * matrix90[1][1];', '   vec4 result12 = texture2D(uSampler, vTextureCoord-vec2(size,2.0*size))*3.0;', '   result.b += result12.r * matrix45[2][1];', '   result.a += result12.r * matrix135[2][1];', '   vec4 result21 = texture2D(uSampler, vTextureCoord-vec2(2.0*size,size))*3.0;', '   result.b += result21.r * matrix45[1][2];', '   result.a += result21.r * matrix135[1][2];', '   gl_FragColor = abs(result);', '}'];
    }

    BrightnessMapFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(BrightnessMapFilter.prototype, {
      size: {
        get: function() {
          return this.uniforms.size.value;
        },
        set: function(value) {
          return this.uniforms.size.value = value;
        }
      }
    });

    return BrightnessMapFilter;

  })();

  GaussianBlurFilter = (function() {
    function GaussianBlurFilter(x, y) {
      if (x == null) {
        x = 1.0;
      }
      if (y == null) {
        y = 0.0;
      }
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        direction: {
          type: "2f",
          value: {
            x: x,
            y: y
          }
        }
      };
      this.fragmentSrc = ['precision highp float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform vec2 direction;', 'void main(void) {', '   vec4 sum = vec4(0);', '   sum += texture2D(uSampler, vTextureCoord - (direction*4.0) * 0.05;', '   sum += texture2D(uSampler, vTextureCoord - direction*3.0) * 0.09;', '   sum += texture2D(uSampler, vTextureCoord - direction*2.0) * 0.12;', '   sum += texture2D(uSampler, vTextureCoord - direction) * 0.15;', '   sum += texture2D(uSampler, vTextureCoord) * 0.18;', '   sum += texture2D(uSampler, vTextureCoord + direction) * 0.15;', '   sum += texture2D(uSampler, vTextureCoord + direction*2.0) * 0.12;', '   sum += texture2D(uSampler, vTextureCoord + direction*3.0) * 0.09;', '   sum += texture2D(uSampler, vTextureCoord + direction*4.0) * 0.05;', '   gl_FragColor = abs(sum);', '}'];
    }

    GaussianBlurFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    GaussianBlurFilter.prototype.set = function(x, y) {
      this.uniforms.direction.value.x = x;
      this.uniforms.direction.value.y = y;
      return null;
    };

    return GaussianBlurFilter;

  })();

  GradientDifferenceFilter = (function() {
    function GradientDifferenceFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {};
      this.fragmentSrc = ['precision highp float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'void main(void) {', '   vec4 result = vec4(0);', '   vec4 value = texture2D(uSampler,vTextureCoord);', '   result.r = value.g - value.r;', '   result.g = value.b - value.a;', '   result.b = 0.0;', '   result.a = 1.0;', '   gl_FragColor = result;', '}'];
    }

    return GradientDifferenceFilter;

  })();

  GrayScaleFilter = (function() {
    function GrayScaleFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        dotVec: {
          type: "3f",
          value: {
            x: 0.299,
            y: 0.587,
            z: 0.114
          }
        }
      };
      this.fragmentSrc = ['precision lowp float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform vec3 dotVec;', 'void main(void) {', '   float grayscale = dot(texture2D(uSampler,vTextureCoord).rgb, dotVec);', '   gl_FragColor = vec4(grayscale,grayscale,grayscale,1);', '}'];
    }

    GrayScaleFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(GrayScaleFilter.prototype, {
      r: {
        get: function() {
          return this.uniforms.dotVec.value.x;
        },
        set: function(value) {
          return this.uniforms.dotVec.value.x = value;
        }
      },
      g: {
        get: function() {
          return this.uniforms.dotVec.value.y;
        },
        set: function(value) {
          return this.uniforms.dotVec.value.y = value;
        }
      },
      b: {
        get: function() {
          return this.uniforms.dotVec.value.z;
        },
        set: function(value) {
          return this.uniforms.dotVec.value.z = value;
        }
      }
    });

    return GrayScaleFilter;

  })();

}).call(this);
