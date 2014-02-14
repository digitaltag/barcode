(function() {
  var BarcodeReader, BlackWhiteAreaFilter, BrightnessMapFilter, FastEdgeFilter, GradientDifferenceFilter, GrayScaleFilter, HoughTransform, Main, ThresholdAreaFilter, ThresholdFilter, VideoSprite, VideoStream,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BarcodeReader = (function() {
    function BarcodeReader() {
      this.update = __bind(this.update, this);
      this.onConnected = __bind(this.onConnected, this);
      this.init();
    }

    BarcodeReader.prototype.init = function() {
      var size;
      this.videoElement = document.getElementById("webcam");
      this.stream = new VideoStream(this.videoElement);
      this.stream.onConnected = this.onConnected;
      this.captureStarted = false;
      this.renderer = PIXI.autoDetectRenderer(this.videoElement.width, this.videoElement.height);
      this.stage = new PIXI.Stage(0x343434);
      document.body.appendChild(this.renderer.view);
      requestAnimFrame(this.update);
      this.sourceTexture = null;
      this.videoSprite = null;
      this.imageSprite = null;
      size = 1 / this.videoElement.height;
      this.blackWhiteFilter = new BlackWhiteAreaFilter();
      this.grayscaleFilter = new GrayScaleFilter();
      this.brightnessMapFilter = new BrightnessMapFilter();
      this.brightnessMapFilter.size = size;
      this.gaussianBlurFilter = new PIXI.BlurFilter();
      this.gaussianBlurFilter.blur = 40;
      this.gradientDifferenceFilter = new GradientDifferenceFilter();
      this.thresholdFilter = new ThresholdFilter();
      this.thresholdAreaFilter = new ThresholdAreaFilter();
      this.fastEdgeFilter = new FastEdgeFilter();
      this.enableBlackWhite = false;
      this.enableGrayScale = true;
      this.enableBrightnessMap = false;
      this.enableGaussian = false;
      this.enableGradientDifference = false;
      this.enableThreshold = false;
      this.enableThresholdArea = false;
      this.enableFastEdge = false;
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
      var source;
      source = document.getElementById("image").src;
      this.imageSprite = new PIXI.Sprite(PIXI.Texture.fromImage(source));
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
      if (this.enableBlackWhite) {
        filters.push(this.blackWhiteFilter);
      }
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
      if (this.enableThreshold) {
        filters.push(this.thresholdFilter);
      }
      if (this.enableThresholdArea) {
        filters.push(this.thresholdAreaFilter);
      }
      if (this.enableFastEdge) {
        filters.push(this.fastEdgeFilter);
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
      this.blackWhiteFolder = this.gui.addFolder("Black White Area");
      this.blackWhiteFolder.open();
      this.blackWhiteFolder.add(this.reader, "enableBlackWhite").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.blackWhiteFolder.add(this.reader.blackWhiteFilter, "upper", 0, 1).step(0.01);
      this.blackWhiteFolder.add(this.reader.blackWhiteFilter, "lower", 0, 1).step(0.01);
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
      this.gaussianFolder.add(this.reader.gaussianBlurFilter, "blur", 0, 100).step(.5);
      this.gradientDifferenceFolder = this.gui.addFolder("Gradient Difference");
      this.gradientDifferenceFolder.open();
      this.gradientDifferenceFolder.add(this.reader, "enableGradientDifference").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.gradientDifferenceFolder.add(this.reader.gradientDifferenceFilter, "multiplier", 0, 5.0).step(0.01);
      this.thresholdFolder = this.gui.addFolder("Threshold");
      this.thresholdFolder.open();
      this.thresholdFolder.add(this.reader, "enableThreshold").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.thresholdFolder.add(this.reader.thresholdFilter, "threshold", 0, 1).step(0.01);
      this.thresholdAreaFolder = this.gui.addFolder("Threshold Area");
      this.thresholdAreaFolder.open();
      this.thresholdAreaFolder.add(this.reader, "enableThresholdArea").name("enable").onChange(function() {
        return _this.reader.updateFilters();
      });
      this.thresholdAreaFolder.add(this.reader.thresholdAreaFilter, "threshold", 0, 1).step(0.01);
      this.gaussianFolder = this.gui.addFolder("Fast Edge");
      this.gaussianFolder.open();
      this.gaussianFolder.add(this.reader, "enableFastEdge").name("enable").onChange(function() {
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

  HoughTransform = (function() {
    function HoughTransform(numAngles, width, height) {
      var theta, thetaR, toRadians, _i, _ref;
      this.numAngles = numAngles != null ? numAngles : 360;
      this.width = width != null ? width : 512;
      this.height = height != null ? height : 512;
      this.cosTable = Array(this.numAngles);
      this.sinTable = Array(this.numAngles);
      toRadians = Math.PI / 180;
      for (theta = _i = 0, _ref = this.numAngles; 0 <= _ref ? _i < _ref : _i > _ref; theta = 0 <= _ref ? ++_i : --_i) {
        console.log(theta);
        thetaR = theta * toRadians;
        this.cosTable[theta] = Math.cos(thetaR);
        this.sinTable[theta] = Math.sin(thetaR);
      }
      this.accum = Array(this.numAngles);
      this.rMax = Math.sqrt(this.width * this.width + this.height * this.height);
    }

    HoughTransform.prototype.houghAcc = function(x, y) {
      var r, theta, _i, _ref;
      for (theta = _i = 0, _ref = this.numAngles; 0 <= _ref ? _i < _ref : _i > _ref; theta = 0 <= _ref ? ++_i : --_i) {
        r = this.rMax + x * this.cosTable[theta] + y * this.sinTable(theta);
        r >>= 1;
        if (!this.accum[theta]) {
          this.accum[theta] = [];
          if (!this.accum[theta][r]) {
            this.accum[theta][r] = 1;
          } else {
            this.accum[theta][r]++;
          }
        }
      }
      return null;
    };

    return HoughTransform;

  })();

  BlackWhiteAreaFilter = (function() {
    function BlackWhiteAreaFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        upper: {
          type: "1f",
          value: 0.8
        },
        lower: {
          type: "1f",
          value: 0.2
        }
      };
      this.fragmentSrc = ['precision mediump float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform float upper;', 'uniform float lower;', 'void main(void) {', '   vec4 pix = texture2D(uSampler,vTextureCoord);', '   vec4 result;', '   float luminance = (0.299*pix.r) + (0.587*pix.g) + (0.114*pix.b);', '   if(luminance <= lower){', '       result = vec4(luminance,luminance,luminance,1);', '   }else', '   if(luminance >= upper ){', '       result = vec4(luminance,luminance,luminance,1);', '   }else{', '       result = vec4(0);', '   }', '   gl_FragColor = result;', '}'];
    }

    BlackWhiteAreaFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(BlackWhiteAreaFilter.prototype, {
      upper: {
        get: function() {
          return this.uniforms.upper.value;
        },
        set: function(value) {
          return this.uniforms.upper.value = value;
        }
      },
      lower: {
        get: function() {
          return this.uniforms.lower.value;
        },
        set: function(value) {
          return this.uniforms.lower.value = value;
        }
      }
    });

    return BlackWhiteAreaFilter;

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
          value: 1 / 512
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

  FastEdgeFilter = (function() {
    function FastEdgeFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        size: {
          type: "1f",
          value: 1 / 512
        }
      };
      this.fragmentSrc = ['precision mediump float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform float size;', 'void main(void) {', '   vec4 value = texture2D(uSampler,vTextureCoord);', '   vec4 up = texture2D(uSampler,vTextureCoord+vec2(0,size));', '   vec4 down = texture2D(uSampler,vTextureCoord+vec2(0,-size));', '   vec4 left = texture2D(uSampler,vTextureCoord+vec2(-size,0));', '   vec4 right = texture2D(uSampler,vTextureCoord+vec2(size,0));', '   int count = 0;', '   if(up.r >= 1.0){', '       count++;', '   }', '   if(down.r >= 1.0){', '       count++;', '   }', '   if(left.r >= 1.0){', '       count++;', '   }', '   if(right.r >= 1.0){', '       count++;', '   }', '   if(count == 1){', '       value = vec4(1);', '   }else{', '       value = vec4(0);', '       value.a = 1.0;', '   }', '   gl_FragColor = value;', '}'];
    }

    FastEdgeFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(FastEdgeFilter.prototype, {
      size: {
        get: function() {
          return this.uniforms.size.value;
        },
        set: function(value) {
          return this.uniforms.size.value = value;
        }
      }
    });

    return FastEdgeFilter;

  })();

  GradientDifferenceFilter = (function() {
    function GradientDifferenceFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        multiplier: {
          type: "1f",
          value: 2.5
        }
      };
      this.fragmentSrc = ['precision mediump float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform float multiplier;', 'void main(void) {', '   vec4 value = texture2D(uSampler,vTextureCoord);', '   vec4 result = vec4(0);', '   result.r = value.r - value.g;', '   result.g = value.b - value.a;', '   result.b = 0.0;', '   result.a = 1.0;', '   result.r = result.r * multiplier;', '   result.g = result.g * multiplier;', '   gl_FragColor = abs(result);', '}'];
    }

    GradientDifferenceFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(GradientDifferenceFilter.prototype, {
      multiplier: {
        get: function() {
          return this.uniforms.multiplier.value;
        },
        set: function(value) {
          return this.uniforms.multiplier.value = value;
        }
      }
    });

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

  ThresholdAreaFilter = (function() {
    function ThresholdAreaFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        threshold: {
          type: "1f",
          value: 0.5
        },
        size: {
          type: "1f",
          value: 1 / 512
        }
      };
      this.fragmentSrc = ['precision mediump float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform float threshold;', 'uniform float size;', 'void main(void) {', '   vec4 value = texture2D(uSampler,vTextureCoord);', '   vec4 up = texture2D(uSampler,vTextureCoord+vec2(0,size));', '   vec4 down = texture2D(uSampler,vTextureCoord+vec2(0,-size));', '   vec4 left = texture2D(uSampler,vTextureCoord+vec2(-size,0));', '   vec4 right = texture2D(uSampler,vTextureCoord+vec2(size,0));', '   int count = 0;', '   if(up.r >= threshold){', '       count++;', '   }', '   if(down.r >= threshold){', '       count++;', '   }', '   if(left.r >= threshold){', '       count++;', '   }', '   if(right.r >= threshold){', '       count++;', '   }', '   if(count > 0){', '       value = vec4(1);', '   }', '   gl_FragColor = value;', '}'];
    }

    ThresholdAreaFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(ThresholdAreaFilter.prototype, {
      threshold: {
        get: function() {
          return this.uniforms.threshold.value;
        },
        set: function(value) {
          return this.uniforms.threshold.value = value;
        }
      },
      size: {
        get: function() {
          return this.uniforms.size.value;
        },
        set: function(value) {
          return this.uniforms.size.value = value;
        }
      }
    });

    return ThresholdAreaFilter;

  })();

  ThresholdFilter = (function() {
    function ThresholdFilter() {
      PIXI.AbstractFilter.call(this);
      this.passes = [this];
      this.uniforms = {
        threshold: {
          type: "1f",
          value: 0.11
        }
      };
      this.fragmentSrc = ['precision mediump float;', 'uniform sampler2D uSampler;', 'varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'uniform float threshold;', 'void main(void) {', '   vec4 value = texture2D(uSampler,vTextureCoord);', '   float luminance = ( value.r + value.g ) / 2.0;', '   if(luminance >= threshold){', '       luminance = 1.0;', '   }else{', '       luminance = 0.0;', '   }', '   gl_FragColor = vec4(luminance,luminance,luminance,1);', '}'];
    }

    ThresholdFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);

    Object.defineProperties(ThresholdFilter.prototype, {
      threshold: {
        get: function() {
          return this.uniforms.threshold.value;
        },
        set: function(value) {
          return this.uniforms.threshold.value = value;
        }
      }
    });

    return ThresholdFilter;

  })();

}).call(this);
