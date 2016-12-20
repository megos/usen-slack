'use strict'

const request = require('request-promise');

const Post = {

  message: function(url, text, username) {
    const form = {
      text    : encodeURIComponent(text),
      username: username
    };
    const options = {
      url : url,
      form: 'payload=' + JSON.stringify(form),
      json: true
    };
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
      username: username,
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
    return new Promise((resolve, reject) => {
      request.post(options)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        console.error(err);
        reject();
      });
    });
  }
}

module.exports = Post;
