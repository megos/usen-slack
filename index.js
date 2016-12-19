'use strict'

const CronJob    = require('cron').CronJob;
const express    = require('express');
const bodyParser = require('body-parser');
const Usen       = require('./usen');
const settings   = require('./settings');

const usen = new Usen();
const app  = express();

const job = new CronJob({
  cronTime: settings.CRON_TIME,
  onTick  : () => {usen.postNowPlaying();},
  start   : false,
  timeZone: 'Asia/Tokyo'
});

job.start();

usen.getChannelTitle()
.then((result) => {
  usen.postNowPlaying();
})
.catch((err) => {
  console.log(err);
});

app.use(bodyParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(3000);

app.post('/usen', (req, res) => {
  console.log(req.body);
  usen.setBand(req.body.text.slice(0, 1).toUpperCase());
  usen.setChannel(('00' + req.body.text.slice(1)).slice(-2));

  usen.getChannelTitle()
  .then((result) => {
    usen.postNowPlaying();
  })
  .catch((err) => {
    console.log(err);
  });
  res.contentType('application/json');
  res.send('{"text": "OK"}');
});

app.get('/usen/now', (req, res) => {
  res.send(usen.getNowPlaying());
});

app.get('/usen/channel', (req, res) => {
  res.send(usen.getChannelName());
});