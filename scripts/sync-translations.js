#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');
const enPath = path.join(messagesDir, 'en.json');
const koPath = path.join(messagesDir, 'ko.json');

// Read English and Korean translations (source of truth)
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ko = JSON.parse(fs.readFileSync(koPath, 'utf8'));

// Get all language files except en and ko
const langFiles = fs.readdirSync(messagesDir)
  .filter(f => f.endsWith('.json') && f !== 'en.json' && f !== 'ko.json');

// Deep merge function to add missing keys
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (!(key in result)) {
      result[key] = source[key];
    }
  }

  return result;
}

// Update each language file
langFiles.forEach(file => {
  const langPath = path.join(messagesDir, file);
  const lang = JSON.parse(fs.readFileSync(langPath, 'utf8'));

  // Merge English translations for missing keys
  const updated = deepMerge(lang, en);

  // Write back with proper formatting
  fs.writeFileSync(langPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');

  console.log(`✅ Updated ${file}`);
});

console.log('\n✨ All translation files have been synchronized with en.json!');
console.log('📝 Missing keys have been filled with English translations.');
console.log('🌐 Consider using a translation service for production-ready translations.');
