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

app.get("/artist-search", async (req, res) => {
	const { nameToSearch } = req.query;
	try {
		const searchResultAPI = await spotifyApi.searchArtists(nameToSearch);
		const artistsInfoClean = searchResultAPI.body.artists.items.map(
			(artist) => {
				return {
					name: artist.name,
					img: artist.images[1] || { url: "" },
					id: artist.id,
				};
			}
		);
		// console.log("Search Result: ", searchResult.body.artists);
		// console.log("Artist Clean Info: ", artistsInfoClean);
		res.render("artist-search-results", { artistsInfoClean });
	} catch (err) {
		console.log(err);
	}
});

app.get("/albums/:artistId", async (req, res) => {
	const { artistId } = req.params;
	try {
		const albumsAPI = await spotifyApi.getArtistAlbums(artistId);
		const albumsInfoClean = albumsAPI.body.items.map((album) => {
			return {
				name: album.name,
				img: album.images[1] || { url: "" },
				id: album.id,
			};
		});
		// console.log("Albums Clean Info: ", albumsInfoClean);
		res.render("albums", { albumsInfoClean });
	} catch (err) {
		console.log(err);
	}
});

app.get("/tracks/:albumId", async (req, res) => {
	const { albumId } = req.params;
	try {
		const tracksAPI = await spotifyApi.getAlbumTracks(albumId);
		const tracksInfoClean = tracksAPI.body.items.map((track) => {
			return {
				name: track.name,
				artists: track.artists,
				previewUrl: track.preview_url,
				trackNumber: track.track_number,
				discNumver: track.disc_number,
				id: track.id,
			};
		});
		// console.log("Tracks Clean Info: ", tracksInfoClean);
		res.render("tracks", { tracksInfoClean });
	} catch (err) {
		console.log(err);
	}
});

app.listen(3000, () =>
	console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
