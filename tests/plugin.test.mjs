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
