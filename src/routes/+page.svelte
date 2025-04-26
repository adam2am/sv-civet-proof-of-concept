<script lang="civet">
	message := "!"
</script>

<div class="container">
	<h1 class="title">Welcome to SvelteKit</h1>
	<p class="description">
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>
	<p class="description">
		{message}
	</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		text-align: center;
	}

	.title {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.description {
		font-size: 1.5rem;
	}
</style>
