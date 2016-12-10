const client  = require('cheerio-httpcli');
const request = require('request');

const date = new Date().getTime();

const slackWebhookUrl  = 'your webhook url';
const slackBotUserName = 'usen-bot';

const param = {
  npband: 'C',
  npch  : '26',
  nppage: 'yes',
  _     : date
};

client.fetch('http://music.usen.com/usencms/search_nowplay1.php', param)
.then((result) => {
  return result.$('.np-now li').text();
})
.then((np) => {
  const options = {
    url : slackWebhookUrl,
    form: 'payload={"text": "' + np + '", "username": "' + slackBotUserName + '"}',
    json: true
  }
  request.post(options, (error, res, body) => {
    console.log(body);
  });
});