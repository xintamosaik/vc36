<script lang="ts">
	type TextSegment = string | { text: string; strong?: boolean };

	let { segments }: { segments: TextSegment[] } = $props();
</script>

{#each segments as segment}
	{#if typeof segment === 'string'}
		{segment}
	{:else if segment.strong}
		<strong>{segment.text}</strong>
	{:else}
		{segment.text}
	{/if}
{/each}
