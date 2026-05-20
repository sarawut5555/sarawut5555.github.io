<script lang="ts">
	interface Props {
		title: string;
		description: string;
		actionLabel?: string;
		onaction?: () => void;
	}

	let { title, description, actionLabel, onaction }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 px-6 py-16 text-center dark:border-slate-700">
	<div
		class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
	>
		<svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M9 14l6-6m-5.5 8.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	</div>
	<h3 class="text-lg font-semibold">{title}</h3>
	<p class="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
	{#if actionLabel && onaction}
		<button class="btn-primary mt-6" onclick={onaction}>{actionLabel}</button>
	{/if}
</div>
