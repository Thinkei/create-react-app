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

const getExportPublicProductionUrl = appPackageJson =>
  `${process.env.CDN_PATH_PRODUCTION}/${normalizeName(
    require(appPackageJson).name
  )}/production/${require(appPackageJson).version}`;

const getExportPublicStagingUrl = appPackageJson =>
  `${process.env.CDN_PATH_STAGING}/${normalizeName(
    require(appPackageJson).name
  )}/staging/${require(appPackageJson).version}`;

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
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
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
  appIndexJs: envDevModule ? resolveModule(resolveApp, `src/modules/${envDevModule}/dev/index.js`) : resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
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
  appIndexJs: envDevModule ? resolveModule(resolveApp, `src/modules/${envDevModule}/dev/index.js`) : resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
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
  appTypeDeclarations: resolveApp('src/react-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  const templatePath = '../cra-template/template';
  module.exports = {
    dotenv: resolveOwn(`${templatePath}/.env`),
    appPath: resolveApp('.'),
    appBuild: customAppBuildPath
    ? resolveOwn(`../../${customAppBuildPath}`)
    : resolveOwn('../../build'),
    appPublic: resolveOwn(`${templatePath}/public`),
    appHtml: resolveOwn(`${templatePath}/public/index.html`),
    appIndexJs: resolveModule(
      resolveOwn,
      envDevModule ? `${templatePath}/src/modules/${envDevModule}/dev/index.js` : `${templatePath}/src/index`
    ),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn(`${templatePath}/src`),
    appTsConfig: resolveOwn(`${templatePath}/tsconfig.json`),
    appJsConfig: resolveOwn(`${templatePath}/jsconfig.json`),
    yarnLockFile: resolveOwn(`${templatePath}/yarn.lock`),
    testsSetup: resolveModule(resolveOwn, `${templatePath}/src/setupTests`),
    proxySetup: resolveOwn(`${templatePath}/src/setupProxy.js`),
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
    appTypeDeclarations: resolveOwn(`${templatePath}/src/react-app-env.d.ts`),
    ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
  };
}
// @remove-on-eject-end

module.exports.moduleFileExtensions = moduleFileExtensions;
