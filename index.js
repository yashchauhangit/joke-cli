const fs = require('fs');
const process = require('process');
const request = require('request');

const API_URL = 'https://icanhazdadjoke.com/search';

function searchJoke(searchTerm) {
  const options = {
    url: `${API_URL}?term=${encodeURIComponent(searchTerm)}`,
    headers: {
      'Accept': 'application/json'
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const jokeData = JSON.parse(body);
      if (jokeData.total_jokes > 0) {
        const randomJoke = jokeData.results[Math.floor(Math.random() * jokeData.results.length)];
        console.log(randomJoke.joke);
        saveJokeToFile(randomJoke.joke);
      } else {
        console.log(`there are no jokes for"${searchTerm}"`);
      }
    } else {
      console.error('unable to make a api request:', error);
    }
  });
}

function saveJokeToFile(joke) {
  fs.appendFile('jokes.txt', `${joke}\n`, (err) => {
    if (err) {
      console.error('cannot save the joke to the file:', err);
    }
  });
}

if (process.argv[2] === 'leaderboard') {

  console.log('leaderboard logic');
} else {
 
  const searchTerm = process.argv[2];
  
  if (searchTerm) {
    searchJoke(searchTerm);
  } else {
    console.log('Please provide a search term.');
  }
}
