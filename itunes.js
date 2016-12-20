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

    if (this.isHankaku(songName) && this.isHankaku(artistName)) {
      options.qs.lang = 'en_us';
    } else {
      options.qs.lang = 'ja_jp';
    }

    return new Promise((resolve, reject) => {
      request(options)
      .then((json) => {
        if (json.results.length > 0 &&
          (json.results[0].artistName.toLowerCase() === artistName.toLowerCase())) {
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
  },

  isHankaku(term) {
    return term.length === encodeURI(term).replace(/%[0-9A-F]{2}/g, 'L').length
  }
}

module.exports = itunesApi;