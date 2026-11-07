<script lang="ts">
	import data from '#lib/data/cv/skills.json';
</script>

<section>
	<h2>{data.title}</h2>
	<ul>
		{#each data.skills as skill}
			<li><strong>{skill.label}:</strong> {skill.value}</li>
		{/each}
	</ul>
</section>
