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
    lang     : 'ja_jp'
  }
}

const itunesApi = {

  getArtworkUrl: function(songName) {
    this.setTerm(songName);

    return new Promise((resolve, reject) => {
      request(options)
      .then((json) => {
        if (json.results.length > 0) {
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
    options.qs.term = encodeURIComponent(term).replace(/%20/g, '+');
  }
}

module.exports = itunesApi;