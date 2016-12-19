'use strict'

const request = require('request-promise');

const options = {
  url : 'https://itunes.apple.com/search',
  json: true,
  qs  : {
    term     : '',
    country  : 'jp',
    media    : 'music',
    entity   : 'song',
    attribute: 'songTerm',
    limit    : 1,
    lang     : 'en_us'
  }
}

const itunesApi = {

  getArtworkUrl: function(songName, artistName) {
    this.setTerm(songName);

    return new Promise((resolve, reject) => {
      request(options)
      .then((json) => {
        console.log(json);
        if (json.results.length > 0 &&
          (json.results[0].artistName.toLowerCase() === artistName.toLowerCase() ||
            json.results[0].artistName.toLowerCase().replace(/and/g, '&') === artistName.toLowerCase())) {
          resolve(json.results[0].artworkUrl100);
        } else {
          resolve('');
        }
      })
      .catch((err) => {
        console.error(err);
        reject();
      });
    })
  },

  setTerm: function(term) {
    options.qs.term = term;
  }
}

module.exports = itunesApi;