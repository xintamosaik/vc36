<script lang="ts">
	import { resolve } from '$app/paths';

	let { active }: { active: 'editor' | 'preview' } = $props();
</script>

<nav class="workspace-nav" aria-label="CV workspace">
	<a
		class:active={active === 'preview'}
		href={resolve('/print-preview')}
		aria-label="Print preview"
		aria-current={active === 'preview' ? 'page' : undefined}
		title="Print preview"
	>
		<span aria-hidden="true">👁️</span>
		<span class="tooltip" role="tooltip">Print preview</span>
	</a>
	<a
		class:active={active === 'editor'}
		href={resolve('/')}
		aria-label="Editor"
		aria-current={active === 'editor' ? 'page' : undefined}
		title="Editor"
	>
		<span aria-hidden="true">🛠️</span>
		<span class="tooltip" role="tooltip">Editor</span>
	</a>
	<button type="button" aria-label="Documents" title="Documents (coming soon)" disabled>
		<span aria-hidden="true">📚</span>
		<span class="tooltip" role="tooltip">Documents (coming soon)</span>
	</button>
</nav>

<style>
	.workspace-nav {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.workspace-nav a,
	.workspace-nav button {
		position: relative;
		box-sizing: border-box;
		display: grid;
		width: 3.75rem;
		height: 3.75rem;
		flex: none;
		place-items: center;
		cursor: pointer;
		border: 1px solid #575751;
		border-radius: 0.625rem;
		background: #323330;
		padding: 0.25rem;
		color: #deddd7;
		font: inherit;
		font-size: 1.5rem;
		text-decoration: none;
	}

	.workspace-nav a:hover,
	.workspace-nav button:not(:disabled):hover {
		background: #41423e;
	}

	.workspace-nav a:focus-visible,
	.workspace-nav button:focus-visible {
		z-index: 1;
		outline: 2px solid #b4cbe6;
		outline-offset: 2px;
	}

	.workspace-nav a.active {
		border-color: #9ab5d6;
		background: #39495b;
		color: #fff;
	}

	.workspace-nav button:disabled {
		cursor: not-allowed;
		opacity: 0.65;
	}

	.tooltip {
		position: absolute;
		z-index: 2;
		top: calc(100% + 0.5rem);
		left: 50%;
		width: max-content;
		max-width: min(18rem, 80vw);
		border: 1px solid #696a64;
		border-radius: 0.375rem;
		background: #20211f;
		padding: 0.5rem 0.625rem;
		color: #f0eee7;
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.4;
		text-align: left;
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
		transform: translateX(-50%);
		transition: opacity 120ms ease;
	}

	.workspace-nav a:hover .tooltip,
	.workspace-nav a:focus-visible .tooltip,
	.workspace-nav button:hover .tooltip,
	.workspace-nav button:focus-visible .tooltip {
		visibility: visible;
		opacity: 1;
	}

	@media print {
		.workspace-nav {
			display: none;
		}
	}
</style>
