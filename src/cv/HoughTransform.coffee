class HoughTransform

  constructor:(@numAngles = 360,@width = 512,@height = 512)->

    # create sin/cos lookup..
    @cosTable = Array(@numAngles)
    @sinTable = Array(@numAngles)

    toRadians = Math.PI/180
    for theta in [0...@numAngles]
      console.log theta
      thetaR = theta*toRadians
      @cosTable[theta] = Math.cos thetaR
      @sinTable[theta] = Math.sin thetaR

    @accum = Array(@numAngles)

    @rMax = Math.sqrt @width*@width + @height*@height


  houghAcc:(x,y)->
    for theta in [0...@numAngles]
      r = @rMax + x * @cosTable[theta] + y * @sinTable(theta)
      r >>=1

      if not @accum[theta]
        @accum[ theta ] = []
        if not @accum[theta][r]
          @accum[theta][r] = 1
        else
          @accum[theta][r]++

    null





