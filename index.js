'use strict'

const client     = require('cheerio-httpcli');
const CronJob    = require('cron').CronJob;
const express    = require('express');
const bodyParser = require('body-parser');
const Usen       = require('./usen');

const usen = new Usen();
const app  = express();

const job = new CronJob({
  cronTime: '12 */1 8-17 * * 1-5',
  onTick  : () => {usen.postNowPlaying();},
  start   : true,
  timeZone: 'Asia/Tokyo'
});

job.start();
usen.getChannelTitle();
usen.postNowPlaying();

app.use(bodyParser());
app.listen(3000);

app.post('/usen', (req, res) => {
  usen.setBand(req.body.text.slice(0, 1).toUpperCase());
  usen.setChannel(('00' + req.body.text.slice(1)).slice(-2));

  usen.getChannelTitle();
  usen.postNowPlaying();
  res.contentType('application/json');
  res.send('{"text": "OK"}');
});

app.get('/usen/now', (req, res) => {
  res.send(usen.getNowPlaying());
});

app.get('/usen/channel', (req, res) => {
  res.send(usen.getChannelName());
});