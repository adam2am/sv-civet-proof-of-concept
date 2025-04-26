<script lang="ts">
	// with global.d.ts = modules are not dynamicly detected, without it = import error
	import { ImportedClass } from './class.svelte.civet';
	const importedClass = new ImportedClass(0);
</script>


<div class="container">
	<h1 class="title">Welcome to Svelte + SvelteKit</h1>
	<p class="description">
		The button tracking logic + $states are imported from <code>./class.svelte.CIVET</code>
	</p>
	<p class="description">which provides the functionality for the button below</p>

	
	<div class="status-box">
		<h2>Button Tracker Status</h2>
		<p>Count: {importedClass.count}</p>
		<p>Last Pressed: {importedClass.getLastTimePressedTime()}</p>
		<button 
			class="tracker-button" 
			on:click={() => importedClass.press()}>
			Press Me
		</button>
		{importedClass.hello}
	</div>
</div>


<style>
	.tracker-button {
		background-color: #4c75af;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.tracker-button:active {
		transform: translateY(1px);
	}
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		text-align: center;
		margin: 0 auto;
		width: 100%;
		max-width: 1200px;
	}

	.title {
		font-size: 3rem;
		margin-bottom: 1rem;
		text-align: center;
	}

	.description {
		font-size: 1.5rem;
		text-align: center;
		width: 100%;
		padding: 0;
		margin-left: 0;
		margin-right: 0;
	}

	.status-box {
		border: 1px solid #ccc;
		padding: 1rem;
		margin-top: 2rem;
		border-radius: 8px;
		transition: border-color 0.3s ease;
		min-width: 300px;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
	}

	.status-box p {
		text-align: center;
		padding: 0;
		margin-left: 0;
		margin-right: 0;
	}

	button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
</style>
