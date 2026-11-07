import { describe, expect, it } from 'vitest';
import { parseFatText, stringifyFatText } from '#lib/fat-text.js';

describe('parseFatText', () => {
	it('parses double-hash emphasis and leaves other text plain', () => {
		expect(parseFatText('Before ##bold## after *not italic*')).toEqual([
			'Before ',
			{ text: 'bold', strong: true },
			' after *not italic*'
		]);
	});

	it('leaves unmatched delimiters as plain text', () => {
		expect(parseFatText('Literal ## delimiter')).toEqual(['Literal ## delimiter']);
	});

	it('converts legacy rich-text segments to FAT text', () => {
		expect(stringifyFatText([{ text: 'Bold', strong: true }, ' and ', { text: 'plain' }])).toBe(
			'##Bold## and plain'
		);
	});
});
