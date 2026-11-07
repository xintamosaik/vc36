<script lang="ts">
	import type { TextSegment } from '#lib/types/cv.js';

	let { segments }: { segments: TextSegment[] } = $props();
</script>

{#each segments as segment, index (index)}
	{#if typeof segment === 'string'}
		{segment}
	{:else if segment.strong}
		<strong>{segment.text}</strong>
	{:else}
		{segment.text}
	{/if}
{/each}
