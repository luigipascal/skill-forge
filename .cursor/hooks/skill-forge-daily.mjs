#!/usr/bin/env node
/**
 * skill-forge daily bootstrap — runs once per calendar day on Cursor sessionStart.
 * Install: copy to ~/.cursor/hooks/ and add sessionStart entry in ~/.cursor/hooks.json
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOOKS_DIR = join(homedir(), '.cursor', 'hooks');
const STAMP = join(HOOKS_DIR, '.skill-forge-daily.last');
const LOG = join(HOOKS_DIR, 'skill-forge-daily.log');
const DEFAULT_ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), '..');
const ROOT = process.env.SKILL_FORGE_ROOT || DEFAULT_ROOT;
const today = new Date().toISOString().slice(0, 10);

function log(msg) {
  mkdirSync(HOOKS_DIR, { recursive: true });
  appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`, 'utf8');
}

async function drainStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
}

function alreadyRanToday() {
  try {
    return existsSync(STAMP) && readFileSync(STAMP, 'utf8').trim() === today;
  } catch {
    return false;
  }
}

function run(cmd) {
  log(`run: ${cmd}`);
  execSync(cmd, {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 180_000,
    windowsHide: true,
  });
}

try {
  await drainStdin();

  if (alreadyRanToday()) {
    process.exit(0);
  }

  if (!existsSync(join(ROOT, 'package.json'))) {
    log(`skip: skill-forge not found at ${ROOT}`);
    process.exit(0);
  }

  log(`start daily run (${today})`);

  if (!existsSync(join(ROOT, 'dist', 'cli.js'))) {
    run('npm run build');
  }

  run('npm run doctor');
  run('npm run install:curated');

  writeFileSync(STAMP, `${today}\n`, 'utf8');
  log('done');
} catch (err) {
  log(`error: ${err instanceof Error ? err.message : String(err)}`);
}

process.exit(0);
