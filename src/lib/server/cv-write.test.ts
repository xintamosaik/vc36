import { expect, it } from 'vitest';
import { withCvWrite } from './cv-write.js';

it('keeps a reference check and write together before the next mutation starts', async () => {
	const events: string[] = [];
	let release!: () => void;
	const gate = new Promise<void>((resolve) => {
		release = resolve;
	});
	const first = withCvWrite(async () => {
		events.push('check');
		await gate;
		events.push('write');
	});
	const second = withCvWrite(async () => {
		events.push('next mutation');
	});
	await Promise.resolve();
	expect(events).toEqual(['check']);
	release();
	await Promise.all([first, second]);
	expect(events).toEqual(['check', 'write', 'next mutation']);
});
