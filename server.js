const express = require("express")
const app = express()
const cors = require('cors')
app.use(cors())
const Datastore = require('nedb')
const novelDb = new Datastore({filename : 'novel'})
novelDb.loadDatabase()

app.use(express.urlencoded({limit: '1000mb'}))
app.use(express.json({limit: '1000mb'}))

app.get("/novelList", (request, response) => {
  console.log('get novelList')
  novelDb.findOne({ name: 'novelList' }, function (err, obj) {
    response.json(obj ? obj.value : [])
  })
})
app.post("/novelList", (request, response) => {
  console.log('post novelList')
  let {novelList} = request.body
  console.log('novelList get')
  novelDb.remove({ name: 'novelList' }, { multi: true }, function (err, numRemoved) {
    novelDb.insert({name : "novelList", value: novelList})
  })
  response.json({success: true})
})
app.listen(6700)
