cv = require "opencv"

cv.readImage "./cv/lena.jpg",(err, im)->
  console.log im
  #result = im.houghLinesP()
  #im.canny 5, 300
  #im.save './cv/out.jpg'

  #im.detectObject cv.FACE_CASCADE,{},(err, faces)->
  #  for face in faces
  #    im.ellipse face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2
  #    im.save './cv/out.jpg'

  #im.houghLinesP(im)
  im.houghLinesP()
  #console.log result
