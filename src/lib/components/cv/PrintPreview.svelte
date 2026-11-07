<div class="print-controls">
	<button type="button" onclick={() => window.print()}>Print / Save as PDF</button>
</div>

<style>
	.print-controls {
		padding: 1rem;
	}

	.print-controls button {
		cursor: pointer;
		border: 1px solid #aaa;
		border-radius: 0.25rem;
		padding: 0.5rem 0.75rem;
	}

	@media print {
		.print-controls {
			display: none;
		}
	}
</style>
