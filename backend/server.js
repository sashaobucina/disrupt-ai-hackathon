'use strict'

const express = require('express')
const app = express()
const requester = require('./requester')

const PORT = 80

app.get('/num-branches', (req, res) => {
  const city = req.query.city
  if (city) {
    console.log(`Sending request to GeoDB for ${city} ...`)
    requester.getLongLat(city)
    .then(response => {
      console.log(`Num branches for ${city}: ${response}`)
      res.send(String(response))
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(404)
    })
  } else {
    console.error('Did not specify query paramater - city')
    res.sendStatus(404)
  }
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))