/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

import MainView from './src/Views/MapView'
import store from './src/Views/MapView/MainStore'

// type Props = {};
export default class App extends Component {
  render () {
    return (
      <View style={styles.container}>
        <MainView store={store} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
