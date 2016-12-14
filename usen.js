'use strict'

const client  = require('cheerio-httpcli');
const request = require('request');


const Usen = function() {
  this.param = {
    npband: 'C',
    npch  : '26',
    nppage: 'yes',
    _     : ''
  };
  this.nowPlaying  = '';
  this.botName     = 'usen-bot';
  this.webhookUrl  = '';
  this.channelName = '';
};

Usen.prototype = {

  postNowPlaying: function() {

    this.param._ = new Date().getTime();

    client.fetch('http://music.usen.com/usencms/search_nowplay1.php', this.param)
    .then((result) => {
      return result.$('.np-now li').text().replace(/[ａ-ｚＡ-Ｚ０-９＝！？＄＋＊％＆]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      }).replace(/　/g, ' ').replace(/’/g, "'").replace(/－/g, '-');
    })
    .then((np) => {
      if (np !== this.nowPlaying) {
        const form = {
          text    : np,
          username: this.channelName
        };
        const options = {
          url : this.webhookUrl,
          form: 'payload=' + JSON.stringify(form),
          json: true
        };
        request.post(options, (error, res, body) => {
          console.log(body);
          this.nowPlaying = np;
        });
      }
    });
  },

  setBand: function(band) {
    this.param.npband = band;
  },

  getBand: function() {
    return this.param.npband;
  },

  setChannel: function(channel) {
    this.param.npch = channel;
  },

  getChannel: function() {
    return this.param.npch;
  },

  getNowPlaying: function() {
    return this.nowPlaying;
  },

  getChannelName: function() {
    return this.channelName;
  },

  getChannelTitle: function() {
    client.fetch('http://music.usen.com/channel/' + this.param.npband + this.param.npch + '/')
    .then((result) => {
      return result.$('.detail-title > h2').text();
    })
    .then((title) => {
      this.channelName = title;
      const form = {
        text    : title,
        username: this.botName
      };
      const options = {
        url : this.webhookUrl,
        form: 'payload=' + JSON.stringify(form),
        json: true
      };
      request.post(options, (error, res, body) => {
        console.log(body);
      });
    })
  }
}

module.exports = Usen;
