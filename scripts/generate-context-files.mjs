import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

export function renderClaudeMd(agentsMd) {
  const body = agentsMd.replace(/^#\s+.*\n\n/, '');
  return `# agentic-workflows\n\nGenerated from \`AGENTS.md\`. Do not edit directly.\n\n${body}`;
}

const agentsPath = path.join(projectRoot, 'AGENTS.md');
const claudePath = path.join(projectRoot, 'CLAUDE.md');
const agentsMd = fs.readFileSync(agentsPath, 'utf8');

fs.writeFileSync(claudePath, renderClaudeMd(agentsMd));
