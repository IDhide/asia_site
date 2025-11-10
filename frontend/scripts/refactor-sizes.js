#!/usr/bin/env node

/**
 * Скрипт для автоматической замены размеров в SCSS файлах
 * small/medium/large → s/m/l
 * sm/md/lg → s/m/l (в контексте размеров, не spacing)
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Паттерны замены
const replacements = [
  // Button sizes в TypeScript/TSX
  { pattern: /size=["']small["']/g, replacement: 'size="s"' },
  { pattern: /size=["']medium["']/g, replacement: 'size="m"' },
  { pattern: /size=["']large["']/g, replacement: 'size="l"' },
  { pattern: /size:\s*["']small["']/g, replacement: 'size: "s"' },
  { pattern: /size:\s*["']medium["']/g, replacement: 'size: "m"' },
  { pattern: /size:\s*["']large["']/g, replacement: 'size: "l"' },
  
  // SCSS миксины - button sizes
  { pattern: /button-glass\(['"]sm['"]\)/g, replacement: 'button-glass("s")' },
  { pattern: /button-glass\(['"]md['"]\)/g, replacement: 'button-glass("m")' },
  { pattern: /button-glass\(['"]lg['"]\)/g, replacement: 'button-glass("l")' },
  { pattern: /button-toggle\(['"]sm['"]\)/g, replacement: 'button-toggle("s")' },
  { pattern: /button-toggle\(['"]md['"]\)/g, replacement: 'button-toggle("m")' },
  { pattern: /button-toggle\(['"]lg['"]\)/g, replacement: 'button-toggle("l")' },
  { pattern: /button-back\(['"]sm['"]\)/g, replacement: 'button-back("s")' },
  { pattern: /button-back\(['"]md['"]\)/g, replacement: 'button-back("m")' },
  { pattern: /button-back\(['"]lg['"]\)/g, replacement: 'button-back("l")' },
  
  // SCSS параметры миксинов
  { pattern: /\$size:\s*['"]sm['"]/g, replacement: '$size: "s"' },
  { pattern: /\$size:\s*['"]md['"]/g, replacement: '$size: "m"' },
  { pattern: /\$size:\s*['"]lg['"]/g, replacement: '$size: "l"' },
  
  // CSS классы
  { pattern: /button--small/g, replacement: 'button--s' },
  { pattern: /button--medium/g, replacement: 'button--m' },
  { pattern: /button--large/g, replacement: 'button--l' },
  
  // TypeScript types
  { pattern: /'small'\s*\|\s*'medium'\s*\|\s*'large'/g, replacement: "'xs' | 's' | 'm' | 'l' | 'xl'" },
  { pattern: /type\s+ButtonSize\s*=\s*['"]small['"][\s\S]*?['"]large['"]/g, replacement: 'type ButtonSize = "xs" | "s" | "m" | "l" | "xl"' },
];

// Файлы для обработки
const patterns = [
  'src/**/*.tsx',
  'src/**/*.ts',
  'src/**/*.scss',
  'src/**/*.css',
];

async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Searching for files to refactor...\n');
  
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: __dirname + '/..', absolute: true });
    files.push(...matches);
  }
  
  const uniqueFiles = [...new Set(files)];
  console.log(`📁 Found ${uniqueFiles.length} files\n`);
  
  let updatedCount = 0;
  
  for (const file of uniqueFiles) {
    if (await processFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n✨ Done! Updated ${updatedCount} files`);
}

main().catch(console.error);
