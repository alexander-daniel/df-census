const fs = require('fs');
const url = require('url');
const ecstatic = require('ecstatic');
const micro = require('micro');

let DATA = {};

try {
  DATA = JSON.parse(fs.readFileSync('/Users/alex/things/df/units.json', 'utf8'));
}

catch (e) {}

// TODO: choose file to watch
fs.watchFile('/Users/alex/things/df/units.json', () => {
  console.error('unit manifest changed, updating state');

  try {
    DATA = JSON.parse(fs.readFileSync('/Users/alex/things/df/units.json', 'utf8'));
  }

  catch (e) {
    console.error(e);
  }
});

const staticHandler = ecstatic({ root: `${__dirname}/static` });

const getUnits = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(DATA, null, 2));
}

const server = micro((req, res) => {
  const { pathname } = url.parse(req.url);
  switch (pathname) {
    case '/units':
      return getUnits(req, res);
    default:
      return staticHandler(req, res);
  }
});

server.listen(3000);
