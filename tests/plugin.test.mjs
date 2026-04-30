import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

test('plugin registers bundled skills path and packaged agents', async () => {
  const { AgenticWorkflowsPlugin } = await import('../.opencode/plugins/agentic-workflows.js');

  const plugin = await AgenticWorkflowsPlugin({ directory: projectRoot, client: null });
  const config = {};

  await plugin.config(config);

  assert.ok(config.skills);
  assert.ok(Array.isArray(config.skills.paths));
  assert.equal(config.skills.paths.length, 1);
  assert.equal(config.skills.paths[0], path.join(projectRoot, 'skills'));

  assert.ok(config.agent);
  assert.ok(config.agent['code-reviewer']);
  assert.ok(config.agent['docs-maintainer']);
  assert.equal(config.agent['code-reviewer'].mode, 'subagent');
  assert.equal(config.agent['docs-maintainer'].mode, 'subagent');
});

test('plugin preserves pre-existing config and does not duplicate skills path', async () => {
  const { AgenticWorkflowsPlugin } = await import('../.opencode/plugins/agentic-workflows.js');

  const plugin = await AgenticWorkflowsPlugin({ directory: projectRoot, client: null });
  const config = {
    skills: { paths: [path.join(projectRoot, 'skills')] },
    agent: {
      'code-reviewer': {
        description: 'custom',
        mode: 'subagent',
      },
    },
  };

  await plugin.config(config);

  assert.equal(config.skills.paths.length, 1);
  assert.equal(config.agent['code-reviewer'].description, 'custom');
  assert.ok(config.agent['docs-maintainer']);
});

test('package metadata points at the renamed OpenCode plugin entrypoint', async () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

  assert.equal(packageJson.name, 'agentic-workflows');
  assert.equal(packageJson.main, '.opencode/plugins/agentic-workflows.js');
});

test('claude plugin metadata exists and targets this repository', async () => {
  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, '.claude-plugin', 'plugin.json'), 'utf8')
  );
  const marketplaceJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, '.claude-plugin', 'marketplace.json'), 'utf8')
  );

  assert.equal(pluginJson.name, 'agentic-workflows');
  assert.match(pluginJson.repository, /agentic-workflows/i);
  assert.equal(marketplaceJson.plugins[0].name, 'agentic-workflows');
  assert.equal(marketplaceJson.plugins[0].source, './');
});

test('generated permission files stay aligned with the shared permissions config', async () => {
  const permissions = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'config', 'permissions.json'), 'utf8')
  );
  const settingsJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'settings.json'), 'utf8'));
  const { AgenticWorkflowsPlugin } = await import('../.opencode/plugins/agentic-workflows.js');
  const plugin = await AgenticWorkflowsPlugin({ directory: projectRoot, client: null });
  const config = {};

  await plugin.config(config);

  assert.deepEqual(settingsJson.permissions.allow, permissions.claude.permissions.allow);
  assert.deepEqual(settingsJson.permissions.ask, permissions.claude.permissions.ask);

  const codeReviewerBash = config.agent['code-reviewer'].permission.bash;
  for (const command of permissions.opencode.agents['code-reviewer'].bashAllow) {
    assert.equal(codeReviewerBash[command], 'allow');
  }

  const docsMaintainerBash = config.agent['docs-maintainer'].permission.bash;
  for (const command of permissions.opencode.agents['docs-maintainer'].bashAllow) {
    assert.equal(docsMaintainerBash[command], 'allow');
  }
});

test('settings.json exactly matches generated Claude permissions output', async () => {
  const { renderClaudeSettings } = await import('../scripts/generate-permissions.mjs');
  const permissions = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'config', 'permissions.json'), 'utf8')
  );
  const generated = renderClaudeSettings(permissions);
  const current = fs.readFileSync(path.join(projectRoot, 'settings.json'), 'utf8');

  assert.equal(current, generated);
});

test('workflow skill tells agents to edit canonical permissions instead of settings.json', async () => {
  const workflowSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    'utf8'
  );

  assert.match(workflowSkill, /config\/permissions\.json/);
  assert.match(workflowSkill, /generate:permissions/);
  assert.match(workflowSkill, /Do not edit `settings\.json` directly/i);
});

test('orchestrator skill defines trivial-direct and non-trivial routed workflow', () => {
  const orchestratorSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'orchestrating-workflows', 'SKILL.md'),
    'utf8'
  );

  assert.match(orchestratorSkill, /trivial tasks.*directly/i);
  assert.match(orchestratorSkill, /brainstorming/i);
  assert.match(orchestratorSkill, /writing-plans/i);
  assert.match(orchestratorSkill, /subagent-driven-development/i);
});

test('opencode plugin injects orchestrator bootstrap guidance', async () => {
  const { AgenticWorkflowsPlugin } = await import('../.opencode/plugins/agentic-workflows.js');
  const plugin = await AgenticWorkflowsPlugin({ directory: projectRoot, client: null });
  const output = {
    messages: [
      {
        info: { role: 'user' },
        parts: [{ type: 'text', text: 'Implement a feature' }],
      },
    ],
  };

  assert.equal(typeof plugin['experimental.chat.messages.transform'], 'function');

  await plugin['experimental.chat.messages.transform']({}, output);

  const firstUserText = output.messages[0].parts[0].text;
  assert.match(firstUserText, /orchestrating-workflows/i);
  assert.match(firstUserText, /trivial tasks directly/i);
  assert.match(firstUserText, /brainstorming/i);
});

test('subagent workflow implements full spec before review and uses fresh fixer loop', () => {
  const skill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'subagent-driven-development', 'SKILL.md'),
    'utf8'
  );

  assert.match(skill, /full approved spec/i);
  assert.match(skill, /fresh fixer/i);
  assert.match(skill, /stop and report/i);
});

test('CLAUDE.md exactly matches generated content from AGENTS.md', async () => {
  const { renderClaudeMd } = await import('../scripts/generate-context-files.mjs');
  const agentsMd = fs.readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8');
  const currentClaudeMd = fs.readFileSync(path.join(projectRoot, 'CLAUDE.md'), 'utf8');

  assert.equal(currentClaudeMd, renderClaudeMd(agentsMd));
});
