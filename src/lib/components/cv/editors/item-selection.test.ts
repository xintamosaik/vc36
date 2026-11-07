import { describe, expect, it } from 'vitest';
import { selectedIndexAfterRemoval } from './item-selection.js';

describe('selectedIndexAfterRemoval', () => {
	it('selects the next item or the previous last item when removing the selected item', () => {
		expect(selectedIndexAfterRemoval(1, 1, 2)).toBe(1);
		expect(selectedIndexAfterRemoval(2, 2, 2)).toBe(1);
	});

	it('keeps selection aligned when removing an item before it', () => {
		expect(selectedIndexAfterRemoval(2, 0, 3)).toBe(1);
	});

	it('returns -1 when the final item is removed', () => {
		expect(selectedIndexAfterRemoval(0, 0, 0)).toBe(-1);
	});
});
