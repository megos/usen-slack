'use strict'

const request = require('request-promise');
const config  = require('config');
const socket  = require('socket.io-client')('http://localhost:' + config.socketioPort);


const Post = {

  message: function(url, text, username) {
    const form = {
      text    : encodeURIComponent(text),
      username: encodeURIComponent(username)
    };
    const options = {
      url : url,
      form: 'payload=' + JSON.stringify(form),
      json: true
    };
    this.sendSocketIO(username, text);
    return new Promise((resolve, reject) => {
      request.post(options)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.error(err);
        reject();
      });
    });
  },

  messegeWithAttachment: function(url, artworkurl, text, username) {
    const form = {
      username: encodeURIComponent(username),
      attachments: [{
        text     : encodeURIComponent(text),
        thumb_url: artworkurl
      }]
    };
    const options = {
      url : url,
      form: 'payload=' + JSON.stringify(form),
      json: true
    };
    this.sendSocketIO(username, text, artworkurl);
    return new Promise((resolve, reject) => {
      request.post(options)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.error(err);
        reject();
      });
    });
  },

  sendSocketIO: function(ch, np, artworkurl) {
    if (artworkurl === undefined) {
      artworkurl = '';
    }
    socket.json.emit('usen', {
      channel   : ch,
      nowplaying: np,
      artworkurl: artworkurl
    });
  }
}

module.exports = Post;
