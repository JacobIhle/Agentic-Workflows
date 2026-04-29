import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const skillsDir = path.join(repoRoot, 'skills');
const agentsDir = path.join(repoRoot, 'agents');

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: markdown.trim() };
  }

  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const value = keyMatch[2];
      if (value) {
        frontmatter[currentKey] = value.trim();
        currentKey = null;
      } else {
        frontmatter[currentKey] = '';
      }
      continue;
    }

    if (currentKey) {
      const trimmed = line.replace(/^\s*/, '');
      frontmatter[currentKey] = frontmatter[currentKey]
        ? `${frontmatter[currentKey]}\n${trimmed}`
        : trimmed;
    }
  }

  return { frontmatter, body: match[2].trim() };
}

function normalizeDescription(value) {
  if (!value) {
    return '';
  }

  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
}

function getAgentPermission(name) {
  if (name === 'code-reviewer') {
    return {
      edit: 'deny',
      bash: {
        '*': 'deny',
        'git diff*': 'allow',
        'git log*': 'allow',
        'git status*': 'allow',
      },
    };
  }

  if (name === 'docs-maintainer') {
    return {
      edit: 'allow',
      bash: {
        '*': 'deny',
        'git diff*': 'allow',
        'git log*': 'allow',
        'git status*': 'allow',
      },
    };
  }

  return undefined;
}

function loadBundledAgents() {
  const agents = {};
  const files = fs.existsSync(agentsDir)
    ? fs.readdirSync(agentsDir).filter((file) => file.endsWith('.md'))
    : [];

  for (const file of files) {
    const agentName = path.basename(file, '.md');
    const markdown = fs.readFileSync(path.join(agentsDir, file), 'utf8');
    const { frontmatter, body } = parseFrontmatter(markdown);

    agents[agentName] = {
      description: normalizeDescription(frontmatter.description) || `${agentName} agent`,
      mode: 'subagent',
      prompt: body,
      permission: getAgentPermission(agentName),
    };
  }

  return agents;
}

export const AgenticWorkflowsPlugin = async () => ({
  config: async (config) => {
    config.skills = config.skills || {};
    config.skills.paths = config.skills.paths || [];

    if (!config.skills.paths.includes(skillsDir)) {
      config.skills.paths.push(skillsDir);
    }

    config.agent = config.agent || {};
    const bundledAgents = loadBundledAgents();

    for (const [name, agentConfig] of Object.entries(bundledAgents)) {
      if (!config.agent[name]) {
        config.agent[name] = agentConfig;
      }
    }
  },
});
