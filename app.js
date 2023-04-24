require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})
spotifyApi // Retrieve an access token
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
    //homepage route:
app.get('/artist-search', (req, res) =>{
  res.render('index')
})
app.get('/artist-search', (req, res) => {
  const searchQuery = req.query.artist // get the search term from the query string
  spotifyApi.searchArtists(searchQuery) // use the searchArtists method to search for artists
    .then(data => {
      const searchResults = data.body.artists.items // get the list of artists from the search results
      res.render('artist-search-results', { searchResults }) // render the artist-search-results view and pass the search results as a parameter
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
