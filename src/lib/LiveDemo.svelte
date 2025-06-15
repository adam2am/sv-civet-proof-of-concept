<script lang="civet">
	import UserCard from '$lib/UserCard.svelte'
	import { UserManager } from '../routes/class.svelte'
	import type { User } from '$lib/types'

	{ users }: { users: User[] } .= $props()

	// Local state for users
	usersState .= $state<User[]>(users)
	
	// Initialize class-based state management
	userManager := new UserManager(users)

	// States
	countdown .= $state 3
	isCountdownActive .= $state false
	filterQuery .= $state<string | null> null
	sortBy .= $state<'name' | 'title'>('name')
	isLoading .= $state false

	// Derived state with pattern matching and advanced logic
	filteredUsers := $derived do
		if not filterQuery then usersState
		else
			query := filterQuery.toLowerCase()
			usersState.filter (user) =>
				user.name.toLowerCase().includes(query) or
				user.title.toLowerCase().includes(query)

	// Sorting
	sortedUsers := $derived 
		[...filteredUsers].sort switch sortBy
			when 'name' then (a, b) => a.name.localeCompare(b.name)
			when 'title' then (a, b) => a.title.localeCompare(b.title)
			else (a, b) => a.id - b.id

	activeUsers := $derived sortedUsers.filter &.isActive
	inactiveUsers := $derived sortedUsers.filter (user) => not user.isActive

	// Derived computations
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

	// Utility functions
	isManager := (user: User) -> user.title.includes('Manager')
	getInitials := (user: {name: string}) -> user.name.split(' ').map(.charAt(0)).join('')
	getUserDisplayName := (user: {name: string}) -> "#{user.name} (#{getInitials(user)})"

	// Pattern matching in conditional rendering
	statusMessage := $derived 
		if not userManager.selectedUser then switch userManager.status
			'loading' then '⏳ Loading user data...'
			'error' then '❌ Error loading users'
			else '👆 Click a user card to see details'
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

	positions := $derived [1..activeUsers.length]
	
	// Event handlers
	selectUser := (id: number) => 
		userManager.selectUser(id)
		startCountdown() if not isCountdownActive

	clearSelection := => 
		userManager.clearSelection() if userManager.selectedUserID isnt null

	refreshUsers := =>
		return if isLoading
		isLoading = true
		userManager.status = 'loading'
		try
			newUsers := await new Promise<User[]> (resolve) =>
				setTimeout =>
					resolve usersState.map (user) => ({
						...user,
						isActive: Math.random() > 0.3
					})
				, 1500

			usersState = newUsers
			userManager.users = newUsers
			userManager.status = 'idle'
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

	$effect ->
		console.log "Active users loaded: #{activeUsers.length}" if activeUsers.length > 0
</script>

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
				{#each inactiveUsers as user}
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

<style>
	/* Reuse existing styles from original page, trimmed for brevity */
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
	
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin: 1.5rem 0;
		align-items: center;
		justify-content: space-between;
	}
	.search-input {
		padding: 0.5rem 1rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font-size: 0.95rem;
		flex: 1 1 260px;
	}
	.search-input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
	}
	.btn-filter,
	.btn-secondary,
	.btn-primary {
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		transition: background 0.2s ease, color 0.2s ease;
		cursor: pointer;
	}
	.btn-filter {
		background: #f1f5f9;
		border: 1px solid #cbd5e1;
		color: #1a202c;
	}
	.btn-filter.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}
	.btn-primary {
		background: #667eea;
		color: white;
		border: none;
	}
	.btn-primary:disabled {
		background: #a0aec0;
		cursor: not-allowed;
	}
	.btn-secondary {
		background: white;
		color: #1a202c;
		border: 1px solid #cbd5e1;
	}
	.btn-secondary:hover:not(:disabled) {
		background: #f8fafc;
	}
	.btn-secondary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.user-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1.25rem;
	}
	.countdown-display {
		font-size: 2rem;
		font-weight: 700;
		color: #4f46e5;
		margin-top: 1rem;
	}
</style> 