<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';

	const typeStyles: Record<string, string> = {
		success:
			'border-emerald-400/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300',
		error:
			'border-rose-400/40 bg-rose-500/10 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300',
		info: 'border-indigo-400/40 bg-indigo-500/10 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300'
	};
</script>

<div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
	{#each $toasts as toast (toast.id)}
		<div
			class="pointer-events-auto glass flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium {typeStyles[toast.type]}"
			transition:fly={{ x: 40, duration: 250 }}
			role="status"
		>
			<span>{toast.message}</span>
			<button
				class="text-slate-600 opacity-70 hover:opacity-100 dark:text-slate-300"
				onclick={() => toasts.dismiss(toast.id)}
				aria-label="Dismiss"
			>
				×
			</button>
		</div>
	{/each}
</div>
