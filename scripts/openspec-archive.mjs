#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CHANGES_DIR = 'openspec/changes';
const ARCHIVE_DIR = join(CHANGES_DIR, 'archive');
const SPECS_DIR = 'openspec/specs';
const INDEX_PATH = 'openspec/INDEX.md';

function log(msg) {
  console.log(`[openspec-archive] ${msg}`);
}

function warn(msg) {
  console.warn(`[openspec-archive] WARNING: ${msg}`);
}

function parseYaml(content) {
  const result = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (match) {
      result[match[1]] = match[2].trim();
    }
  }
  return result;
}

function stringifyYaml(obj) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      lines.push(`${key}: ${value}`);
    } else if (value === '') {
      lines.push(`${key}:`);
    }
  }
  return lines.join('\n') + '\n';
}

function discoverChanges() {
  if (!existsSync(CHANGES_DIR)) return [];

  const entries = readdirSync(CHANGES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name !== 'archive')
    .map((e) => e.name);
}

function readOpenSpecYaml(changeName) {
  const yamlPath = join(CHANGES_DIR, changeName, '.openspec.yaml');
  if (!existsSync(yamlPath)) {
    warn(`${changeName}: .openspec.yaml not found, skipping`);
    return null;
  }
  const content = readFileSync(yamlPath, 'utf-8');
  return parseYaml(content);
}

function updateOpenSpecYaml(changeName, yamlData) {
  const yamlPath = join(ARCHIVE_DIR, changeName, '.openspec.yaml');
  yamlData.status = 'applied';
  writeFileSync(yamlPath, stringifyYaml(yamlData), 'utf-8');
}

function moveToArchive(changeName) {
  const src = join(CHANGES_DIR, changeName);
  const dst = join(ARCHIVE_DIR, changeName);

  if (existsSync(dst)) {
    warn(`${changeName}: already exists in archive, skipping`);
    return false;
  }

  if (!existsSync(ARCHIVE_DIR)) {
    mkdirSync(ARCHIVE_DIR, { recursive: true });
  }

  renameSync(src, dst);
  log(`${changeName}: moved to archive`);
  return true;
}

function closeIssue(issueUrl) {
  if (!issueUrl) return;

  const match = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) {
    warn(`Cannot parse issue URL: ${issueUrl}`);
    return;
  }

  const issueNumber = match[3];
  try {
    execSync(
      `gh issue close ${issueNumber} --comment "Merged and archived."`,
      { stdio: 'pipe' }
    );
    log(`Issue #${issueNumber} closed`);
  } catch (err) {
    warn(`Failed to close issue #${issueNumber}: ${err.message}`);
  }
}

function parseSpecSections(specContent) {
  const sections = { ADDED: [], MODIFIED: [], REMOVED: [], OTHER: [] };
  const lines = specContent.split('\n');

  let currentSection = 'OTHER';
  let currentBlock = [];
  let inRequirement = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^## ADDED/i.test(line)) {
      if (currentBlock.length > 0) {
        sections[currentSection].push(currentBlock.join('\n'));
        currentBlock = [];
      }
      currentSection = 'ADDED';
      inRequirement = false;
      continue;
    }
    if (/^## MODIFIED/i.test(line)) {
      if (currentBlock.length > 0) {
        sections[currentSection].push(currentBlock.join('\n'));
        currentBlock = [];
      }
      currentSection = 'MODIFIED';
      inRequirement = false;
      continue;
    }
    if (/^## REMOVED/i.test(line)) {
      if (currentBlock.length > 0) {
        sections[currentSection].push(currentBlock.join('\n'));
        currentBlock = [];
      }
      currentSection = 'REMOVED';
      inRequirement = false;
      continue;
    }
    // Reset section on next top-level heading
    if (/^## [A-Z]/.test(line) && !/^## (ADDED|MODIFIED|REMOVED)/i.test(line)) {
      if (currentBlock.length > 0) {
        sections[currentSection].push(currentBlock.join('\n'));
        currentBlock = [];
      }
      currentSection = 'OTHER';
      inRequirement = false;
      continue;
    }

    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    sections[currentSection].push(currentBlock.join('\n'));
  }

  return sections;
}

function extractRequirementName(block) {
  const match = block.match(/^### Requirement:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function mergeSpecs(changeName) {
  const specsDir = join(ARCHIVE_DIR, changeName, 'specs');
  if (!existsSync(specsDir)) {
    log(`${changeName}: no specs/ directory, skipping spec merge`);
    return;
  }

  if (!existsSync(SPECS_DIR)) {
    mkdirSync(SPECS_DIR, { recursive: true });
  }

  const entries = readdirSync(specsDir, { withFileTypes: true });
  const domains = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  for (const domain of domains) {
    const srcPath = join(specsDir, domain, 'spec.md');
    const dstPath = join(SPECS_DIR, domain, 'spec.md');

    if (!existsSync(srcPath)) {
      warn(`${changeName}: no spec.md in specs/${domain}/, skipping`);
      continue;
    }

    const srcContent = readFileSync(srcPath, 'utf-8');
    const sections = parseSpecSections(srcContent);

    if (!existsSync(dstPath)) {
      const domainDir = join(SPECS_DIR, domain);
      if (!existsSync(domainDir)) {
        mkdirSync(domainDir, { recursive: true });
      }
      writeFileSync(dstPath, `# ${domain}\n\n`, 'utf-8');
    }

    let dstContent = readFileSync(dstPath, 'utf-8');

    // ADDED — append to end with a source note
    for (const block of sections.ADDED) {
      if (block.trim()) {
        dstContent += `\n${block.trim()}\n<!-- source: ${changeName} -->\n`;
      }
    }

    // MODIFIED — replace matching requirement
    for (const block of sections.MODIFIED) {
      const reqName = extractRequirementName(block);
      if (!reqName || !block.trim()) continue;

      const reqRegex = new RegExp(
        `### Requirement:\\s*${escapeRegex(reqName)}[\\s\\S]*?(?=### Requirement:|<!-- source:|$)`
      );

      if (reqRegex.test(dstContent)) {
        dstContent = dstContent.replace(
          reqRegex,
          `${block.trim()}\n<!-- source: ${changeName} -->\n\n`
        );
        log(`${changeName}: modified requirement "${reqName}" in ${domain}/spec.md`);
      } else {
        dstContent += `\n${block.trim()}\n<!-- source: ${changeName} (intended as MODIFIED) -->\n`;
        warn(`${changeName}: requirement "${reqName}" not found in ${domain}/spec.md, appended`);
      }
    }

    // REMOVED — mark as removed
    for (const block of sections.REMOVED) {
      const reqName = extractRequirementName(block);
      if (!reqName || !block.trim()) continue;

      const reqRegex = new RegExp(
        `### Requirement:\\s*${escapeRegex(reqName)}[\\s\\S]*?(?=### Requirement:|<!-- source:|$)`
      );

      if (reqRegex.test(dstContent)) {
        dstContent = dstContent.replace(
          reqRegex,
          `### Requirement: ${reqName} [REMOVED]\n<!-- source: ${changeName} -->\n\n`
        );
        log(`${changeName}: marked requirement "${reqName}" as REMOVED in ${domain}/spec.md`);
      }
    }

    // OTHER — append with source note
    for (const block of sections.OTHER) {
      if (block.trim() && !/^(#|<!--)/.test(block.trim())) {
        dstContent += `\n${block.trim()}\n<!-- source: ${changeName} -->\n`;
      }
    }

    writeFileSync(dstPath, dstContent, 'utf-8');
    log(`${changeName}: merged specs into ${domain}/spec.md`);
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateIndex(changeName, yamlData) {
  const specsDir = join(ARCHIVE_DIR, changeName, 'specs');
  const domains = [];

  if (existsSync(specsDir)) {
    const entries = readdirSync(specsDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory() && existsSync(join(specsDir, e.name, 'spec.md'))) {
        domains.push(e.name);
      }
    }
  }

  if (domains.length === 0) {
    log(`${changeName}: no specs to update in INDEX`);
    return;
  }

  if (!existsSync(INDEX_PATH)) {
    writeFileSync(
      INDEX_PATH,
      '# OpenSpec 规范索引\n\n> 新需求开始前，先查阅此索引了解当前系统规范，避免设计与已有规范冲突。\n> 每个领域列出核心需求和关键词，匹配后可深入阅读对应 spec.md。\n\n',
      'utf-8'
    );
  }

  let indexContent = readFileSync(INDEX_PATH, 'utf-8');

  for (const domain of domains) {
    const specPath = join(SPECS_DIR, domain, 'spec.md');
    const entryRegex = new RegExp(
      `## ${escapeRegex(domain)} — .*\\n(?:- \\*\\*关键词:.*\\n)?(?:- \\*\\*需求:.*\\n)?(?:- \\*\\*路径:.*\\n)?`,
      'm'
    );

    if (entryRegex.test(indexContent)) {
      // Update existing entry — keep it simple, just ensure path is correct
      log(`INDEX: domain "${domain}" already exists, skipping update`);
    } else {
      // New domain — add entry
      let keywords = domain;
      let summary = `(见 spec.md)`;

      if (existsSync(specPath)) {
        const specContent = readFileSync(specPath, 'utf-8');
        const reqMatches = specContent.match(/^### Requirement:\s*(.+)$/gm);
        if (reqMatches) {
          const requirements = reqMatches
            .map((r) => r.replace(/^### Requirement:\s*/, '').replace(/ \[REMOVED\]$/, ''))
            .filter((r) => !r.includes('[REMOVED]'));
          if (requirements.length > 0) {
            summary = requirements.join(', ');
          }
        }
      }

      const entry = `\n## ${domain} — ${keywords}\n- **关键词:** ${keywords}\n- **需求:** ${summary}\n- **路径:** \`openspec/specs/${domain}/spec.md\`\n`;
      indexContent += entry;
      log(`INDEX: added domain "${domain}"`);
    }
  }

  writeFileSync(INDEX_PATH, indexContent, 'utf-8');
}

function main() {
  log('Starting auto-archive...');

  const changes = discoverChanges();
  if (changes.length === 0) {
    log('No changes found in openspec/changes/');
    process.exit(0);
  }

  const approvedChanges = [];

  for (const changeName of changes) {
    const yamlData = readOpenSpecYaml(changeName);
    if (!yamlData) continue;

    if (yamlData.status === 'approved') {
      approvedChanges.push({ name: changeName, yaml: yamlData });
    } else {
      log(`${changeName}: status=${yamlData.status}, skipping`);
    }
  }

  if (approvedChanges.length === 0) {
    log('No approved changes found');
    process.exit(0);
  }

  log(`Found ${approvedChanges.length} approved change(s)`);

  let hasChanges = false;

  for (const { name, yaml } of approvedChanges) {
    log(`Processing: ${name}`);

    const moved = moveToArchive(name);
    if (!moved) continue;

    updateOpenSpecYaml(name, yaml);
    hasChanges = true;

    if (yaml.issue) {
      closeIssue(yaml.issue);
    }

    mergeSpecs(name);
    updateIndex(name, yaml);
  }

  if (hasChanges) {
    log('Archive complete. Commit these changes to persist.');
  } else {
    log('No changes were archived.');
  }
}

main();
