import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const skillsDir = path.join(repoRoot, 'skills');
const agentsDir = path.join(repoRoot, 'agents');
const permissionsPath = path.join(repoRoot, 'config', 'permissions.json');
const orchestratorSkillPath = path.join(repoRoot, 'skills', 'orchestrating-workflows', 'SKILL.md');

function loadPermissions() {
  return JSON.parse(fs.readFileSync(permissionsPath, 'utf8'));
}

function getOrchestratorBootstrap() {
  if (!fs.existsSync(orchestratorSkillPath)) {
    return null;
  }

  return [
    'You should use `orchestrating-workflows` as the default workflow policy.',
    'Handle trivial tasks directly.',
    'For non-trivial work, route through `brainstorming`, spec approval, `writing-plans`, and `subagent-driven-development`.',
    'Only interrupt the user for spec approval, destructive actions, or real blockers.',
  ].join(' ');
}

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
  const permissions = loadPermissions();
  const agent = permissions.opencode.agents[name];

  if (!agent) {
    return undefined;
  }

  const bash = { '*': 'deny' };
  for (const command of agent.bashAllow) {
    bash[command] = 'allow';
  }

  return {
    edit: agent.edit,
    bash,
  };
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
  'experimental.chat.messages.transform': async (_input, output) => {
    const bootstrap = getOrchestratorBootstrap();
    if (!bootstrap || !output.messages.length) {
      return;
    }

    const firstUser = output.messages.find((message) => message.info.role === 'user');
    if (!firstUser || !firstUser.parts.length) {
      return;
    }

    if (firstUser.parts.some((part) => part.type === 'text' && part.text.includes('orchestrating-workflows'))) {
      return;
    }

    const ref = firstUser.parts[0];
    firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
  },
});
