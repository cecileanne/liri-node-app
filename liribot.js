// require npms
require("dotenv").config();
const inquirer = require("inquirer");
const seatgeek = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const keys = require("./keys.js");

// console.log(keys.spotify) to see if it's linking correctly;
const spotify = new Spotify(keys.spotify);

// wrap everything in a function
function cli() {
  // Create a Divider for outputs
  const divider =
    "\n------------------------------------------------------------\n\n";
  // Make it so liri.js can take in one of the following commands:
  inquirer
    .prompt([
      {
        type: "list",
        message: "Hi I'm LIRI, can I help you find something?",
        choices: [
          "Find upcoming shows for a certain band",
          "Find a song on Spotify",
          "Find information on your favorite movie",
          "Liri's Choice"
        ],
        name: "selection"
      }
    ])
    .then(function(searchType) {
      if (searchType.selection === "Find upcoming shows for a certain band") {
        // console.log(
        //   "HERE YOU WILL PUT THE PROMPT FOR BAND SEARCHES followed by the search"
        // );
        inquirer
          .prompt([
            {
              type: "input",
              message: "What artist/band?",
              name: "bandSelection",
              default: "Sigrid"
            }
          ])
          .then(function concertThis(concertThis) {
            // console.log(
            //   `band selection is working - ${concertThis.bandSelection}`
            // );
            const clientKey = process.env.SEATGEEK_CLIENT_ID;
            const bandSearchURL = `https://api.seatgeek.com/2/events?performers.slug=${concertThis.bandSelection}&client_id=${clientKey}`;
            axios
              .get(bandSearchURL)
              .then(function(response) {
                const JSONdata = response.data.events[0];
                // console.log(JSONdata);
                // console.log(JSONdata.venue);

                const concertData = [
                  "Artist: " + JSONdata.title,
                  "Venue: " +
                    JSONdata.venue.name +
                    ", " +
                    JSONdata.venue.display_location,
                  "Date of the Show: " +
                    moment.utc(JSONdata.daytime_local).format("MM-DD-YYYY")
                ].join("\n");
                console.log("\n" + concertData + divider);
              })
              .catch(function(err, data) {
                if (err) {
                  return console.log("Error occurred: " + err);
                }
              }); // closes axios search
          }); // closes the then concert this function for band searches
      }
      if (searchType.selection === "Find a song on Spotify") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What song?",
              name: "songSelection",
              default: `"The Sign" Ace of Base`
            }
          ])
          .then(function spotifyThis(spotifyThisSong) {
            spotify.search(
              { type: "track", query: `${spotifyThisSong.songSelection}` },
              function(err, data) {
                if (err) {
                  return console.log("Error occurred: " + err);
                }
                // //   console.log(JSON.stringify(data.tracks.items[0], null, 5));
                // console.log(
                //   "Song Name: ",
                //   JSON.stringify(data.tracks.items[0].name, null, 2)
                // );
                // console.log(
                //   "Performed by: ",
                //   JSON.stringify(
                //     data.tracks.items[0].album.artists[0].name,
                //     null,
                //     2
                //   )
                // );
                // console.log(
                //   "From the Album: ",
                //   JSON.stringify(data.tracks.items[0].album.name, null, 2)
                // );
                // console.log(
                //   "Preview Link: ",
                //   JSON.stringify(
                //     data.tracks.items[0].external_urls.spotify,
                //     null,
                //     2
                //   )
                // );
                const songData = [
                  "Song: " + JSON.stringify(data.tracks.items[0].name, null, 2),
                  "Performed by: " +
                    JSON.stringify(
                      data.tracks.items[0].album.artists[0].name,
                      null,
                      2
                    ),
                  "From the album: " +
                    JSON.stringify(data.tracks.items[0].album.name, null, 2),
                  "Preview link: " +
                    JSON.stringify(
                      data.tracks.items[0].external_urls.spotify,
                      null,
                      2
                    )
                ].join("\n");
                // add to the file and print
                fs.appendFile("log.txt", songData + divider, function(err) {
                  if (err) throw err;
                  console.log("\n" + songData + divider);
                }); // closes append
              }
            ); // closes spotify API search
          }); // closes then for spotify prompt
      } // closes spotify if
      if (searchType.selection === "Find information on your favorite movie") {
        // function(concertThis) {
        // console.log(
        //   "HERE YOU WILL PUT THE PROMPT FOR MOVIES followed by the search"
        // );
        inquirer
          .prompt([
            {
              type: "input",
              message: "What movie?",
              name: "movieSelection",
              default: "Mr. Nobody"
            }
          ])
          .then(function movieThis(movieThis) {
            const movieSearchURL = `http://www.omdbapi.com/?t=${movieThis.movieSelection}&apikey=trilogy`;
            // console.log(`The movie you chose is ` + movieThis.movieSelection);
            axios.get(movieSearchURL).then(function(response) {
              // console.log("Title: " + response.data.Title);
              // console.log("Release Date: " + response.data.Year);
              // console.log("IMBD rating: " + response.data.imdbRating);
              // console.log(
              //   "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value
              // );
              // console.log("Country: " + response.data.Country);
              // console.log("Language: " + response.data.Language);
              // console.log("Plot: " + response.data.Plot);
              // console.log("Actors/Actresses: " + response.data.Actors);
              const movieData = [
                "Title: " + response.data.Title,
                "Release Date: " + response.data.Year,
                "IMBD rating: " + response.data.imdbRating,
                "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
                "Country: " + response.data.Country,
                "Language: " + response.data.Language,
                "Plot: " + response.data.Plot,
                "Actors/Actresses: " + response.data.Actors
              ].join("\n");
              //   console.log("\n" + movieData + divider);
              // add to the file and print
              fs.appendFile("log.txt", movieData + divider, function(err) {
                if (err) throw err;
                console.log("\n" + movieData + divider);
              }); // closes append
            }); // closes then response
            //   .catch(function(err, data) {
            //     if (err) {
            //       return console.log("Error occurred: " + err);
            //     }
            //   });
          }); // closes then movieThis
      } // closes movie if
      if (searchType.selection === "Liri's Choice") {
        // function(randomThis) {
        // console.log(
        //   "HERE YOU WILL PUT THE PROMPT FOR RANDOM followed by the search"
        // );
        fs.readFile("random.txt", "utf8", function(err) {
          if (err) throw err;
        });
        // parse the data line
        const dataArray = data.split(",");
        requestChoice = dataArray[0];
        searchQuery = dataArray[1];
        // three versions
        if (requestChoice == "concert-this") {
          searchQuery = concertThis.bandSelection;
          concertThis();
          //   console.log(`sorry this isn't working right now!`);
        }
        if (requestChoice == "spotify-this") {
          searchQuery = spotifyThisSong.songSelection;
          spotifyThis();
        }
        if (requestChoice == "movie-this") {
          searchQuery = movieThis.movieSelection;
          movieThis();
        }
      } // closes random do-what-it-says if
    }); // closes then after intial inquirer
} // closes cli function
cli();
