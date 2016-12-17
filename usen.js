'use strict'

const client   = require('cheerio-httpcli');
const request  = require('request');
const settings = require('./settings');
const post     = require('./post');
const itunes   = require('./itunes');

const Usen = function() {
  this.param = {
    npband: 'A',
    npch  : '44',
    nppage: 'yes',
    _     : ''
  };
  this.nowPlaying  = '';
  this.botName     = settings.BOT_NAME;
  this.webhookUrl  = settings.WEB_HOOK_URL;
  this.channelName = '';
};

Usen.prototype = {

  postNowPlaying: function() {

    this.param._ = new Date().getTime();

    client.fetch('http://music.usen.com/usencms/search_nowplay1.php', this.param)
    .then((result) => {
      return result.$('.np-now li').text().replace(/[ａ-ｚＡ-Ｚ０-９＝！？＄＋＊％＆，．]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      }).replace(/　/g, ' ').replace(/’/g, "'").replace(/－/g, '-');
    })
    .then((np) => {
       if (np !== this.nowPlaying) {
        np = 'yumegiwa';
        itunes.getArtworkUrl(np.split('／')[0].trim())
        .then((url) => {
          if (url !== '') {

          } else {
            post.message(this.webhookUrl, np, this.botName);
          }
        })
        .catch(() => {
          post.message(this.webhookUrl, np, this.botName);
        })
        this.nowPlaying = np;
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
    return new Promise((resolve, reject) => {
      client.fetch('http://music.usen.com/channel/' + this.param.npband + this.param.npch + '/')
      .then((result) => {
        return result.$('.detail-title > h2').text();
      })
      .then((title) => {
        this.channelName = title;
        post.message(this.webhookUrl, title, this.botName)
      });
    });
  }
}

module.exports = Usen;
