import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('global background color', () => {
	it('sets body background to light green', () => {
		const layout = readFileSync(
			resolve(__dirname, '../routes/+layout.svelte'),
			'utf-8'
		);
		expect(layout).toContain('#e8f5e9');
	});
});
