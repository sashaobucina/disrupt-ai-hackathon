//import m from 'mithril'

export var Cities = {
  cities: [],
  loadCities: () => {
      Cities.cities = CitiesData
    /*return m.request({
      method: 'GET',
      url: 'http://aggregator-l337disrupt.westus.azurecontainer.io/aggregate',
      withCredentials: true
    }).then(result => {
      Cities.cities = result.data
    })
    */
  }
}

var CitiesData = [
  { Name: "Langford", CurrentPopulation: 30450, Population1: 39184, Population2: 50425, Branches: 0 },
  { Name: "Tumbler Ridge", CurrentPopulation: 2816, Population1: 3609, Population2: 4626, Branches: 0 }, 
  { Name: "Anmore", CurrentPopulation: 2160, Population1: 2687, Population2: 3344, Branches: 0 }, 
  { Name: "Pemberton", CurrentPopulation: 2487, Population1: 3072, Population2: 3795, Branches: 0 }, 
  { Name: "Unincorporated Areas", CurrentPopulation: 21853, Population1: 26754, Population2: 32756, Branches: 0 }, 
  { Name: "Port Moody", CurrentPopulation: 34049, Population1: 40348, Population2: 47813, Branches: 0 }, 
  { Name: "Radium Hot Springs", CurrentPopulation: 782, Population1: 923, Population2: 1091, Branches: 0 }, 
  { Name: "Surrey", CurrentPopulation: 482977, Population1: 562183, Population2: 654379, Branches: 0 }, 
  { Name: "Tofino", CurrentPopulation: 2020, Population1: 2338, Population2: 2707, Branches: 0 }, 
  { Name: "Sooke", CurrentPopulation: 11692, Population1: 13347, Population2: 15237, Branches: 0 }, 
  { Name: "Lake Country", CurrentPopulation: 11893, Population1: 13447, Population2: 15205, Branches: 0 }, 
  { Name: "Qualicum Beach", CurrentPopulation: 8669, Population1: 9792, Population2: 11060, Branches: 0 }, 
  { Name: "View Royal", CurrentPopulation: 9564, Population1: 10755, Population2: 12095, Branches: 0 }, 
  { Name: "Chilliwack", CurrentPopulation: 79903, Population1: 89291, Population2: 99783, Branches: 0 }, 
  { Name: "Taylor", CurrentPopulation: 1405, Population1: 1562, Population2: 1738, Branches: 0 }, 
  { Name: "Highlands", CurrentPopulation: 2182, Population1: 2420, Population2: 2684, Branches: 0 }, 
  { Name: "Squamish", CurrentPopulation: 17739, Population1: 19529, Population2: 21499, Branches: 0 }, 
  { Name: "Ladysmith", CurrentPopulation: 7997, Population1: 8803, Population2: 9690, Branches: 0 }, 
  { Name: "Kelowna", CurrentPopulation: 119905, Population1: 131776, Population2: 144823, Branches: 0 }
]

