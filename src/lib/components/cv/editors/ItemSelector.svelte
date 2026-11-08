<script lang="ts">
	let {
		items,
		selectedIndex = $bindable(),
		itemLabel,
		ariaLabel,
		onAdd,
		disabled = false
	}: {
		items: string[];
		selectedIndex: number;
		itemLabel: string;
		ariaLabel: string;
		onAdd: () => void;
		disabled?: boolean;
	} = $props();

	function itemNumber(index: number) {
		return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][index] ?? `${index + 1}`;
	}
</script>

<div class="cv-editor-item-nav" role="group" aria-label={ariaLabel}>
	<div class="cv-editor-item-nav-items">
		{#each items as item, index (index)}
			<button
				class="cv-editor-item-button"
				class:active={selectedIndex === index}
				type="button"
				{disabled}
				aria-label={`Edit ${itemLabel} ${index + 1}`}
				aria-pressed={selectedIndex === index}
				title={`${itemLabel} ${index + 1}${item ? `: ${item.replaceAll('##', '')}` : ''}`}
				onclick={() => (selectedIndex = index)}
			>
				<span aria-hidden="true">{itemNumber(index)}</span>
			</button>
		{/each}
		<button
			class="cv-editor-item-button"
			type="button"
			{disabled}
			aria-label={`Add ${itemLabel}`}
			title={`Add ${itemLabel}`}
			onclick={onAdd}
		>
			<span aria-hidden="true">➕</span>
		</button>
	</div>
</div>
