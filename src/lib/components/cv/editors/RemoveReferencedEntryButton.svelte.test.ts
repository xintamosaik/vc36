import { page } from 'vitest/browser';
import { afterEach, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RemoveReferencedEntryButton from './RemoveReferencedEntryButton.svelte';

afterEach(() => vi.restoreAllMocks());

const variant = {
	id: 'variant',
	name: 'Application CV',
	hiddenSections: [],
	sectionTitles: {},
	hiddenJobIds: ['job'],
	skillChanges: {},
	addedSkills: []
};

it('marks referenced entries undeletable and unlocks after references are removed', async () => {
	const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([variant]));
	const onRemove = vi.fn();
	await render(RemoveReferencedEntryButton, {
		id: 'job',
		section: 'experience',
		label: 'job',
		onRemove
	});
	await expect.element(page.getByRole('status')).toHaveTextContent('Application CV');
	await expect
		.element(page.getByRole('button', { name: 'Remove job', exact: true }))
		.toBeDisabled();
	expect(onRemove).not.toHaveBeenCalled();
	fetch.mockImplementation(async () => Response.json([]));
	await page.getByRole('button', { name: 'Check references again' }).click();
	await page.getByRole('button', { name: 'Remove job', exact: true }).click();
	expect(onRemove).toHaveBeenCalledOnce();
});

it('checks again before removal and catches references created in another tab', async () => {
	const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => Response.json([]));
	const onRemove = vi.fn();
	await render(RemoveReferencedEntryButton, {
		id: 'job',
		section: 'experience',
		label: 'job',
		onRemove
	});
	await expect.element(page.getByRole('button', { name: 'Remove job', exact: true })).toBeEnabled();
	fetch.mockImplementation(async () => Response.json([variant]));
	await page.getByRole('button', { name: 'Remove job', exact: true }).click();
	await expect.element(page.getByRole('status')).toHaveTextContent('Application CV');
	expect(onRemove).not.toHaveBeenCalled();
});

it('keeps the entry when checking fails and allows retrying', async () => {
	const fetch = vi
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(null, { status: 500 }));
	const onRemove = vi.fn();
	await render(RemoveReferencedEntryButton, {
		id: 'job',
		section: 'experience',
		label: 'job',
		onRemove
	});
	await expect.element(page.getByRole('alert')).toHaveTextContent('Could not check references');
	await expect
		.element(page.getByRole('button', { name: 'Remove job', exact: true }))
		.toBeDisabled();
	fetch.mockImplementation(async () => Response.json([]));
	await page.getByRole('button', { name: 'Check references again' }).click();
	await page.getByRole('button', { name: 'Remove job', exact: true }).click();
	expect(onRemove).toHaveBeenCalledOnce();
});
