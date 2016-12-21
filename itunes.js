'use strict'

const request  = require('request-promise');
const settings = require('./settings');

const options = {
  url : 'https://itunes.apple.com/search',
  json: true,
  qs  : {
    term     : '',
    country  : 'jp',
    media    : 'music',
    entity   : 'song',
    attribute: 'songTerm',
    limit    : settings.ITUNES_LIMIT,
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
        for (const result of json.results) {
          if (result.artistName.toLowerCase() === artistName.toLowerCase()) {
            resolve(result.artworkUrl100);
          }
        }
        resolve('');
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