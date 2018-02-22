import {computed, action, observable} from 'mobx'
import {Keyboard, NetInfo} from 'react-native'
import _ from 'lodash'

import G from '../../config/globals'

class MainStore {
  @observable loading = false
  @observable offline = false
  @observable noResults = false
  @observable text = 'No error'
  @observable searchPhrase = ''
  @observable showMyLocation = true
  @observable selectedMarker = null
  @observable hiddenId = null
  @observable currentLocations = []
  @observable places = []
  @observable location = {
    // latitude: 12.893800,
    // longitude: 77.615558
  }
  @computed get topLocations () {
    let locations = this.currentLocations.slice(0, 3)
    return locations
  }

  @computed get topRestaurants () {
    let locations = this.places.slice(0, 10)
    return locations
  }

  handleNetwork = isConnected => {
    this.offline = !isConnected
  }

  @action.bound checkNetwork = _ => {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('CONNECTED:', isConnected)
      this.offline = !isConnected
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleNetwork
      )
    })
  }
  @action.bound
  onChangeText = text => {
    this.noResults = false
    this.searchPhrase = text
    clearTimeout(this.timer)
    if (!text) {
      this.currentLocations = []
      return
    }
    this.timer = setTimeout(
      this.fetchAreaSuggestions(text)
    , 600)
  }

  @action.bound
  fetchAreaSuggestions = phrase => dummy => {
    this.offline = false
    this.loading = true
    const {latitude, longitude} = this.location
    const base = `https://maps.googleapis.com/maps/api/place/autocomplete/json`
    const url = `${base}?input=${phrase}&types=(regions)&location=${latitude},${longitude}&key=${G.variables.GOOGLE_KEY}`
    fetch(url)
      .then(d => d.json())
      .then(data => {
        this.currentLocations = _.map(data.predictions, pred => ({
          id: pred.id,
          placeId: pred.place_id,
          label: pred.structured_formatting.main_text
        }))
        if (this.currentLocations.length < 1) {
          this.noResults = true
        }
      })
      .catch(_ => { this.offline = true })
      .then(() => { this.loading = false })
  }

  @action.bound
  fetchAreaDetails = (placeId, label, map) => {
    this.offline = false
    this.loading = true
    this.searchPhrase = label
    const base = `https://maps.googleapis.com/maps/api/place/details/json`
    const url = `${base}?placeid=${placeId}&key=${G.variables.GOOGLE_KEY}`
    fetch(url)
      .then(d => d.json())
      .then(data => {
        this.currentLocations = []
        const {lat, lng} = data.result.geometry.location
        Keyboard.dismiss()
        // cb({lat, lng})
        map.animateToCoordinate({latitude: lat, longitude: lng})
        this.showMyLocation = false
        this.fetchNearbyRestaurants({lat, lng}, map)
        // this.test = 2
      })
      .catch(_ => { this.offline = true })
      .then(() => { this.loading = false })
  }

  @action.bound
  fetchNearbyRestaurants = ({lat, lng}, map) => {
    this.offline = false
    this.loading = true
    const base = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
    const url = `${base}?location=${lat},${lng}&radius=1000&type=restaurant&key=${G.variables.GOOGLE_KEY}`
    fetch(url)
      .then(d => d.json())
      .then(({results}) => {
        this.places = _.map(results, (item) => ({
          id: item.id,
          location: item.geometry.location,
          name: item.name,
          open: _.get(item, 'opening_hours.open_now', false),
          placeId: item.place_id,
          rating: item.rating,
          vicinity: item.vicinity
        }))
        map.fitToElements(true, {edgePadding: {top: 20, right: 10, bottom: 10, left: 10}})
      })
      .catch(_ => { this.offline = true })
      .then(() => { this.loading = false })
  }
  @action.bound
  toggleLogin = () => {
    // setTimeout(action(() => { this.loading = true }), 1000)
  }

  @action.bound
  selectMarker = (id, i) => {
    this.hiddenId = id
    this.selectedMarker = id
    setTimeout(this.makeMarkerVisible(i), 300)
  }

  @action.bound
  makeMarkerVisible = (i) => () => {
    this.hiddenId = null
  }

  @action.bound
  getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('Positiion:', position)
      let latitude = position.coords.latitude
      let longitude = position.coords.longitude
      this.location = {latitude, longitude}
    }, () => {
      // latitude: 12.893800,
      // longitude: 77.615558
    })
  }
}

let store = new MainStore()
export default store
