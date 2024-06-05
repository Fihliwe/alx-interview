#!/usr/bin/env node

const request = require('request');

// Check if a Movie ID was passed as an argument
if (process.argv.length !== 3) {
    console.error('Usage: ./0-starwars_characters.js <Movie ID>');
    process.exit(1);
}

// Extract the Movie ID from the arguments
const movieId = process.argv[2];

// Define the URL to fetch the movie details
const url = `https://swapi.dev/api/films/${movieId}/`;

// Make a request to the Star Wars API to get the movie details
request(url, (error, response, body) => {
    if (error) {
        console.error('Error fetching movie details:', error);
        return;
    }
    if (response.statusCode !== 200) {
        console.error('Failed to retrieve movie:', response.statusCode);
        return;
    }

    // Parse the response body to JSON
    const movie = JSON.parse(body);

    // Extract the character URLs from the movie details
    const characterUrls = movie.characters;

    // Function to fetch and print a character's name
    function fetchCharacterName(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    reject('Error fetching character details:', error);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject('Failed to retrieve character:', response.statusCode);
                    return;
                }

                const character = JSON.parse(body);
                resolve(character.name);
            });
        });
    }

    // Fetch and print all character names sequentially
    async function printCharacterNames() {
        for (const characterUrl of characterUrls) {
            try {
                const characterName = await fetchCharacterName(characterUrl);
                console.log(characterName);
            } catch (error) {
                console.error(error);
            }
        }
    }

    printCharacterNames();
});
