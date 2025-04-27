<script lang="civet">
	// with global.d.ts = modules are not dynamicly detected, without it = import error
	import { ImportedClass } from './class.civet';
	importedClass := new ImportedClass(0);

	// Civet-style constant declaration with :=
	line1 := "Hello from Civet! This message is a proof of a working civet preprocessor."
	line2 := "Code written within script lang ='civet' (:= instead of const)"
	countCivet .= $state(0)

	increment1 := () => {
		countCivet++
		console.log "Count increased to #{countCivet}";
	}
</script>

<div class="civet-container">
	<main>
		<h1>{line1}</h1>
		<h1>{line2}</h1>
		<div class="counter">
			<p>Current count: {countCivet}</p>
			<button onclick={increment1}>Increment</button>
		</div>
	</main>
</div>

<div class="container">
	<h1 class="title">Svelte + imported Civet module</h1>
	<p class="description">
		In this section the button tracking logic + $states are imported from <code>./class.CIVET</code>
	</p>
	<p class="description">which provides the functionality for the button below</p>

	<div class="status-box">
		<h2>Button Tracker Status</h2>
		<p>Count: {importedClass.count}</p>
		<p>Last Pressed: {importedClass.getLastTimePressedTime()}</p>
		<button 
			class="tracker-button" 
			onclick={() => importedClass.press()}>
			Press Me
		</button>
		{importedClass.hello()}
		<p>{importedClass.getMessage()}</p>
	</div>
</div>

<style>
	main {
		padding: 1rem;
		text-align: center;
	}
	
	.civet-container {
		margin-top: 1rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	
	button {
		background: #4c75af;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

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
