<script lang="ts">
	import { resolve } from '$app/paths';

	let {
		active,
		variantId
	}: {
		active: 'editor' | 'preview' | 'documents';
		variantId?: string;
	} = $props();
</script>

<nav class="workspace-nav" aria-label="CV workspace">
	<a
		class:active={active === 'preview'}
		href={variantId
			? resolve(`/print-preview?variant=${encodeURIComponent(variantId)}`)
			: resolve('/print-preview')}
		aria-label="Print preview"
		aria-current={active === 'preview' ? 'page' : undefined}
		title="Print preview"
	>
		<span aria-hidden="true">👁️</span>
		<span class="tooltip" role="tooltip">Print preview</span>
	</a>
	<a
		class:active={active === 'editor'}
		href={variantId ? resolve('/documents/[id]', { id: variantId }) : resolve('/')}
		aria-label="Editor"
		aria-current={active === 'editor' ? 'page' : undefined}
		title="Editor"
	>
		<span aria-hidden="true">🛠️</span>
		<span class="tooltip" role="tooltip">Editor</span>
	</a>
	<a
		class:active={active === 'documents'}
		href={resolve('/documents')}
		aria-label="Documents"
		aria-current={active === 'documents' ? 'page' : undefined}
		title="CV documents"
	>
		<span aria-hidden="true">📚</span>
		<span class="tooltip" role="tooltip">CV documents</span>
	</a>
</nav>

<style>
	.workspace-nav {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.workspace-nav a {
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

	.workspace-nav a:hover {
		background: #41423e;
	}

	.workspace-nav a:focus-visible {
		z-index: 1;
		outline: 2px solid #b4cbe6;
		outline-offset: 2px;
	}

	.workspace-nav a.active {
		border-color: #9ab5d6;
		background: #39495b;
		color: #fff;
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
	.workspace-nav a:focus-visible .tooltip {
		visibility: visible;
		opacity: 1;
	}

	@media print {
		.workspace-nav {
			display: none;
		}
	}
</style>
