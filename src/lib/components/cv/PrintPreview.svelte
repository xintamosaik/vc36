<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="print-controls mb-4 flex items-center justify-between gap-4">
	<a class="underline underline-offset-4" href={resolve('/')}>Back to editor</a>
	<button
		class="cursor-pointer rounded border border-[#aaa] px-3 py-2"
		type="button"
		onclick={() => window.print()}>Print / Save as PDF</button
	>
</div>
