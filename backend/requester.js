const unirest = require('unirest')

const AZURE_BASE = 'https://atlas.microsoft.com/'
SUB_KEY = 'Oydq8B8a-ztkxq6Ittkdetm7YlUmHNppC6oLKSGMys4'

const getLongLat = (city) => {
  return new Promise((resolve, reject) => {
    unirest.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=CA&namePrefix=${city}`)
    .header("X-RapidAPI-Host", "wft-geo-db.p.rapidapi.com")
    .header("X-RapidAPI-Key", "7c2ae455cbmsh0e9aec137fce557p147942jsn7a98cf464267")
    .end(function (result) {
      if (!result.body) {
        return reject(`Could not get the body - ${result}`)
      }
      const data = result.body.data
      let parsedData = []
      if (data && data.length > 0) {
        parsedData = data.map(city => {
          return {
            city: city.city,
            latitude: city.latitude,
            longitude: city.longitude
          }
        })
        if (parsedData.length === 0) {
          return reject('No data given for the city')
        }

        const latLong = parsedData[0]
        console.log(`Sending request to Azure Maps at (${latLong.latitude}, ${latLong.longitude}) ...`)
        azureMapPOI('bank', latLong.latitude, latLong.longitude)
          .then(response => {
            return resolve(response)
          })
          .catch(err => {
            return reject(err)
          })
      } else {
        return reject("City not found")
      }
    })
  })
}

const azureMapPOI = (poi, lat, long) => {
  const searchPOI = '/search/poi/category/json'
  return new Promise((resolve, reject) => {
    unirest
    .get(`${AZURE_BASE}${searchPOI}?subscription-key=${SUB_KEY}&api-version=1.0&query={${poi}}&lat=${lat}&lon=${long}&radius=5000&limit=100`)
    .end(async function(result) { 
      const summary = result.body.summary
      if (summary) {
        return resolve(summary.totalResults)
      } else {
        console.error('No data available for this geo-point')
        return reject('Invalid point')
      }
    })
  })
}

module.exports = {getLongLat, azureMapPOI}