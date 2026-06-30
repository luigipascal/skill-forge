import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cursorSkillsDir } from './install-curated.js';
import { validateSkillMd } from './validate.js';

export function runDoctor(): number {
  const nodeOk = Number(process.version.slice(1).split('.')[0]) >= 20;
  console.log(`Node.js ${process.version} ${nodeOk ? '✓' : '✗ (need >= 20)'}`);

  const personal = cursorSkillsDir();
  const personalExists = existsSync(personal);
  console.log(`Cursor personal skills: ${personal} ${personalExists ? '✓' : '(not created yet)'}`);

  if (personalExists) {
    const dirs = readdirSync(personal).filter((d) =>
      existsSync(join(personal, d, 'SKILL.md')),
    );
    console.log(`  ${dirs.length} skill(s): ${dirs.join(', ') || '(none)'}`);
    let invalid = 0;
    for (const d of dirs) {
      const r = validateSkillMd(join(personal, d, 'SKILL.md'));
      if (r.issues.some((i) => i.level === 'error')) invalid++;
    }
    if (invalid) console.log(`  ${invalid} skill(s) with validation errors`);
  }

  const projectSkills = join(process.cwd(), '.cursor', 'skills');
  if (existsSync(projectSkills)) {
    const dirs = readdirSync(projectSkills).filter((d) =>
      existsSync(join(projectSkills, d, 'SKILL.md')),
    );
    console.log(`Project skills (.cursor/skills): ${dirs.length} — ${dirs.join(', ')}`);
  }

  console.log('\nTip: run `skill-forge install-curated` to add mcp-builder, webapp-testing, and more.');
  return nodeOk ? 0 : 1;
}
