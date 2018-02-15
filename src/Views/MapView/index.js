import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'

import styles from './MainViewStyles'
import MapView, {Marker, Callout} from 'react-native-maps'
import {observer} from 'mobx-react/native'
let placeMarker = require('../../assets/place_marker.png')
let selectedMarkerIcon = require('../../assets/selected_marker.png')

// Styles
@observer
export default class App extends Component {
  constructor (props) {
    super(props)
    this.markers = {}
    this.state = {}
  }
  componentDidMount () {
    this.props.store.toggleLogin()
    this.props.store.getLocation()
    this.getMyLocation()
    // observe(this.props.store.newLocation, console.log)
  }
  goTo = ({lat, lng}) => {
    this.mapview.animateToCoordinate({latitude: lat, longitude: lng})
  }
  getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('Positiion:', position)
    }, () => {
      console.log('Error Positiion:')
    })
    let {latitude: lat, longitude: lng} = this.props.store.location
    this.props.store.fetchNearbyRestaurants({lat, lng}, this.mapview)
  }
  onMarkerLayout = (id, selectedMarker) => {
    if (id !== selectedMarker) return
    this.markers[id].showCallout()
  }
  onMarkerPress = (e, id) => {
    const {selectedMarker} = this.props.store
    if (id === selectedMarker) {
      return this.markers[id].showCallout()
    }
    this.markers[id].hideCallout()
    let {selectMarker} = this.props.store
    selectMarker(id)
  }
  renderRestaurants = () => {
    let {selectedMarker, hiddenId, topRestaurants} = this.props.store

    return topRestaurants.map((rest) => {
      const {lat: latitude, lng: longitude} = rest.location
      const size = rest.rating > 3.5 ? 32 : 20
      let selected = rest.id === selectedMarker
      let image = selected ? selectedMarkerIcon : placeMarker
      let height = selected ? size * 1.5 : size
      let y = selected ? 0.9 : 0.5

      if (rest.id === hiddenId) {
        return <View key={hiddenId} />
      }
      let bgColor = rest.rating < 2.5
                      ? '#F88B8B' : rest.rating < 4
                          ? '#F7A875' : '#B2F193'
      let vicinity = rest.vicinity.split(', ').slice(1, 2).join(', ')
      let openText = rest.open ? 'Open now' : 'Closed'
      return (
        <Marker
          ref={marker => { this.markers[rest.id] = marker }}
          onLayout={() => this.onMarkerLayout(rest.id, selectedMarker)}
          key={rest.id}
          anchor={{x: 0.525, y}}
          coordinate={{latitude, longitude}}
          onPress={(e) => this.onMarkerPress(e, rest.id)}
          >
          <Image source={image} style={{height: height, width: size}} />
          <Callout>
            <View style={styles.callout} >
              <View style={styles.calloutImage} />
              <View style={[{marginLeft: 8}]}>
                <Text style={styles.restaurantName}>{rest.name}</Text>
                <View style={[styles.rowCenter]}>
                  <Text style={[styles.ratingText, {backgroundColor: bgColor}]}>
                    {rest.rating}
                  </Text>
                  <Text style={styles.vicinityText}>{vicinity}</Text>
                </View>
                <Text style={styles.openText}>{openText}</Text>
              </View>
            </View>
          </Callout>
        </Marker>
      )
    })
  }
  render () {
    let {location, onChangeText, searchPhrase, showMyLocation, offline, 
      topLocations, fetchAreaDetails, loading} = this.props.store
    const {latitude, longitude} = location
    const True = true
    console.log('LOADING:', loading)
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <Image source={placeMarker} style={{opacity: 0}} />
        <Image source={selectedMarkerIcon} style={{opacity: 0}} />
        <MapView
          ref={mapview => { this.mapview = mapview }}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        >
          {showMyLocation ? <Marker coordinate={location} /> : <View />}
          {this.renderRestaurants()}
        </MapView>
        {offline
        ? <View style={styles.offlineContainer} >
          <View style={[{height: 88}]}></View>
          <View style={{height:36, alignItems: 'center',}}>
            <Text style={{color: "#fff"}}> Seems like your offline.</Text>
          </View>
        </View>:<View />}
        <View style={[styles.searchBar]} >
          <TextInput
            autoCorrect={false}
            onChangeText={onChangeText}
            value={searchPhrase}
            placeholder='Search location'
            underlineColorAndroid='#0000'
            style={{marginTop: 2, flex: 1}}
            />
          {loading ? <ActivityIndicator animating={True} color={'#F1847A'} />
            : <View />}
        </View>
        <View style={[styles.searchResultsHolder]}>
          {topLocations.map(data => {
            return (
              <TouchableOpacity key={data.id} onPress={_ => fetchAreaDetails(data.placeId, this.mapview)} style={[styles.searchResult]}>
                <Text>{data.label}</Text>
              </TouchableOpacity >
            )
          })}
        </View>

      </View>
    )
  }
}
