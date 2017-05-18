const express = require('express');
const debug = require('debug');

const log = debug('twitch_search');

const app = express();

const port = process.env.PORT || 8080;

app.use((req, res, next) => {
  log('receiving request %s %s', req.method, req.url);
  next();
})

app.get('/*', express.static('./src'));

app.listen(port);

log('server online on port %s', port);
