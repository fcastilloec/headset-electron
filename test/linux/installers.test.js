/* eslint-disable func-names */
const test = require('ava');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { version } = require('../../package.json');

const packagePath = path.join(__dirname, '..', '..', 'build', 'installers');
const debPackage = `headset_${version}_amd64.deb`;
const rpmPackage = `headset-${version}-1.x86_64.rpm`;

test('.deb package created', async (t) => {
  t.timeout(1000);
  await t.notThrowsAsync(fs.access(`${packagePath}/${debPackage}`));
});

test('debian lintian', async (t) => {
  try {
    const { stdout } = await exec(`lintian ${packagePath}/${debPackage}`);
    t.is(stdout.match(/\n/g).length, 1, `Warning and errors not overridden:\n${stdout}`);
  } catch (error) {
    t.fail(error.stderr + error.stdout);
  }
});

test('.rpm package created', async (t) => {
  t.timeout(1000);
  await t.notThrowsAsync(fs.access(`${packagePath}/${rpmPackage}`));
});
