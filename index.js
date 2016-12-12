const client  = require('cheerio-httpcli');
const request = require('request');

const date = new Date().getTime();

const interval         = 1000 * 60;
const slackWebhookUrl  = 'your slack url';
const slackBotUserName = 'usen-bot';

const param = {
  npband: 'C',
  npch  : '26',
  nppage: 'yes',
  _     : date
};

let nowPlaying = '';

const postUsenNowPlaying = () => {
  client.fetch('http://music.usen.com/usencms/search_nowplay1.php', param)
  .then((result) => {
    return result.$('.np-now li').text().replace(/[ａ-ｚＡ-Ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  })
  .then((np) => {
    if (np !== nowPlaying) {
      const options = {
        url : slackWebhookUrl,
        form: 'payload={"text": "' + np + '", "username": "' + slackBotUserName + '"}',
        json: true
      };
      request.post(options, (error, res, body) => {
        console.log(body);
        nowPlaying = np;
      });
    }
  });
}

postUsenNowPlaying();
setInterval(postUsenNowPlaying, interval);