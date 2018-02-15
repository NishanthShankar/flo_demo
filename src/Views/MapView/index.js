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

import MapView, {Marker} from 'react-native-maps'
import {observer} from 'mobx-react/native'
let placeMarker = require('../../assets/place_marker.png')
let selectedMarkerIcon = require('../../assets/selected_marker.png')

// Styles
const styles = StyleSheet.create({
  searchBar: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    elevation: 6,
    paddingHorizontal: 16
  },
  searchResultsHolder: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 4
  },
  searchResult: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingHorizontal: 12,
    justifyContent: 'center'
  }
})

@observer
export default class App extends Component {
  constructor (props) {
    super(props)
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
  }
  render () {
    let {location, onChangeText, searchPhrase, selectedMarker, selectMarker,
      hiddenId, topLocations, fetchAreaDetails, topRestaurants, loading} = this.props.store
    const {latitude, longitude} = location
    const True = true
    console.log("LOADING:", loading)
    return (
      <View style={StyleSheet.absoluteFill}>
        <Image source={placeMarker} style={{opacity:0}} />
        <Image source={selectedMarkerIcon} style={{opacity:0}} />
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
          {/* <Marker coordinate={location} /> */}
          {/* <Marker anchor={{x: 0.52, y: 0.5}} coordinate={location} >
            <Image source={placeMarker} style={{height: 32, width: 32, opacity: 0.6}} />
          </Marker> */}
          {/* <Marker anchor={{x: 0.525, y: 0.9}} coordinate={location} >
            <Image source={selectedMarkerIcon} style={{height: 48, width: 32, opacity: 0.6}} />
          </Marker> */}
          {
            topRestaurants.map((rest) => {
              const {lat: latitude, lng: longitude} = rest.location
              const size = rest.rating > 3.5 ? 32 : 20
              let image = rest.id === selectedMarker ? selectedMarkerIcon : placeMarker
              let height = rest.id === selectedMarker ? size * 1.5 : size
              let y = rest.id === selectedMarker ? 0.9 : 0.5

              if (rest.id === hiddenId) {
                return <View key={hiddenId} />
              }
              return (
                <Marker
                  key={rest.id}
                  anchor={{x: 0.525, y}}
                  coordinate={{latitude, longitude}}
                  onPress={() => selectMarker(rest.id)}>
                  <Image source={image} style={{height: height, width: size}} />
                </Marker>
              )
            }
        )}
        </MapView>
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
