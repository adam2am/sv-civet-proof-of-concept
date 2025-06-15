<script lang="civet">
	import type { User } from './types'

	// 🌟 TYPE SHORTHAND: Inline object type
	{ user, position, onSelect, isSelected, badge }: {
		user: User
		position?: number
		onSelect: (id: number) => void
		isSelected: boolean
		badge: string
	} .= $props()

	// 🌟 IMPLICIT APPLICATION: Clean function calls
	handleClick := => onSelect user.id

	// 🌟 CHAINED COMPARISONS & RANGES: Mathematical expressions
	positionStyle := $derived
		if not position then ''
		else switch true
			when position <= 3 then '🥇'
			when position <= 6 then '🥈' 
			else '🥉'

	// 🌟 PROPERTY ACCESS SHORTHAND: Multiple ways to access
	initials := $derived user.name.split(' ').map(.charAt(0)).join('')

	// 🌟 OBJECT GLOB: Extract multiple properties
	{ name, title, isActive } := user
</script>

<div 
	class="user-card" 
	class:selected={isSelected}
	onclick={() => onSelect(user.id)}
>
	<div class="badge-container">
		{#if position}
			<span class="position">#{position}</span>
		{/if}
		<span class="badge">{badge}</span>
	</div>
	<h3>{user.name}</h3>
	<p class="title">{user.title}</p>
	<p class="email">{user.email}</p>
	<p class="location">{user.location}</p>
</div>

<style>
	.user-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.user-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.user-card.selected {
		border: 2px solid #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
	}

	.badge-container {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.position {
		background: #f0f9ff;
		color: #0369a1;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.badge {
		font-size: 1.25rem;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		color: #1a202c;
		font-size: 1.25rem;
	}

	p {
		margin: 0.25rem 0;
		color: #4a5568;
		font-size: 0.875rem;
	}

	.title {
		color: #2d3748;
		font-weight: 500;
	}

	.email {
		color: #4299e1;
	}

	.location {
		color: #718096;
		font-style: italic;
	}
</style>