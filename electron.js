const { app, BrowserWindow, dialog } = require('electron');
const url = require('url');
const fs = require('fs');
const ecstatic = require('ecstatic');
const micro = require('micro');

let win;
let DATA = {};

/*
 * Create the server which will serve our HTML/JS/CSS as well as respond to
 * API calls from the front-end asking for the latest `DATA`.
 */
function createServer() {
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

  server.listen(8808);
}

/*
 * Dispatch an open:file dialog for the user to select their
 * units.json file in their DF installation directory
 */
async function selectFile() {
  return new Promise((resolve) => {
    dialog.showOpenDialog({}, resolve);
  });
}

/*
 * Parses the json file at `filePath` and keeps watching for changes,
 * and continues to watch for changes, updating the `DATA` object as it goes.
 * That way, every time the frontend makes an API call to get units,
 * it'll have the latest
 */
function watchAndUpdate(filePath) {
  try {
    DATA = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    throw new Error(`Something went wrong reading/parsing: ${filePath}`);
  }

  // Watch the specified file for changes, and update DATA.
  fs.watchFile(filePath, () => {
    console.error('unit manifest changed, updating state');

    try {
      DATA = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      throw new Error(`Something went wrong reading/parsing: ${filePath}`);
    }
  });
}

// Create the BrowserWindow that runs the webapp frontend
function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL('http://localhost:8808');
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  });
}

// Electron app is ready to rock n roll.
app.on('ready', async () => {
  const filePaths = await selectFile();
  watchAndUpdate(filePaths[0]);
  createServer();
  createWindow()
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
