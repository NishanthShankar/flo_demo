import {
  StyleSheet
} from 'react-native'

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
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 12,
    color: '#303030',
    padding: 4
  },
  vicinityText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#303030'
  },
  openText: {
    fontSize: 12,
    color: '#303030',
    marginVertical: 4
  }
})

module.exports = styles
