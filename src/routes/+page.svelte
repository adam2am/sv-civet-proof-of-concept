<script lang="civet">
	import '../app.css'
	import ShowcaseCard from '$lib/ShowcaseCard.svelte'
	import LiveDemo from '$lib/LiveDemo.svelte'
	import type { User } from '$lib/types'
	import { showcaseData } from '$lib/showcase-data'

	{ data }: { data?: { users: User[] } } .= $props()
</script>


<div class="container">
	<header class="showcase-header">
		<h1>✨ Civet vs. TypeScript</h1>
		<p class="subtitle">A Developer Experience Showcase</p>
		<div class="tech-badges">
			<span class="badge">🐱 Civet</span>
			<span class="badge">🔥 Svelte 5</span>
			<span class="badge">🔷 TypeScript</span>
		</div>
	</header>

	<div class="showcase-grid">
		{#each showcaseData as data}
			<ShowcaseCard {...data} />
		{/each}
	</div>

	{#if data?.users}
		<h2 class="live-demo-heading">👀 Live Demo</h2>
		<LiveDemo users={data.users} />
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		font-family: 'Inter', system-ui, sans-serif;
	}

	.showcase-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.showcase-header h1 {
		font-size: 3rem;
		font-weight: 800;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}

	.subtitle {
		color: #475569;
		font-size: 1.25rem;
		margin: 0.5rem 0;
	}

	.tech-badges {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.badge {
		background: #f1f5f9;
		color: #475569;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid #e2e8f0;
	}
	
	.showcase-grid {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.live-demo-heading {
 		margin-top: 4rem;
 		text-align: center;
 		font-size: 1.75rem;
 		font-weight: 700;
 		color: #1e293b;
 	}

</style>