import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

export function renderClaudeSettings(permissions) {
  return `${JSON.stringify({ permissions: permissions.claude.permissions }, null, 2)}\n`;
}

export function loadPermissions() {
  const permissionsPath = path.join(projectRoot, 'config', 'permissions.json');
  return JSON.parse(fs.readFileSync(permissionsPath, 'utf8'));
}

const permissions = loadPermissions();
const settingsPath = path.join(projectRoot, 'settings.json');

fs.writeFileSync(settingsPath, renderClaudeSettings(permissions));
