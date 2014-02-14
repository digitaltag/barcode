fs = require 'fs'
csv = require 'csv'

csvFile = "matrix/matrix.csv"
file = fs.readFileSync csvFile,{encoding:"utf8", flag:"r"}

csv().from.string( file ).to.array (data)->

  # ATTRIBUTES
  # ----------

  # Fetch Attributes first and group by category / subcategory.
  attributeCol = 3
  attributeRow = 5

  attributes = []
  # create a hash to look up an attribute to a particular row.
  rowToAttributeHash = {}

  # store attribute row end.
  ROW_END = null

  rowCount = data[attributeRow].length
  for i in [ attributeRow...rowCount ]

    # For some reason we have a shit load too many rows
    if data[i]
      # check for category
      value = data[i][attributeCol-1]
      if value isnt ""
        category = value
        console.log ""
        console.log "CHANGE CATEGORY :", category
        console.log "---------------"

      # subcategory
      value = data[i][attributeCol]
      console.log value, i

      attribute =
        id: attributes.length + 1
        category: category
        subcategory: value
        rowIndex: i # will be discarded when saving to json.

      rowToAttributeHash[ attribute.rowIndex ] = attribute
      attributes.push attribute

      ROW_END = i
    #else
    #  console.log "NOTHING", i


  # QUESTIONS
  # ----------

  # Question Col/ Row
  questionCol = 6
  questionRow = 1

  questions = []

  for i in [ questionCol...data[questionRow].length ]
    value = data[questionRow][i]


    # fetch question title
    if value isnt ""
      question =
        title: value
        colIndex: i
        answers: []

      questions.push question

      console.log ""
      console.log "QUESTION :", question.title

    # fetch answers
    value = data[questionRow+1][i]
    answer =
      title: value
      weighting: []

    question.answers.push answer

    weightRowStart = questionRow+4

    for j in [weightRowStart..ROW_END]
      #console.log data[j][i]
      weighting = data[j][i]

      if weighting
        answer.weighting.push(weighting)
        console.log "WEIGHTING", j, weighting

    console.log "ANSWER", value


  # WEIGHTINGS
  # ----------

  #weightingRow =




  jsonOutput = "matrix/matrix.json"
  jsonObject =
    attributes: attributes
    questions: questions

  fs.writeFileSync jsonOutput,JSON.stringify(jsonObject)

  null
  #console.log data[attributeRow][attributeCol-1]
  #console.log data[attributeRow+1][attributeCol-1]













