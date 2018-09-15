// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const findMonorepo = require('react-dev-utils/workspaceUtils').findMonorepo;

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;
const customAppBuildPath = process.env.REACT_APP_APP_BUILD_PATH;
const envDevModule = process.env.MODULE;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const normalizeName = name => {
  if (name.substring(0, 9) === '@ehrocks/') {
    return name.replace('@ehrocks/', '');
  }
  return name;
};
function camelize(str) {
  if (!str) {
    return;
  }
  const normalizedStr = str.replace(/[^a-zA-Z-\/]/g, '');
  const _hyphenPattern = /[-\/](.)/g;
  return normalizedStr.replace(_hyphenPattern, function(_, character) {
    return character.toUpperCase();
  });
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

const getExportPublicUrl = (appPackageJson, isProduction) =>
  isProduction
    ? getExportPublicProductionUrl(appPackageJson)
    : getExportPublicStagingUrl(appPackageJson);

const getExportPublicProductionUrl = appPackageJson => {
  const version = require(appPackageJson).version;
  const name = normalizeName(require(appPackageJson).name);
  return `${process.env.CDN_PATH_PRODUCTION}/${name}/production/${version}`;
};

const getExportPublicStagingUrl = appPackageJson => {
  const version = require(appPackageJson).version;
  const name = normalizeName(require(appPackageJson).name);
  return `${process.env.CDN_PATH_STAGING}/${name}/staging/${version}`;
};

const getName = appPackageJson => require(appPackageJson).name;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

function getExportServedPath(appPackageJson, isProduction) {
  const publicUrl = getExportPublicUrl(appPackageJson, isProduction);
  const servedUrl = publicUrl;
  return ensureSlash(servedUrl, true);
}

const getLibName = appPackageJson => {
  const name = normalizeName(getName(appPackageJson));
  return camelize(name);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: customAppBuildPath
    ? resolveApp(customAppBuildPath)
    : resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: envDevModule
    ? resolveApp(`src/modules/${envDevModule}/dev/index.js`)
    : resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  exportServedPath: isProduction =>
    getExportServedPath(resolveApp('package.json'), isProduction),
  appExportIndex: resolveApp('src/index.js'),
  appExportBuild: isProduction =>
    !isProduction ? resolveApp('distStaging') : resolveApp('distProduction'),
  libName: getLibName(resolveApp('package.json')),
};

let checkForMonorepo = true;

// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: customAppBuildPath
    ? resolveApp(customAppBuildPath)
    : resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: envDevModule
    ? resolveApp(`src/modules/${envDevModule}/dev/index.js`)
    : resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  exportServedPath: isProduction =>
    getExportServedPath(resolveApp('package.json'), isProduction),
  appExportIndex: resolveApp('src/index.js'),
  appExportBuild: isProduction =>
    !isProduction ? resolveApp('distStaging') : resolveApp('distProduction'),
  libName: getLibName(resolveApp('package.json')),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
};

// detect if template should be used, ie. when cwd is react-scripts itself
const useTemplate =
  appDirectory === fs.realpathSync(path.join(__dirname, '..'));

checkForMonorepo = !useTemplate;

if (useTemplate) {
  module.exports = {
    dotenv: resolveOwn('template/.env'),
    appPath: resolveApp('.'),
    appBuild: customAppBuildPath
      ? resolveOwn(`../../${customAppBuildPath}`)
      : resolveOwn('../../build'),
    appPublic: resolveOwn('template/public'),
    appHtml: resolveOwn('template/public/index.html'),
    appIndexJs: envDevModule
      ? resolveApp(`template/src/modules/${envDevModule}/dev/index.js`)
      : resolveApp('template/src/index.js'),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn('template/src'),
    testsSetup: resolveOwn('template/src/setupTests.js'),
    appNodeModules: resolveOwn('node_modules'),
    publicUrl: getPublicUrl(resolveOwn('package.json')),
    servedPath: getServedPath(resolveOwn('package.json')),
    exportServedPath: isProduction =>
      getExportServedPath(resolveApp('package.json'), isProduction),
    appExportIndex: resolveApp('src/index.js'),
    appExportBuild: isProduction =>
      !isProduction ? resolveApp('distStaging') : resolveApp('distProduction'),
    libName: getLibName(resolveApp('package.json')),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
  };
}
// @remove-on-eject-end

module.exports.srcPaths = [module.exports.appSrc];

module.exports.useYarn = fs.existsSync(
  path.join(module.exports.appPath, 'yarn.lock')
);

if (checkForMonorepo) {
  // if app is in a monorepo (lerna or yarn workspace), treat other packages in
  // the monorepo as if they are app source
  const mono = findMonorepo(appDirectory);
  if (mono.isAppIncluded) {
    Array.prototype.push.apply(module.exports.srcPaths, mono.pkgs);
  }
  module.exports.useYarn = module.exports.useYarn || mono.isYarnWs;
}
