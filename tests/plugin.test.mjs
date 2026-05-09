import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
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

test('package and Claude plugin metadata stay on the same version', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, '.claude-plugin', 'plugin.json'), 'utf8')
  );

  assert.equal(packageJson.version, pluginJson.version);
});

test('release helper updates package and Claude plugin versions together', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agentic-workflows-release-'));
  const packagePath = path.join(tempRoot, 'package.json');
  const pluginDir = path.join(tempRoot, '.claude-plugin');
  const pluginPath = path.join(pluginDir, 'plugin.json');

  fs.mkdirSync(pluginDir, { recursive: true });
  fs.writeFileSync(
    packagePath,
    `${JSON.stringify({ name: 'fixture', version: '0.2.0' }, null, 2)}\n`
  );
  fs.writeFileSync(
    pluginPath,
    `${JSON.stringify({ name: 'fixture', version: '0.2.0' }, null, 2)}\n`
  );

  const { updateReleaseVersion } = await import('../scripts/release.mjs');

  updateReleaseVersion('1.4.2', { packagePath, pluginPath });

  assert.equal(JSON.parse(fs.readFileSync(packagePath, 'utf8')).version, '1.4.2');
  assert.equal(JSON.parse(fs.readFileSync(pluginPath, 'utf8')).version, '1.4.2');

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('release helper rejects invalid explicit version input', async () => {
  const { parseReleaseVersion, runReleaseCli } = await import('../scripts/release.mjs');

  assert.throws(() => parseReleaseVersion('minor'), /major\.minor\.patch/);
  assert.throws(() => parseReleaseVersion('1.2'), /major\.minor\.patch/);
  assert.throws(() => parseReleaseVersion('1.2.3.4'), /major\.minor\.patch/);
  assert.throws(() => parseReleaseVersion('1.2.x'), /major\.minor\.patch/);
  assert.throws(() => parseReleaseVersion('01.2.3'), /major\.minor\.patch/);
  assert.throws(() => parseReleaseVersion('1.02.3'), /major\.minor\.patch/);
  assert.throws(() => parseReleaseVersion('1.2.03'), /major\.minor\.patch/);
  assert.throws(() => runReleaseCli([]), /npm run release -- <major\.minor\.patch>/);
  assert.throws(() => runReleaseCli(['1.2.3', '1.2.4']), /npm run release -- <major\.minor\.patch>/);
});

test('release helper validates both targets before writing either file', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agentic-workflows-release-'));
  const packagePath = path.join(tempRoot, 'package.json');
  const pluginPath = path.join(tempRoot, '.claude-plugin', 'plugin.json');
  const startingVersion = '0.2.0';

  fs.writeFileSync(
    packagePath,
    `${JSON.stringify({ name: 'fixture', version: startingVersion }, null, 2)}\n`
  );

  const { updateReleaseVersion } = await import('../scripts/release.mjs');

  assert.throws(() => updateReleaseVersion('1.4.2', { packagePath, pluginPath }), /ENOENT/);
  assert.equal(JSON.parse(fs.readFileSync(packagePath, 'utf8')).version, startingVersion);

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('README documents the version bump rule for intentional shipped changes', () => {
  const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8');

  assert.match(readme, /intentional shipped changes must bump the version/i);
  assert.match(readme, /patch, minor, or major/i);
  assert.match(readme, /npm run release -- <version>/i);
});

test('AGENTS documents version bump responsibility and release script guidance', () => {
  const agents = fs.readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8');

  assert.match(agents, /intentional shipped changes must include a version bump/i);
  assert.match(agents, /patch, minor, or major/i);
  assert.match(agents, /npm run release -- <version>/i);
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

test('workflow skill requires approval before the first real external request', () => {
  const workflowSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    'utf8'
  );

  assert.match(workflowSkill, /first real external request.*require.*approval/i);
  assert.match(workflowSkill, /read-only.*`GET`/i);
});

test('workflow skill allows reusing an approved live verification request within the same task', () => {
  const workflowSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    'utf8'
  );

  assert.match(workflowSkill, /approved live verification request/i);
  assert.match(workflowSkill, /reuse.*same task/i);
});

test('workflow skill requires re-approval when the live verification request changes materially', () => {
  const workflowSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    'utf8'
  );

  assert.match(workflowSkill, /method, endpoint, auth scope, or request shape changes materially/i);
  assert.match(workflowSkill, /ask again/i);
});

test('workflow skill requires disclosure when only local or mocked verification was done', () => {
  const workflowSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    'utf8'
  );
  const tddSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'test-driven-development', 'SKILL.md'),
    'utf8'
  );

  assert.match(workflowSkill, /local or mocked verification/i);
  assert.match(workflowSkill, /live external (behavior|verification) remains unconfirmed/i);
  assert.match(tddSkill, /tests do not prove live external access/i);
});

test('workflow guidance distinguishes local mocked, local integration, and live external verification levels', () => {
  const workflowSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    'utf8'
  );
  const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8');

  assert.match(workflowSkill, /local or mocked verification, local integration verification, and live external verification/i);
  assert.match(readme, /local or mocked verification, local integration verification, and live external verification/i);
});

test('review guidance flags missing live-verification disclosure for external integration claims', () => {
  const reviewingSkill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'reviewing-code', 'SKILL.md'),
    'utf8'
  );
  const codeReviewer = fs.readFileSync(
    path.join(projectRoot, 'agents', 'code-reviewer.md'),
    'utf8'
  );

  assert.match(reviewingSkill, /external integration claims/i);
  assert.match(reviewingSkill, /live-verified|live verified/i);
  assert.match(reviewingSkill, /missing live-verification disclosure/i);
  assert.match(codeReviewer, /missing live-verification disclosure/i);
  assert.match(codeReviewer, /correctness finding/i);
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

test('brainstorming skill keeps specs required but temporary by default', () => {
  const skill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'brainstorming', 'SKILL.md'),
    'utf8'
  );

  assert.match(skill, /write the spec/i);
  assert.match(skill, /temporary workflow artifact/i);
  assert.match(skill, /delete .* by default after successful implementation and verification/i);
  assert.match(skill, /user explicitly asks to keep it/i);
});

test('writing-plans skill keeps plans required but temporary by default', () => {
  const skill = fs.readFileSync(
    path.join(projectRoot, 'skills', 'writing-plans', 'SKILL.md'),
    'utf8'
  );

  assert.match(skill, /save the plan/i);
  assert.match(skill, /temporary workflow artifact/i);
  assert.match(skill, /delete .* by default after successful implementation and verification/i);
  assert.match(skill, /user explicitly asks to keep it/i);
});

test('active repo-owned workflow skills require project-local tmp workspaces', () => {
  const workflowSkills = [
    path.join(projectRoot, 'skills', 'brainstorming', 'SKILL.md'),
    path.join(projectRoot, 'skills', 'writing-plans', 'SKILL.md'),
    path.join(projectRoot, 'skills', 'feature-development-workflow', 'SKILL.md'),
    path.join(projectRoot, 'skills', 'subagent-driven-development', 'SKILL.md'),
    path.join(projectRoot, 'skills', 'orchestrating-workflows', 'SKILL.md'),
  ];

  for (const skillPath of workflowSkills) {
    const skill = fs.readFileSync(skillPath, 'utf8');

    assert.match(skill, /`\.\/tmp\/` at the project root/i);
    assert.match(skill, /do not use `\/tmp\/` or other system temp directories/i);
  }
});

test('repo guidance distinguishes transient workflow artifacts from durable docs', () => {
  const agents = fs.readFileSync(path.join(projectRoot, 'AGENTS.md'), 'utf8');
  const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8');

  assert.match(agents, /specs in `docs\/specs\/` and plans in `docs\/plans\/` are temporary workflow artifacts/i);
  assert.match(agents, /delete them by default after successful implementation and verification/i);
  assert.match(agents, /`docs\/adr\/` and maintained `README` content are durable documentation/i);

  assert.match(readme, /specs and plans are temporary workflow artifacts by default/i);
  assert.match(readme, /docs\/adr\//i);
  assert.match(readme, /maintained README content/i);
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
