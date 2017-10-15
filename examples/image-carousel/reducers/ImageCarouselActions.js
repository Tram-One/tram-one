module.exports = {
  init: () => Object({
    tiles: [{
      image: 'https://www.w3schools.com/howto/img_nature_wide.jpg',
      text: 'Nature and sunrise',
      alt: 'Nature and sunrise'
    }, {
      image: 'https://www.w3schools.com/howto/img_fjords_wide.jpg',
      text: 'Trolltunga, Norway',
      alt: 'Trolltunga, Norway'
    }, {
      image: 'https://www.w3schools.com/howto/img_mountains_wide.jpg',
      text: 'Mountains and fjords',
      alt: 'Mountains and fjords'
    }, {
      image: 'https://www.w3schools.com/howto/img_lights_wide.jpg',
      text: 'Northern Lights',
      alt: 'Northern Lights'
    }, {
      image: 'https://d3jkudlc7u70kh.cloudfront.net/lion-facts.jpg',
      text: 'Lion in the Jungle',
      alt: 'Lion in the Jungle'
    },
      {
        image: 'https://www.epxworldwide.com/wp-content/uploads/photo-gallery/Mount-Everest-at-sunset-639486254_4743x2104%20(1).jpeg',
        text: 'Mount Everest at Sunset',
        alt: 'Mount Everest at Sunset'
      },
      {
        image: 'http://www.crossindia.in/wp-content/uploads/2016/06/893921_Mangrove-forest-1.jpg',
        text: 'Mangroves of India',
        alt: 'Mangroves of India'
      }],
    selected: 0
  }),

  onSelectImage: (state, slectedNumber) => Object.assign({}, state, {
    selected: slectedNumber
  }),
  onPreviousSelect: (state) => Object.assign({}, state, {
    selected: state.selected - 1 < 0 ? state.tiles.length - 1 : state.selected - 1
  }),
  onNextImage: (state) => Object.assign({}, state, {
    selected: (state.selected + 1 ) % state.tiles.length
  })
}
