import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

test('plugin registers bundled skills path and packaged agents', async () => {
  const { OpDevSuperpowersPlugin } = await import('../.opencode/plugins/op-dev-superpowers.js');

  const plugin = await OpDevSuperpowersPlugin({ directory: projectRoot, client: null });
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
  const { OpDevSuperpowersPlugin } = await import('../.opencode/plugins/op-dev-superpowers.js');

  const plugin = await OpDevSuperpowersPlugin({ directory: projectRoot, client: null });
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
