'use strict'

const request = require('request');

const Post = function(){};

Post.prototype = {

  message: function(url, text, username) {
    const form = {
      text    : text,
      username: username
    };
    const options = {
      url : url,
      form: 'payload=' + JSON.stringify(form),
      json: true
    };
    request.post(options, (error, res, body) => {
      console.log(body);
    });
  }
}

module.exports = Post;
