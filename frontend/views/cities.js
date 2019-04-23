import m from 'mithril'
import { Cities } from '../models/cities'

export var CityList = {
  oninit: Cities.loadCities,
  view: () => {
    return m('.city-list', Cities.cities.map(city => {
      return m('.city-list-item', city.Name + ' ' + city.CurrentPopulation)
    }))
  }
}
