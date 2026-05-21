<script lang="ts">
	import { goto } from '$app/navigation';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { createSupabaseBrowserClient } from '$lib/supabase';
	import { darkMode, toggleTheme } from '$lib/stores/theme';
	import { toasts } from '$lib/stores/toast';

	interface Props {
		userEmail?: string | null;
		children?: import('svelte').Snippet;
	}

	let { userEmail, children }: Props = $props();
	let mobileOpen = $state(false);

	async function logout() {
		const supabase = createSupabaseBrowserClient();
		await supabase.auth.signOut();
		toasts.show('Signed out successfully', 'info');
		goto('/login');
	}
</script>

<div class="flex min-h-screen">
	<!-- Desktop sidebar -->
	<aside class="glass hidden w-64 shrink-0 border-r lg:flex lg:flex-col">
		<div class="border-b border-white/10 p-6">
			<h1 class="text-xl font-bold tracking-tight">
				<span class="text-indigo-600 dark:text-indigo-400">Flow</span>Finance
			</h1>
			<p class="mt-1 text-xs text-slate-500">Personal expense tracker</p>
		</div>
		<Sidebar />
		<div class="mt-auto border-t border-white/10 p-4">
			<p class="truncate px-3 text-xs text-slate-500">{userEmail}</p>
		</div>
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<header class="glass sticky top-0 z-40 flex items-center justify-between gap-4 border-b px-4 py-3 lg:px-8">
			<button
				class="rounded-lg p-2 lg:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Toggle menu"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<div class="flex flex-1 items-center justify-end gap-2">
				<button
					class="btn-secondary !px-3"
					onclick={toggleTheme}
					aria-label="Toggle dark mode"
				>
					{#if $darkMode}☀️{:else}🌙{/if}
				</button>
				<button class="btn-secondary cursor-pointer" onclick={logout}>Logout</button>
			</div>
		</header>

		{#if mobileOpen}
			<div class="glass border-b lg:hidden">
				<Sidebar onnavigate={() => (mobileOpen = false)} />
			</div>
		{/if}

		<main class="flex-1 p-4 lg:p-8">
			{@render children?.()}
		</main>
	</div>
</div>
