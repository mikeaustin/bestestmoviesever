const fetch = require('/usr/local/lib/node_modules/node-fetch')

fetch('http://imdb.com')
  .then(response => response.text())
  .then(body => console.log(body))

