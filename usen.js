'use strict'

const client   = require('cheerio-httpcli');
const request  = require('request');
const config   = require('config');
const post     = require('./post');
const itunes   = require('./itunes');

const Usen = function() {
  this.param = {
    npband: config.band,
    npch  : config.channel,
    nppage: 'yes',
    _     : ''
  };
  this.nowPlaying  = '';
  this.botName     = config.botName;
  this.webhookUrl  = config.webhookUrl;
  this.channelName = '';
};

Usen.prototype = {

  postNowPlaying: function() {

    this.param._ = new Date().getTime();

    client.fetch('http://music.usen.com/usencms/search_nowplay1.php', this.param)
    .then((result) => {
      return result.$('.np-now li').text().replace(/[ａ-ｚＡ-Ｚ０-９＝！？＄＋＊％＆，．（）]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      }).replace(/　/g, ' ').replace(/’/g, "'").replace(/－/g, '-');
    })
    .then((np) => {
       if (np !== this.nowPlaying) {
        const info = np.split(' ／ ');
        itunes.getArtworkUrl(info[0].replace(/^\(([0-9]+(位|)|注目曲)\)/, '').trim().replace(/'/g, "\\'"), info[1].trim())
        .then((url) => {
          if (url !== '') {
            post.messegeWithAttachment(this.webhookUrl, url, np, this.channelName);
          } else {
            post.message(this.webhookUrl, np, this.channelName);
          }
        })
        .catch(() => {
          post.message(this.webhookUrl, np, this.channelName);
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
        .then((result) => {
          resolve();
        })
        .catch((err) => {
          reject();
        });
      });
    });
  }
}

module.exports = Usen;
