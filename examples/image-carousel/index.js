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

  const onSelectImage = (index) => () => {
    actions.onSelectImage(index)
  }

  const onPreviousSelect = () => {
    actions.onPreviousSelect();
  }

  const onNextImage = () => {
    actions.onNextImage();
  }

  return html`
    <div>
      <h1 style=${textCenter}> Tram-One Image Carousel 🚋 </h1>
      <Image tiles=${store.data.tiles} selected=${store.data.selected} onNextImage=${onNextImage} onPreviousSelect=${onPreviousSelect}></Image>
      <ImageDeck images=${store.data.tiles} onSelect=${onSelectImage}></ImageDeck>
    </div>
  `
}

app.addActions({ data: ImageCarouselActions })
app.addRoute('/', home)

app.start('.main')
