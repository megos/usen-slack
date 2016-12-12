'use strict'

const client     = require('cheerio-httpcli');
const CronJob    = require('cron').CronJob;
const express    = require('express');
const bodyParser = require('body-parser');
const Usen       = require('./usen');

const usen = new Usen();
const app  = express();

const job = new CronJob({
  cronTime: '12 */1 * * * *',
  onTick  : () => {usen.postNowPlaying();},
  start   : true,
  timeZone: 'Asia/Tokyo'
});

job.start();


app.use(bodyParser());
app.listen(3000);

app.post('/', (req, res) => {
  usen.setBand(req.body.band.toUpperCase());
  usen.setChannel(('00' + req.body.ch).slice(-2));

  client.fetch('http://music.usen.com/channel/' + req.body.band.toLowerCase() + usen.getChannel() + '/')
  .then((result) => {
    usen.postNowPlaying();
    res.send(result.$('.detail-title > h2').text());
  });
});