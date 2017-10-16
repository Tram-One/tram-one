const Tram = require('../../tram-one')
const app = new Tram()

const Image = require('./elements/Image')
const ImageDeck = require('./elements/ImageDeck')

const ImageCarouselActions = require('./reducers/ImageCarouselActions')

const html = Tram.html({
  Image,
  ImageDeck
})

const textCenter = `
  text-align : center;
`


const home = (store, actions) => {

  const tiles = [{
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
    }]

  const onSelectImage = (index, size) => () => {
    actions.onSelectImage(index, size)
  }

  const onPreviousSelect = (size) => () => {
    actions.onPreviousSelect(size);
  }

  const onNextImage = (size) => () => {
    actions.onNextImage(size);
  }

  const selectedImage = tiles[store.data.selected];

  return html`
    <div>
      <h1 style=${textCenter}> Tram-One Image Carousel 🚋 </h1>
      <Image tile=${selectedImage} size=${tiles.length} onNextImage=${onNextImage} onPreviousSelect=${onPreviousSelect} />
      <ImageDeck images=${tiles} onSelect=${onSelectImage} />
    </div>
  `
}

app.addActions({ data: ImageCarouselActions })
app.addRoute('/', home)

app.start('.main')
