import { page } from 'vitest/browser';
import { afterEach, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ExperienceEditorTestHarness from './ExperienceEditorTestHarness.svelte';

afterEach(() => vi.restoreAllMocks());

it('resets bullet selection when switching jobs and preserves edited wording', async () => {
	vi.spyOn(globalThis, 'fetch').mockImplementation(async () => Response.json([]));
	await render(ExperienceEditorTestHarness, {
		data: {
			title: 'Experience',
			jobs: [
				{
					id: 'first',
					role: 'First role',
					company: '',
					dates: '',
					location: '',
					bullets: [{ content: 'First bullet' }, { content: 'Second bullet' }]
				},
				{
					id: 'second',
					role: 'Second role',
					company: '',
					dates: '',
					location: '',
					bullets: [{ content: 'Other job bullet' }]
				}
			]
		}
	});

	await page.getByRole('button', { name: 'Edit bullet 2', exact: true }).click();
	await page.getByRole('textbox', { name: 'Bullet text', exact: true }).fill('Edited wording');
	await page.getByRole('button', { name: 'Edit job 2', exact: true }).click();
	await expect
		.element(page.getByRole('textbox', { name: 'Bullet text', exact: true }))
		.toHaveValue('Other job bullet');

	await page.getByRole('button', { name: 'Add job', exact: true }).click();
	await expect
		.element(page.getByRole('textbox', { name: 'Bullet text', exact: true }))
		.not.toBeInTheDocument();
	await page.getByRole('button', { name: 'Remove job', exact: true }).click();
	await expect
		.element(page.getByRole('textbox', { name: 'Bullet text', exact: true }))
		.toHaveValue('Other job bullet');

	await page.getByRole('button', { name: 'Edit job 1', exact: true }).click();
	await expect
		.element(page.getByRole('textbox', { name: 'Bullet text', exact: true }))
		.toHaveValue('First bullet');
	await page.getByRole('button', { name: 'Edit bullet 2', exact: true }).click();
	await expect
		.element(page.getByRole('textbox', { name: 'Bullet text', exact: true }))
		.toHaveValue('Edited wording');
});
