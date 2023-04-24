require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:
app.get('/', (request, response) => {
    response.render('home')
  })

app.get('/artist-search', (request, response) => {
    console.log(request.query)




spotifyApi
//const {artist} = request.query
  .searchArtists(request.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body)
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
 /*  .then() */
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
