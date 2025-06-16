<script lang="civet">
	CivetPlayground from "$lib/CivetPlayground.svelte"
	
	updateExample := (code: string) => ->
		textarea := document.querySelector('#civet-input') as HTMLTextAreaElement
		if textarea
			textarea.value = code
			textarea.dispatchEvent(new Event('input'))

	patternMatchingExample := '''
# Function with type annotations
greet := (name: string): string ->
  "Hello #{name}!"

# Pattern matching
match status
  | "success" => console.log "All good!"
  | "error" => console.error "Oops!"
  | _ => console.log "Unknown status"
'''

	classExample := '''
# Class with private fields
class Counter
  #count := 0
  
  increment(): void ->
    @#count++
    
  getValue(): number ->
    @#count
'''
</script>

<div class="container">
	<h1>Civet Playground</h1>
	
	<p class="intro">
		Try out Civet syntax and see the compiled TypeScript output in real-time. 
		Write your Civet code in the left editor and watch it transform into TypeScript on the right.
		The compiler updates automatically as you type.
	</p>

	<CivetPlayground />

	<div class="examples">
		<h2>Example Snippets</h2>
		<button on:click={() => updateExample(patternMatchingExample)}>Pattern Matching</button>
		<button on:click={() => updateExample(classExample)}>Class Example</button>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #1e293b;
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.intro {
		color: #475569;
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.examples {
		margin-top: 3rem;
	}

	h2 {
		color: #334155;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	button {
		background: #4f46e5;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		margin-right: 1rem;
		margin-bottom: 1rem;
		transition: background-color 0.2s;
	}

	button:hover {
		background: #4338ca;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>

