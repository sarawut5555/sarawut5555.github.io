<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface Props {
		open: boolean;
		title: string;
		onclose: () => void;
		children?: import('svelte').Snippet;
	}

	let { open, title, onclose, children }: Props = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-black/60"
		transition:fade={{ duration: 150 }}
		onclick={(e) => e.target === e.currentTarget && onclose()}
		role="presentation"
	>
		<div
			class="glass w-full max-w-lg p-6 shadow-2xl"
			transition:fly={{ y: 16, duration: 200 }}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="mb-5 flex items-center justify-between">
				<h2 id="modal-title" class="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
				<button
					class="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
					onclick={onclose}
					aria-label="Close"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			{@render children?.()}
		</div>
	</div>
{/if}
