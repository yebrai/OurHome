const housesArr = require("./houses.seed.json")

require("../db")

const Property = require("../models/Property.model.js")

Property
.insertMany(housesArr)
.then(() => {
  console.log("Houses Pushed to db!")
})
.catch((err) => {
  console.log(err)
})

//Arrancar con: node .\seeds\seed-script.js