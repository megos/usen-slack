const client = require('cheerio-httpcli');

const date = new Date().getTime();

const param = {
  npband: 'C',
  npch: '26',
  nppage: 'yes',
  _: date
};

client.fetch('http://music.usen.com/usencms/search_nowplay1.php', param)
.then((result) => {
  console.log(result.$('.np-now li').text());
});