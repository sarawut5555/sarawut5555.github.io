<script lang="ts">
	import { goto } from '$app/navigation';
	import { createSupabaseBrowserClient } from '$lib/supabase';
	import { toasts } from '$lib/stores/toast';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	async function login(e: Event) {
		e.preventDefault();
		loading = true;
		const supabase = createSupabaseBrowserClient();
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		loading = false;

		if (error) {
			toasts.show(error.message, 'error');
			return;
		}
		toasts.show('Welcome back!', 'success');
		goto('/dashboard');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
	<div class="glass w-full max-w-md p-8">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold">
				<span class="text-indigo-600 dark:text-indigo-400">Flow</span>Finance
			</h1>
			<p class="mt-2 text-sm text-slate-500">Sign in to manage your finances</p>
		</div>

		<form class="space-y-4" onsubmit={login}>
			<div>
				<label class="mb-1 block text-xs font-medium text-slate-500" for="email">Email</label>
				<input id="email" class="input-field" type="email" required bind:value={email} autocomplete="email" />
			</div>
			<div>
				<label class="mb-1 block text-xs font-medium text-slate-500" for="password">Password</label>
				<input
					id="password"
					class="input-field"
					type="password"
					required
					bind:value={password}
					autocomplete="current-password"
					minlength="6"
				/>
			</div>
			<button class="btn-primary w-full" type="submit" disabled={loading}>
				{loading ? 'Signing in…' : 'Sign in'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-500">
			No account?
			<a href="/signup" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Create one</a>
		</p>
	</div>
</div>
