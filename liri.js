// To read and set any environment variables with the dotenv package
require("dotenv").config();

// To import the `keys.js` file and store it in a variable
var keys = require("./keys.js");

// To excecute axios package
var axios = require("axios");

// To excecute spotify package
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// To excecute moment package
var moment = require("moment");

var fs = require("fs");

var commands = process.argv[2];

var inforamtionInquire = process.argv[3];

function concertThis(){
    axios.get("https://rest.bandsintown.com/artists/" + inforamtionInquire + "/events?app_id=codingbootcamp").then(function(response){
        console.log("------------------------------");
        // console.log(response.data[0].venue);
        console.log("Name of the venue: " + response.data[0].venue.name);
        console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
        console.log("Date of the Event: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
        console.log("------------------------------");
    });
};

function spotifyThisSong(){
    
    // var spotifyURL = "https://www.npmjs.com/package/node-spotify-api"
    if (inforamtionInquire === ""){
        spotify.search({
            type: "track",
            query: "The Sign"
        }, function(err,data) {
            if (err) {
                return console.log(err);
            }
            for (var i=0; i<data.tracks.items.length; i++) {
                console.log("------------------------------");
                console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
                console.log("The song's name: " + data.tracks.items[i].name);
                console.log("A preview link of the song from Spotify: " + data.tracks.items[i].preview_url);
                console.log("The album that the song is from: " + data.tracks.items[i].album.name);
                console.log("------------------------------");
            }
        });
    }
    else{
        spotify.search({
            type: "track",
            query: inforamtionInquire
        }, function(err,data) {
            if (err) {
                return console.log(err);
            }
            // console.log(data);
            // console.log(data.tracks.items[0]);
            for (var i=0; i<data.tracks.items.length; i++) {
                console.log("------------------------------");
                console.log("Artist: " + data.tracks.items[i].artists.map(artist => artist.name).join(", "));
                console.log("The song's name: " + data.tracks.items[i].name);
                console.log("A preview link of the song from Spotify: " + data.tracks.items[i].preview_url);
                console.log("The album that the song is from: " + data.tracks.items[i].album.name);
                console.log("------------------------------");
            }
        });
    }
};

function movieThis(){
    axios.get("http://www.omdbapi.com/?t=" + inforamtionInquire + "&y=&plot=short&apikey=trilogy").then(function(response){
        console.log("------------------------------");
        console.log("Title of the movie: " + response.data.Title);
        console.log("Year the movie came out: " + response.data.Year);
        console.log("IMDB Rating of the movie: " + response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
        console.log("Country where the movie was produced: " + response.data.Country);
        console.log("Language of the movie: " + response.data.Language);
        console.log("Plot of the movie: " + response.data.Plot);
        console.log("Actors in the movie: " + response.data.Actors);
        console.log("------------------------------");
    });
};

function doWhatItSays(){
    fs.readFile("random.txt", "utf-8", function(err, data){
        if (err) {
            return console.log(err);
        }

        var dataArr = data.split(", ");

        if (dataArr[0] === "concert-this") {
            inforamtionInquire = dataArr[1];
            concertThis();
        }
        else if (dataArr[0] === "spotify-this-song") {
            inforamtionInquire = dataArr[1];
            spotifyThisSong();
        }
        else{
            inforamtionInquire = dataArr[1];
            movieThis();
        }
    });
}

switch(commands){

    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;
    
    case "do-what-it-says":
        doWhatItSays();
        break;
}

var text = commands + " " + inforamtionInquire + "\n";

fs.appendFile("log.txt", text, function(err){
    if (err) {
        console.log(err);
    }
    else{
        console.log("Log Added.");
    }
});
