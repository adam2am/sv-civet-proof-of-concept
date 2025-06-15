<script lang="civet">
	import '../app.css'
	import UserCard from '$lib/UserCard.svelte'
	import { UserManager } from './class.svelte'
	import type { User } from '$lib/types'

	// destructuring props with type annotation
	{ data }: { data: {users: User[] } } .= $props()

	// Local state for users
	users .= $state<User[]>(data.users)
	
	// Initialize class-based state management
	userManager := new UserManager(users)

	// states with .= and := operators
	countdown .= $state 3
	isCountdownActive .= $state false
	filterQuery .= $state<string | null> null
	sortBy .= $state<'name' | 'title'>('name')
	isLoading .= $state false

	// Derived state with pattern matching and advanced logic
	filteredUsers := $derived do
		if not filterQuery then users
		else
			query := filterQuery.toLowerCase()
			users.filter (user) =>
				user.name.toLowerCase().includes(query) or
				user.title.toLowerCase().includes(query)

	// Sorting with functional approach
	sortedUsers := $derived
		[...filteredUsers].sort switch sortBy
			when 'name' then (a, b) => a.name.localeCompare(b.name)
			when 'title' then (a, b) => a.title.localeCompare(b.title)
			else (a, b) => a.id - b.id

	activeUsers := $derived sortedUsers.filter &.isActive
	inactiveUsers := $derived sortedUsers.filter (user) => not user.isActive

	// Advanced derived computations
	userStats := $derived do
		total := sortedUsers.length
		active := activeUsers.length
		percentage := if total > 0 then Math.round(active / total * 100) else 0
		{
			total,
			active,
			inactive: total - active,
			percentage,
			summary: "#{active}/#{total} users active (#{percentage}%)"
		}

	// Utility functions with implicit returns and concise syntax
	isManager := (user: User) -> user.title.includes('Manager')
	getInitials := (user: {name: string}) -> user.name.split(' ').map(.charAt(0)).join('')
	getUserDisplayName := (user: {name: string}) -> "#{user.name} (#{getInitials(user)})"

	// Pattern matching in conditional rendering
	statusMessage := $derived
		if not userManager.selectedUser then switch userManager.status
			'loading' 
				'⏳ Loading user data...'
			'error' 
				'❌ Error loading users'
			else 
				'👆 Click a user card to see details'
		else switch userManager.selectedUser
			{name, title, isActive: true} 
				"🎉 #{name} (#{title}) is actively working!"
			{name, title, isActive: false}
				"😴 #{name} (#{title}) is currently away"
			else '👆 Click a user card to see details'

	// Math-style conditions and ranges
	countdownDisplay := $derived
		switch
			when 0 < countdown < 2 then "#{countdown} 🔥"
			when countdown is 0 then "🚀 LAUNCH!"
			else countdown.toString()

	// Range literals and array operations
	positions := $derived [1..activeUsers.length]

	// Event handlers with postfix conditions
	selectUser := (id: number) => 
		userManager.selectUser(id)
		startCountdown() if not isCountdownActive

	clearSelection := => 
		userManager.clearSelection() if userManager.selectedUserID isnt null

	// Async operations with error handling
	refreshUsers := =>
		return if isLoading
		isLoading = true
		userManager.status = 'loading'
		try
			// Simulate API call with pipe operators
			newUsers := await new Promise<User[]> (resolve) =>
				setTimeout =>
					resolve users.map (user) => ({
						...user,
						isActive: Math.random() > 0.3
					})
				, 1500

			// Update local state instead of readonly data
			users = newUsers
			userManager.users = newUsers
			console.log "Refreshed #{newUsers.length} users"
		catch error
			console.error "Failed to refresh users: #{(error as Error).message}"
			userManager.status = 'error'
		finally
			isLoading = false

	startCountdown := =>
		return if isCountdownActive
		isCountdownActive = true
		countdown = 3

		interval := setInterval =>
			countdown--
			if countdown <= 0
				clearInterval interval
				isCountdownActive = false
				alert "🚀 User #{userManager.selectedUser?.name or 'Unknown'} launched!"
		, 1000

	// Effect for logging active users
	$effect ->
		console.log "Active users loaded: #{activeUsers.length}" if activeUsers.length > 0

</script>


<div class="container">
	<header class="showcase-header">
		<h1>✨ Civet + Svelte 5 Showcase</h1>
		<p class="subtitle">Beautiful syntax, powerful features</p>
		<div class="tech-badges">
			<span class="badge">🐱 Civet</span>
			<span class="badge">🔥 Svelte 5</span>
			<span class="badge">⚡ Reactive</span>
		</div>
	</header>

	<div class="status-card">
		<p class="status-message">{statusMessage}</p>
		<div class="stats">
			<span>📊 {userStats.summary}</span>
			<span>🎯 Showing: {sortedUsers.length}</span>
			{#if userManager.selectedUser}
				<span>👤 Selected: {getUserDisplayName(userManager.selectedUser)}</span>
			{/if}
		</div>
		
		{#if userManager.selectedUser && !isCountdownActive}
			<div class="countdown-section">
				<button class="btn-launch" onclick={startCountdown}>
					🚀 Launch {userManager.selectedUser.name}
				</button>
			</div>
		{/if}
		
		{#if isCountdownActive}
			<div class="countdown-display">
				<span class="countdown-text">{countdownDisplay}</span>
			</div>
		{/if}
	</div>

	<div class="controls">
		<div class="search-section">
			<input 
				type="text" 
				placeholder="🔍 Search users..." 
				bind:value={filterQuery}
				class="search-input"
			/>
		</div>
		
		<div class="filter-buttons">
			<button 
				class="btn-filter" 
				class:active={sortBy === 'name'}
				onclick={() => sortBy = 'name'}
			>
				Sort by Name
			</button>
			<button 
				class="btn-filter" 
				class:active={sortBy === 'title'}
				onclick={() => sortBy = 'title'}
			>
				Sort by Title
			</button>
		</div>

		<div class="action-buttons">
			<button 
				class="btn-secondary"
				onclick={() => clearSelection()}
				disabled={!userManager.selectedUser}
			>
				Clear Selection
			</button>
			<button 
				class="btn-primary"
				onclick={() => refreshUsers()}
				disabled={isLoading}
			>
				{isLoading ? '⏳ Refreshing...' : '🔄 Refresh Users'}
			</button>
		</div>
	</div>

	<div class="user-sections">
		{#if activeUsers.length > 0}
			<section class="user-section">
				<h2>🟢 Active Users ({activeUsers.length})</h2>
				<div class="user-grid">
					{#each activeUsers as user, i (user.id)}
						<UserCard
							{user}
							position={positions[i]}
							onSelect={selectUser}
							isSelected={userManager.selectedUserID === user.id}
							badge={isManager(user) ? '👑' : '👤'}
						/>
					{/each}
				</div>
			</section>
		{/if}

		{#if inactiveUsers.length > 0}
			<section class="user-section">
				<h2>⚪ Away Users ({inactiveUsers.length})</h2>
				<div class="user-grid inactive">
					{#each inactiveUsers as user (user.id)}
						<UserCard
							{user}
							onSelect={selectUser}
							isSelected={userManager.selectedUserID === user.id}
							badge="😴"
						/>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: 'Inter', system-ui, sans-serif;
	}

	.showcase-header {
		text-align: center;
		margin-bottom: 1rem;
	}

	.showcase-header h1 {
		font-size: 2.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
		margin: 0.5rem 0;
	}

	.tech-badges {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.badge {
		background: #f0f9ff;
		color: #0369a1;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid #bae6fd;
	}

	.status-card {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
	}

	.status-message {
		font-size: 1.3rem;
		margin: 0 0 1rem 0;
		font-weight: 500;
		color: #2d3748;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 2rem;
		font-size: 0.9rem;
		color: #4a5568;
		flex-wrap: wrap;
	}

	.countdown-section {
		margin-top: 1rem;
	}

	.countdown-display {
		margin-top: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 8px;
	}

	.countdown-text {
		font-size: 2rem;
		font-weight: bold;
		color: #2d3748;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.search-section {
		display: flex;
		justify-content: center;
	}

	.search-input {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 2px solid #e2e8f0;
		font-size: 1rem;
		width: 300px;
		max-width: 100%;
	}

	.search-input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.filter-buttons, .action-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		border: none;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn-secondary {
		background: #f7fafc;
		color: #4a5568;
		border: 2px solid #e2e8f0;
	}

	.btn-filter {
		background: #f0fff4;
		color: #22543d;
		border: 2px solid #9ae6b4;
	}

	.btn-filter.active {
		background: #22543d;
		color: white;
	}

	.btn-launch {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
		font-size: 1.1rem;
		padding: 1rem 2rem;
	}

	button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.user-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.user-section h2 {
		color: #2d3748;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.user-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.user-grid.inactive {
		opacity: 0.7;
	}
</style>