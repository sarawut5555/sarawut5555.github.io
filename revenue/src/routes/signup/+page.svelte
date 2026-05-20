<script lang="ts">
	import { goto } from '$app/navigation';
	import { createSupabaseBrowserClient } from '$lib/supabase';
	import { toasts } from '$lib/stores/toast';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	async function signup(e: Event) {
		e.preventDefault();
		loading = true;
		const supabase = createSupabaseBrowserClient();
		const { error } = await supabase.auth.signUp({ email, password });
		loading = false;

		if (error) {
			toasts.show(error.message, 'error');
			return;
		}
		toasts.show('Account created! You can sign in now.', 'success');
		goto('/login');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
	<div class="glass w-full max-w-md p-8">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold">Create account</h1>
			<p class="mt-2 text-sm text-slate-500">Start tracking your personal finances</p>
		</div>

		<form class="space-y-4" onsubmit={signup}>
			<div>
				<label class="mb-1 block text-xs font-medium text-slate-500" for="email">Email</label>
				<input id="email" class="input-field" type="email" required bind:value={email} />
			</div>
			<div>
				<label class="mb-1 block text-xs font-medium text-slate-500" for="password">Password</label>
				<input
					id="password"
					class="input-field"
					type="password"
					required
					minlength="6"
					bind:value={password}
				/>
			</div>
			<button class="btn-primary w-full" type="submit" disabled={loading}>
				{loading ? 'Creating…' : 'Sign up'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-500">
			Already have an account?
			<a href="/login" class="font-semibold text-indigo-600 hover:underline">Sign in</a>
		</p>
	</div>
</div>
