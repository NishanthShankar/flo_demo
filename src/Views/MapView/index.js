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
let marker = require('../../assets/marker.png')

var CustomCallout = (props) => {
  const bgColor = props.rating < 2.5
                      ? '#F88B8B' : props.rating < 4
                          ? '#F7A875' : '#B2F193'
  const vicinity = props.vicinity.split(', ').slice(1, 2).join(', ')
  const openText = props.open ? 'Open now' : 'Closed'
  return (
    <View style={styles.callout} >
      <View style={styles.calloutImage} />
      <View style={[{marginLeft: 8}]}>
        <Text style={styles.restaurantName}>{props.name}</Text>
        <View style={[styles.rowCenter]}>
          <Text style={[styles.ratingText, {backgroundColor: bgColor}]}>
            {props.rating}
          </Text>
          <Text style={styles.vicinityText}>{vicinity}</Text>
        </View>
        <Text style={styles.openText}>{openText}</Text>
      </View>
    </View>
  )
}

// Styles
@observer
export default class App extends Component {
  constructor (props) {
    super(props)
    this.markers = {}
    this.state = {}
  }
  componentDidMount () {
    this.props.store.getLocation()
    this.props.store.checkNetwork()
    // observe(this.props.store.newLocation, console.log)
  }
  goTo = ({lat, lng}) => {
    this.mapview.animateToCoordinate({latitude: lat, longitude: lng})
  }
  onMapLoad = () => {
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
    let {selectedMarker, topRestaurants} = this.props.store

    return topRestaurants.map((place) => {
      const {lat: latitude, lng: longitude} = place.location
      const size = place.rating > 3.5 ? 32 : 20

      return (
        <Marker
          ref={marker => { this.markers[place.id] = marker }}
          onLayout={() => this.onMarkerLayout(place.id, selectedMarker)}
          key={place.id}
          anchor={{x: 0.525, y: 0.5}}
          coordinate={{latitude, longitude}}
          >
          <Image source={placeMarker} style={{height: size, width: size}} />
          <Callout>
            <CustomCallout {...place} />
          </Callout>
        </Marker>
      )
    })
  }
  render () {
    let {location, onChangeText, searchPhrase, showMyLocation, offline,
      topLocations, fetchAreaDetails, loading, noResults} = this.props.store
    const {latitude, longitude} = location
    const True = true
    const errorText = noResults ? 'No results' : 'Seems like your offline'
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {/* preload images */}
        <Image source={placeMarker} style={{opacity: 0}} />
        <Image source={selectedMarkerIcon} style={{opacity: 0}} />
        {!latitude ? <View /> : <MapView
          ref={mapview => { this.mapview = mapview }}
          onMapReady={this.onMapLoad}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        >
          {showMyLocation
          ? <Marker coordinate={location} anchor={{x: 0.5, y: 0.5}}>
            <Image source={marker} style={{height: 32, width: 32}} />
          </Marker> : <View />}
          {this.renderRestaurants()}
        </MapView>}
        {offline || noResults
        ? <View style={styles.offlineContainer} >
          <View style={[{height: 88}]} />
          <View style={{height: 36, alignItems: 'center'}}>
            <Text style={{color: '#fff'}}>{errorText}</Text>
          </View>
        </View> : <View />}
        <View style={[styles.searchBar]} >
          <TextInput
            autoCorrect={false}
            onChangeText={onChangeText}
            selectTextOnFocus={True}
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
              <TouchableOpacity key={data.id}
                onPress={_ => fetchAreaDetails(data.placeId, data.label, this.mapview)}
                style={[styles.searchResult]}>
                <Text>{data.label}</Text>
              </TouchableOpacity >
            )
          })}
        </View>
        {/* <View style={[{position:"absolute", left:0, bottom:0, right:0, height:54, backgroundColor:"#000" }]}></View> */}

      </View>
    )
  }
}
