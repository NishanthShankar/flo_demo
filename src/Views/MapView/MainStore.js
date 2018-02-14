import {computed, action, observable} from 'mobx'
import _ from 'lodash'

import G from '../../config/globals'

class MainStore {
  @observable loading = false
  @observable text = 'No error'
  @observable searchPhrase = ''
  @observable location = {
    latitude: 12.893800,
    longitude: 77.615558
  }

  @observable currentLocations = []
  @computed get topLocations () {
    let locations = this.currentLocations.slice(0, 3)
    return locations
  }

  @observable places = []
  @computed get topRestaurants () {
    let locations = this.places.slice(0, 10)
    return locations
  }

  @action.bound
  onChangeText = text => {
    this.searchPhrase = text
    clearTimeout(this.timer)
    this.timer = setTimeout(
      this.fetchAreaSuggestions(text)
    , 600)
  }

  @action.bound
  fetchAreaSuggestions = phrase => dummy => {
    let {latitude, longitude} = this.location
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`
    let fin = `${url}?input=${phrase}&types=(regions)&location=${latitude},${longitude}&key=${G.variables.GOOGLE_KEY}`
    fetch(fin)
      .then(d => d.json())
      .then(data => {
        this.currentLocations = _.map(data.predictions, pred => ({
          id: pred.id,
          placeId: pred.place_id,
          label: pred.structured_formatting.main_text
        }))
      })
  }

  @action.bound
  fetchAreaDetails = (placeId, map) => {
    let base = `https://maps.googleapis.com/maps/api/place/details/json`
    let url = `${base}?placeid=${placeId}&key=${G.variables.GOOGLE_KEY}`
    fetch(url)
      .then(d => d.json())
      .then(data => {
        this.currentLocations = []
        let {lat, lng} = data.result.geometry.location
        // cb({lat, lng})
        map.animateToCoordinate({latitude: lat, longitude: lng})
        this.fetchNearbyRestaurants({lat, lng})
        // this.test = 2
      })
  }

  @action.bound
  fetchNearbyRestaurants = ({lat, lng}) => {
    let base = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
    let url = `${base}?location=${lat},${lng}&radius=1000&type=restaurant&key=${G.variables.GOOGLE_KEY}`
    console.log('URI:', url)
    fetch(url)
      .then(d => d.json())
      .then(({results}) => {
        this.places = _.map(results, (item) => ({
          location: item.geometry.location,
          name: item.name,
          open: _.get(item, 'opening_hours.open_now', false),
          placeId: item.place_id,
          rating: item.rating
        }))
      })
  }
  @action.bound
  toggleLogin = () => {
    setTimeout(action(() => { this.loading = true }), 1000)
  }

  @action.bound
  getLocation = () => {
    this.text = 'Get positions'
    console.log('Get Positiion:')
    try {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('Positiion:', position)
      }, () => {
        this.text = 'Error'
      })
    } catch (error) {
      this.text = 'Error'
    }
  }
}

let store = new MainStore()
export default store
