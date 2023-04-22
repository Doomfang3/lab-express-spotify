require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

// GET Route to create form
app.get("/artist-search", (req, res) => {
  const artistsQuery = req.query.artist;
  console.log(artistsQuery);

  spotifyApi
    .searchArtists(artistsQuery)
    .then((data) => {
      const artistsResult = data.body.artists.items;
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artistsResult });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//GET Route to albums
app.get("/albums/:artistId", (req, res) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albumResult = data.body.items;
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", { albumResult });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// GET Route to tracks
app.get("/tracks/:albumId", (req, res) => {
  // .getAlbumTracks() code goes here
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      const tracksResult = data.body.items;
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("tracks", { tracksResult });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
