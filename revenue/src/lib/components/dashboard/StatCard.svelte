<script lang="ts">
	import { formatCurrency } from '$lib/utils/currency';

	interface Props {
		label: string;
		value: number;
		trend?: string;
		variant?: 'default' | 'income' | 'expense' | 'balance';
	}

	let { label, value, trend, variant = 'default' }: Props = $props();

	const accents: Record<string, string> = {
		default: 'from-indigo-500/20 to-transparent text-indigo-600 dark:text-indigo-400',
		income: 'from-emerald-500/20 to-transparent text-emerald-600 dark:text-emerald-400',
		expense: 'from-rose-500/20 to-transparent text-rose-600 dark:text-rose-400',
		balance: 'from-violet-500/20 to-transparent text-violet-600 dark:text-violet-400'
	};
</script>

<div class="glass-card group">
	<div class="mb-3 h-1 w-12 rounded-full bg-gradient-to-r {accents[variant]}"></div>
	<p class="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
	<p class="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
		{formatCurrency(value)}
	</p>
	{#if trend}
		<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">{trend}</p>
	{/if}
</div>
