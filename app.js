/* --- 1. Require dotenv --- */

require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

/* --- 2. Require spotify-web-api-node package --- */

const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

/* --- 3. Set the spotify-api --- */

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})
  
/* --- 4. Retrieve an access token --- */

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

/* --- 5. Routes go here --- */

/* --- (1) Home route --- */
app.get('/', (request, response) => {
    response.render('home')
    console.log('Linked to home page!!!')
  })

/* --- (2) Search route --- */
app.get('/artist-search', async(request, response) => {
    
    const searchedArtistQuery = request.query.artist;

    try {  
        await spotifyApi
            .searchArtists(searchedArtistQuery)
            .then( artistDataFromSpotifyApi => {
            
                const artists = artistDataFromSpotifyApi.body.artists; //Object
                const items = artistDataFromSpotifyApi.body.artists.items; //Array of objects

                //console.log('The received data from the API - artist: ', artists)
                //console.log('The received data from the API - artist items: ', items)
                let artistArr = []
                items.forEach( item => {
                    artistArr.push({
                        id: item.id,
                        name: item.name,
                        img: item.images[0].url
                    })
                })
                return artistArr //Return an array of objects
            })
            .then( artistDataToRender => {
                //console.log(artistDataToRender)
                response.render('artist-search-results', {artistDataToRender})
            })
            .catch( error => console.log('Error happened (1) !!!', error))

    } catch(error) {
        console.log('Error happened (2) !!!', error)
    } 
})

/* --- (3) Album route --- */
app.get('/albums/:artistId', async(request, response, next) => {

    const {artistId} = request.params; 

    try {
        await spotifyApi
            .getArtistAlbums(artistId)
            .then(albumDataFromSpotifyApi => {

                const items = albumDataFromSpotifyApi.body.items;
                //const artist = albumDataFromSpotifyApi.body.items[0].artists;
                //console.log(albumDataFromSpotifyApi.body.items[0].artists)

                let albumArr = []
                items.forEach( item => {
                    albumArr.push({
                        id: item.id,
                        name: item.name,
                        img: item.images[0].url,
                        artist: item.artist
                    })
                })
                
                return albumArr //Return an array of objects

            })
            .then(albumDataToRender => {
                response.render('albums', {albumDataToRender})
            })
            .catch(error => console.log("Error happened on Album (1) !!!", error))


    } catch(error) {
        console.log("Error happened on Album (2) !!!", error)
    }
})

/* --- (4) Track route --- */



/* --- 6. Listen to the port 3000 --- */

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))