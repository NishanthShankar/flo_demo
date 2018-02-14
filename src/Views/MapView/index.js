import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'

import MapView, {Marker} from 'react-native-maps'
import {observer} from 'mobx-react/native'

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
    elevation: 6
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
    let {location, onChangeText, searchPhrase,
      topLocations, fetchAreaDetails, topRestaurants} = this.props.store
    let {latitude, longitude} = location
    console.log('REST:', topRestaurants)
    return (
      <View style={[{flex: 1}]}>
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
          <Marker coordinate={location} />
          {/* <Marker coordinate={location} >
            <View style={[{height: 40, width: 40, backgroundColor: 'pink', elevation: 4}]} />
          </Marker> */}
        </MapView>
        <View style={[styles.searchBar]} >
          <TextInput
            autoCorrect={false}
            onChangeText={onChangeText}
            value={searchPhrase}
            placeholder='Search location'
            underlineColorAndroid='#0000'
            style={{marginLeft: 8, marginTop: 4, flex: 1}}
            />
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
