#!/usr/bin/env node
// Adds questionType: "arsenal_general" to any question missing the field.
// Safe to re-run — skips questions that already have questionType set.
// Usage: node scripts/migrate-question-types.js

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = resolve(__dirname, '../src/lib/data/packs');

const files = readdirSync(PACKS_DIR).filter((f) => f.endsWith('.json'));
let totalUpdated = 0;

for (const file of files) {
	const path = resolve(PACKS_DIR, file);
	const pack = JSON.parse(readFileSync(path, 'utf-8'));
	let changed = false;

	for (const question of pack.questions) {
		if (!question.questionType) {
			question.questionType = 'arsenal_general';
			changed = true;
			totalUpdated++;
		}
	}

	if (changed) {
		writeFileSync(path, JSON.stringify(pack, null, 2) + '\n');
		console.log(`Updated ${file} (${pack.questions.filter((q) => q.questionType === 'arsenal_general').length} questions)`);
	} else {
		console.log(`Skipped ${file} (already migrated)`);
	}
}

console.log(`\nDone. ${totalUpdated} questions updated.`);
