import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { validateSkillMd } from './validate.js';
import { initSkill } from './init.js';
import { convertCommands, convertMdcRules } from './convert.js';
import { cursorSkillsDir, installCurated, CURATED_SKILLS } from './install-curated.js';
import { runDoctor } from './doctor.js';

function discoverSkillPaths(targets: string[]): string[] {
  const paths: string[] = [];
  for (const target of targets) {
    if (!existsSync(target)) continue;
    const st = statSync(target);
    if (st.isFile() && target.endsWith('SKILL.md')) {
      paths.push(target);
      continue;
    }
    if (st.isFile()) continue;

    const direct = join(target, 'SKILL.md');
    if (existsSync(direct)) {
      paths.push(direct);
      continue;
    }

    for (const entry of readdirSync(target)) {
      const sub = join(target, entry);
      if (!statSync(sub).isDirectory()) continue;
      const skillMd = join(sub, 'SKILL.md');
      if (existsSync(skillMd)) paths.push(skillMd);
    }
  }
  return [...new Set(paths)];
}

function cmdValidate(args: string[]): number {
  const targets = args.length ? args : ['.'];
  const paths = discoverSkillPaths(targets);
  if (!paths.length) {
    console.error('No SKILL.md files found.');
    return 1;
  }

  let errors = 0;
  let warns = 0;
  for (const p of paths) {
    const result = validateSkillMd(p);
    const err = result.issues.filter((i) => i.level === 'error');
    const warn = result.issues.filter((i) => i.level === 'warn');
    errors += err.length;
    warns += warn.length;

    const icon = err.length ? 'FAIL' : warn.length ? 'WARN' : 'OK';
    console.log(`[${icon}] ${result.name ?? '?'} — ${p}`);
    for (const issue of result.issues) {
      console.log(`  ${issue.level}: ${issue.message}`);
    }
  }

  console.log(`\n${paths.length} skill(s), ${errors} error(s), ${warns} warning(s)`);
  return errors ? 1 : 0;
}

function cmdInit(args: string[]): number {
  const nameIdx = args.indexOf('--name');
  const descIdx = args.indexOf('--desc');
  const scopeIdx = args.indexOf('--scope');
  const name = nameIdx >= 0 ? args[nameIdx + 1] : args[0];
  const description =
    descIdx >= 0
      ? args[descIdx + 1]
      : 'Describe what this skill does and when the agent should use it.';
  const scope = scopeIdx >= 0 && args[scopeIdx + 1] === 'personal' ? 'personal' : 'project';

  if (!name) {
    console.error('Usage: skill-forge init <name> [--desc "..."] [--scope personal|project]');
    return 1;
  }

  const cwd = process.cwd();
  const path = initSkill({
    name,
    description,
    targetDir: cwd,
    scope,
  });
  console.log(`Created ${path}`);
  return cmdValidate([path]);
}

function cmdConvert(args: string[]): number {
  const dryRun = args.includes('--dry-run');
  const root = args.find((a) => !a.startsWith('--')) ?? process.cwd();
  const mdc = convertMdcRules(root, dryRun);
  const cmds = convertCommands(root, dryRun);

  console.log(dryRun ? '(dry run)\n' : '');
  if (mdc.converted.length) {
    console.log('Converted rules → skills:');
    mdc.converted.forEach((p) => console.log(`  + ${p}`));
  }
  if (cmds.converted.length) {
    console.log('Converted commands → skills:');
    cmds.converted.forEach((p) => console.log(`  + ${p}`));
  }
  if (mdc.skipped.length) {
    console.log('\nSkipped rules:');
    mdc.skipped.forEach((p) => console.log(`  - ${p}`));
  }
  if (!mdc.converted.length && !cmds.converted.length) {
    console.log('Nothing to convert.');
  }
  return 0;
}

function cmdInstallCurated(args: string[]): number {
  const force = args.includes('--force');
  console.log(`Installing curated skills to ${cursorSkillsDir()}`);
  const { installed, skipped, errors } = installCurated({ force });

  if (installed.length) {
    console.log('\nInstalled:');
    installed.forEach((s) => console.log(`  ✓ ${s}`));
  }
  if (skipped.length) {
    console.log('\nSkipped (already present, use --force):');
    skipped.forEach((s) => console.log(`  - ${s}`));
  }
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach((e) => console.log(`  ! ${e}`));
    return 1;
  }

  console.log(`\nCurated set: ${CURATED_SKILLS.join(', ')}`);
  console.log('Source: https://github.com/anthropics/skills (Apache 2.0 examples)');
  return 0;
}

function printHelp(): void {
  console.log(`skill-forge — Agent Skills toolkit for Cursor

Commands:
  validate [paths...]     Validate SKILL.md files (default: current dir)
  init <name>             Scaffold a new skill (--scope personal|project)
  convert [projectRoot]   Convert .cursor/rules/*.mdc and commands → skills
  install-curated         Copy best anthropics/skills into ~/.cursor/skills/
  doctor                  Check Node, Cursor skills folder, validation status
  help                    Show this help

Examples:
  npm run dev validate examples
  npm run dev init my-skill --desc "Does X when user asks Y"
  npm run dev convert D:\\MyProject
  npm run dev install-curated
  npm run setup             Full build + validate + install curated skills
`);
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;
  let code = 0;

  switch (command) {
    case 'validate':
      code = cmdValidate(args);
      break;
    case 'init':
      code = cmdInit(args);
      break;
    case 'convert':
      code = cmdConvert(args);
      break;
    case 'install-curated':
      code = cmdInstallCurated(args);
      break;
    case 'doctor':
      code = runDoctor();
      break;
    case 'help':
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      code = 1;
  }

  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
