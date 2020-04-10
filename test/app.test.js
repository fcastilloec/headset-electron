const test = require('ava');
const { Application } = require('spectron');
const path = require('path');
const helper = require('./helper.js');

let execPath = '';

if (process.platform === 'darwin') {
  execPath = 'build/Headset-darwin-x64/Headset.app/Contents/MacOS/Headset';
} else if (process.platform === 'linux') {
  execPath = 'build/Headset-linux-x64/headset';
} else if (process.platform === 'win32') {
  execPath = 'build/Headset-win32-ia32/headset.exe';
}

const appPath = path.join(__dirname, '..', execPath);

test.before(async (t) => {
  t.context.app = new Application({ // eslint-disable-line
    path: appPath,
    env: {
      DEBUG: 'headset*',
    },
  });

  await t.context.app.start();
});

test.after.always(async (t) => {
  await t.context.app.stop();
});

test('start application', async (t) => {
  const app = t.context.app;
  await app.client.waitUntilWindowLoaded();

  t.is(await app.client.getWindowCount(), 2, 'Wrong number of windows');
  helper.printLogs(await app.client.getMainProcessLogs());
});
