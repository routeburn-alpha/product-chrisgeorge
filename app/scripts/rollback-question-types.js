#!/usr/bin/env node
// Removes questionType and rivalTeamId from all questions, reverting to the pre-migration schema.
// Usage: node scripts/rollback-question-types.js

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = resolve(__dirname, '../src/lib/data/packs');

const files = readdirSync(PACKS_DIR).filter((f) => f.endsWith('.json'));
let totalReverted = 0;

for (const file of files) {
	const path = resolve(PACKS_DIR, file);
	const pack = JSON.parse(readFileSync(path, 'utf-8'));
	let changed = false;

	for (const question of pack.questions) {
		if ('questionType' in question || 'rivalTeamId' in question) {
			delete question.questionType;
			delete question.rivalTeamId;
			changed = true;
			totalReverted++;
		}
	}

	if (changed) {
		writeFileSync(path, JSON.stringify(pack, null, 2) + '\n');
		console.log(`Reverted ${file}`);
	} else {
		console.log(`Skipped ${file} (nothing to revert)`);
	}
}

console.log(`\nDone. ${totalReverted} questions reverted.`);
