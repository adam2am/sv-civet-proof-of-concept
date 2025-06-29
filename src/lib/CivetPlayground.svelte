<script lang="civet">
	// Interactive Civet to TypeScript playground
	import { onMount } from 'svelte'
	import { compile } from '@danielx/civet'
	import Prism from 'prismjs'
	import 'prismjs/components/prism-typescript'
	import 'prismjs/components/prism-coffeescript'
	import 'prismjs/themes/prism-tomorrow.css'

	glb := globalThis as any
	if glb.process == undefined
		// Minimal stub so libraries expecting `process.env` don't crash in the browser
		glb.process = { env: {} }

	// Reactive local state
	civetCode .= $state<string>('''
		name := "World"
		console.log "Hello #{name}!"

		if abc isnt 1
	''')
	tsCode   .= $state<string>('')
	errorInfo .= $state<{ message: string, line: number, column: number } | null>(null)
	highlightedCivet .= $state<string>('')
	highlightedTs .= $state<string>('')
	civetTextarea .= $state<HTMLTextAreaElement | null>(null)
	civetHighlightPre .= $state<HTMLPreElement | null>(null)

	// Initial compile and highlight on mount
	onMount async =>
		await compileNow()
		updateHighlighting()

	// Compile helper
	compileNow := async =>
		try
			// Use CoffeeScript-like syntax options for the browser playground
			compileOpts := { 
				js: false, 
				parseOptions: {
					coffeeIsnt: true,
					coffeeEq: true,
					coffeeBooleans: true,
					coffeeInterpolation: true
				}
			}
			code := await compile(civetCode, compileOpts) as string
			tsCode = code
			errorInfo = null
		catch err
			e := err as any
			if e.message and e.line and e.column
				// Strip the redundant location from the compiler's message string
				cleanedMessage := e.message.replace(/^.+?:\d+:\d+\s*/, '')
				errorInfo = { message: cleanedMessage, line: e.line, column: e.column }
			else
				errorInfo = { message: (err as Error).message, line: 0, column: 0 }
			updateHighlighting()

	// Update syntax highlighting for both editors
	updateHighlighting := ->
		// Use CoffeeScript highlighting for Civet (closest match)
		highlightedCivet = Prism.highlight(civetCode, Prism.languages.coffeescript, 'coffeescript')
		highlightedTs = Prism.highlight(displayCode, Prism.languages.typescript, 'typescript')

	// A derived value that injects the error message into the code output
	displayCode := $derived do
		// If there's no error or the code is empty, show the TS code as is
		if not errorInfo? or not tsCode
			tsCode
		else
			lines := tsCode.split('\n') 			// Error line from Civet compiler (1-based)
			errLine := errorInfo.line
			// Column (1-based)
			errCol := errorInfo.column

			// Clamp line number to be inside the bounds of the (potentially stale) TS code
			lineIndex := Math.max(0, Math.min(errLine - 1, lines.length))
			
			// Prepare the visual indicator
			indicator := `// ${' '.repeat(Math.max(0, errCol - 1))}^-- [L${errLine}:${errCol}] ${errorInfo.message}`
			
			// Insert the indicator *after* the line where the error likely is
			lines.splice(lineIndex + 1, 0, indicator)
			lines.join('\n')

	// Debounced reactive compile (re-run when civetCode changes)
	$effect ->
		// Reading `civetCode` makes it a dependency. The effect re-runs when it changes.
		civetCode
		// Update highlighting immediately for a snappy typing feel
		updateHighlighting()
		timerId := setTimeout (-> compileNow()), 150

		// The returned function is a cleanup function. Svelte runs it before
		// re-running the effect, which is how we achieve the debounce.
		-> clearTimeout timerId

	// Sync editor scroll positions
	$effect ->
		ta := civetTextarea
		pre := civetHighlightPre
		if not ta or not pre then return

		syncScroll := ->
			pre.scrollTop = ta.scrollTop
			pre.scrollLeft = ta.scrollLeft
		
		ta.addEventListener('scroll', syncScroll)
		// Initial sync in case there's already scrollable content
		syncScroll()

		-> ta.removeEventListener('scroll', syncScroll)

	// Handle Tab and Shift+Tab for indentation
	handleKeydown := (e: KeyboardEvent) ->
		if e.key is 'Tab'
			e.preventDefault()
			
			ta := e.currentTarget as HTMLTextAreaElement
			start := ta.selectionStart
			end := ta.selectionEnd
			value := ta.value
			tab := '  ' // 2 spaces for indentation

			if e.shiftKey
				// Outdent: find the start of the line and remove a tab if present
				lineStart := value.lastIndexOf('\n', start - 1) + 1
				if value.substring(lineStart, lineStart + tab.length) === tab
					ta.value = value.substring(0, lineStart) + value.substring(lineStart + tab.length)
					newPos := Math.max(lineStart, start - tab.length)
					ta.selectionStart = ta.selectionEnd = newPos
				
			else
				// Indent: insert a tab at the cursor position
				ta.value = value.substring(0, start) + tab + value.substring(end)
				ta.selectionStart = ta.selectionEnd = start + tab.length

			// Manually trigger the input event to update Svelte's state
			ta.dispatchEvent(new Event('input', { bubbles: true }))
</script>

<div class="playground">
	<div class="editor">
		<label for="civet-input">Civet <span class="edit-indicator">✏️ editable</span></label>
		<div class="editor-container">
			<textarea id="civet-input" 
			bind:this={civetTextarea}
			bind:value={civetCode} 
			onkeydown={handleKeydown}
			placeholder="Start typing Civet code here... (example: name := 'World')" 
			autocomplete="off" 
			spellcheck="false"></textarea>
			<pre class="editor-highlight" bind:this={civetHighlightPre}><code>{@html highlightedCivet}</code></pre>
		</div>
	</div>

	<div class="output">
		<label for="ts-output">TypeScript <span class="readonly-indicator">🔒 output</span></label>
		<pre class:error={errorInfo}><code>{@html highlightedTs}</code></pre>
	</div>
</div>

<style>
	.playground {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 2rem;
	}

	.editor, .output {
		display: flex;
		flex-direction: column;
	}

	label {
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: #4f46e5;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.edit-indicator {
		font-size: 0.8rem;
		font-weight: normal;
		color: #6366f1;
		opacity: 0.8;
	}

	.readonly-indicator {
		font-size: 0.8rem;
		font-weight: normal;
		color: #6b7280;
		opacity: 0.8;
	}

	.editor-container {
		position: relative;
		flex: 1;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.15s ease;
		min-height: 200px;
	}

	.editor-container:focus-within {
		box-shadow: 0 0 0 2px #4f46e5;
	}

	textarea, .editor-highlight, .editor-highlight code {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 1rem;
		font-family: "Fira Code", monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		box-sizing: border-box;
		border: none;
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow: auto;
	}

	textarea {
		resize: none;
		color: transparent;
		background: transparent;
		caret-color: #e2e8f0;
		z-index: 1;
		/* Hide scrollbar but keep it functional */
		scrollbar-width: none; /* Firefox */
	}
	
	textarea::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
	}

	textarea::placeholder {
		color: transparent;
	}

	.editor-highlight {
		pointer-events: none;
		background: #0f172a;
		color: #e2e8f0;
	}

	.editor-highlight::before {
		content: attr(data-placeholder);
		position: absolute;
		opacity: 0;
		pointer-events: none;
		user-select: none;
	}

	.editor-highlight:empty::before {
		opacity: 0.4;
	}

	pre {
		flex: 1;
		margin: 0;
		padding: 1rem;
		background: #0f172a;
		color: #e2e8f0;
		font-family: "Fira Code", monospace;
		font-size: 0.9rem;
		border-radius: 8px;
		overflow: auto;
		white-space: pre-wrap;
		word-wrap: break-word;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		min-height: 200px;
	}

	pre.error {
		box-shadow: 0 0 0 1px #ef4444;
		background: #7f1d1d;
		color: #fecaca;
	}

	:global(.token.comment) {
		color: #94a3b8;
	}

	:global(.token.string),
	:global(.token.string-interpolation) {
		color: #86efac;
	}

	:global(.token.operator),
	:global(.token.punctuation) {
		color: #94a3b8;
	}

	:global(.token.keyword) {
		color: #c084fc;
	}

	:global(.token.function) {
		color: #93c5fd;
	}

	:global(.token.number) {
		color: #fdba74;
	}

	/* Custom Scrollbar Styling */
	:global(pre::-webkit-scrollbar), 
	:global(.editor-highlight::-webkit-scrollbar) {
  	width: 12px;
	}

	:global(pre::-webkit-scrollbar-track),
	:global(.editor-highlight::-webkit-scrollbar-track) {
  	background: #1e293b;
	}

	:global(pre::-webkit-scrollbar-thumb),
	:global(.editor-highlight::-webkit-scrollbar-thumb) {
  	background-color: #334155;
  	border-radius: 20px;
  	border: 3px solid #1e293b;
	}

	@media (max-width: 900px) {
		.playground {
			grid-template-columns: 1fr;
		}
	}
</style> 