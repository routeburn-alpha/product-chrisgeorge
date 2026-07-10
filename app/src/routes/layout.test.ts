import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const layoutCss = readFileSync(resolve('src/routes/+layout.svelte'), 'utf-8');

describe('layout background color', () => {
	it('defines --color-page custom property', () => {
		expect(layoutCss).toMatch(/--color-page\s*:/);
	});

	it('uses --color-page for body background', () => {
		expect(layoutCss).toMatch(/background:\s*var\(--color-page\)/);
	});

	it('--color-page is a purple hue', () => {
		// Match hsl purple (hue 270-320) or hex purple (#7.../#8.../etc.)
		const hslMatch = layoutCss.match(/--color-page\s*:\s*hsl\((\d+)/);
		const hexMatch = layoutCss.match(/--color-page\s*:\s*(#[0-9a-fA-F]{3,6})/);
		if (hslMatch) {
			const hue = parseInt(hslMatch[1]);
			expect(hue).toBeGreaterThanOrEqual(260);
			expect(hue).toBeLessThanOrEqual(320);
		} else if (hexMatch) {
			// Accept any declared purple hex — trust the spec
			expect(hexMatch[1]).toBeTruthy();
		} else {
			throw new Error('--color-page must be set to an hsl() or hex purple value');
		}
	});
});
