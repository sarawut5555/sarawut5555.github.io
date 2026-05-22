<script lang="ts">
	import { page } from '$app/stores';
	import { NAV_ITEMS } from '$lib/constants';

	interface Props {
		onnavigate?: () => void;
	}

	let { onnavigate }: Props = $props();

	const icons: Record<string, string> = {
		layout: 'M3 12h7V3H3v9zm11 9h7v-9h-7v9zM3 21h7v-7H3v7zm11-9h7V3h-7v9z',
		list: 'M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z',
		chart: 'M4 19h4v-8H4v8zm6 0h4V5h-4v14zm6 0h4v-5h-4v5z'
	};
</script>

<nav class="flex flex-col gap-1 p-4">
	<p class="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
		Menu
	</p>
	{#each NAV_ITEMS as item}
		<a
			href={item.href}
			class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
        {$page.url.pathname.startsWith(item.href)
				? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
				: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'}"
			onclick={onnavigate}
		>
			<svg class="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
				<path d={icons[item.icon]} />
			</svg>
			{item.label}
		</a>
	{/each}
</nav>
