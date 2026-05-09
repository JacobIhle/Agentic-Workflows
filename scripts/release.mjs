import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function getReleasePaths(root = projectRoot) {
  return {
    packagePath: path.join(root, 'package.json'),
    pluginPath: path.join(root, '.claude-plugin', 'plugin.json'),
  };
}

export function parseReleaseVersion(version) {
  if (!VERSION_PATTERN.test(version ?? '')) {
    throw new Error('Expected exactly one explicit version in major.minor.patch form.');
  }

  return version;
}

export function updateJsonVersion(filePath, version) {
  const contents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  contents.version = version;
  fs.writeFileSync(filePath, `${JSON.stringify(contents, null, 2)}\n`);
}

export function updateReleaseVersion(version, paths = getReleasePaths()) {
  const explicitVersion = parseReleaseVersion(version);

  JSON.parse(fs.readFileSync(paths.packagePath, 'utf8'));
  JSON.parse(fs.readFileSync(paths.pluginPath, 'utf8'));

  updateJsonVersion(paths.packagePath, explicitVersion);
  updateJsonVersion(paths.pluginPath, explicitVersion);

  return explicitVersion;
}

export function runReleaseCli(argv = process.argv.slice(2), root = projectRoot) {
  if (argv.length !== 1) {
    throw new Error('Usage: npm run release -- <major.minor.patch>');
  }

  return updateReleaseVersion(argv[0], getReleasePaths(root));
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  try {
    runReleaseCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
