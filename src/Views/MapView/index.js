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

import MapView, {Marker, Callout} from 'react-native-maps'
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
  },
  callout: {
    padding: 4,
    minWidth: 250,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  calloutImage: {
    width: 54,
    backgroundColor: '#ececec'
  },
  restaurantName: {
    fontSize: 16,
    color: '#303030',
    fontWeight: '500'
  }
})

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
    
    setTimeout(() => selectMarker(id), 700)
  }
  render () {
    let {location, onChangeText, searchPhrase, selectedMarker,
      hiddenId, topLocations, fetchAreaDetails, topRestaurants, loading} = this.props.store
    const {latitude, longitude} = location
    const True = true
    console.log('LOADING:', loading)
    return (
      <View style={StyleSheet.absoluteFill}>
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
              let selected = rest.id === selectedMarker
              let image = selected ? selectedMarkerIcon : placeMarker
              let height = selected ? size * 1.5 : size
              let y = selected ? 0.9 : 0.5

              if (rest.id === hiddenId) {
                return <View key={hiddenId} />
              }
              let bgColor = rest.rating<2.5?"#F88B8B":rest.rating<4?"#F7A875":"#B2F193"
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
                        <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                          <Text style={{fontSize: 12, color: '#303030', backgroundColor: bgColor, padding: 4}}>{rest.rating}</Text>
                          <Text style={{marginLeft:8, fontSize: 12, color: '#303030'}}>{rest.vicinity.split(', ').slice(1, 2).join(', ')}</Text>
                        </View>
                        <Text style={{fontSize: 12, color: '#303030', marginVertical: 4}}>{rest.open ? 'Open now' : 'Closed'}</Text>
                      </View>
                    </View>
                  </Callout>
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
