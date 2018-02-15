import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image
} from 'react-native'

import MainView from './src/Views/MapView'
import store from './src/Views/MapView/MainStore'

import marker from './src/assets/marker.png'

// type Props = {};
export default class App extends Component {
  render () {
    return (
      <View style={styles.container}>
        <MainView store={store} />
        <Image source={marker} style={{opacity: 0}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
