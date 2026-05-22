<script lang="ts">
	import type { Transaction } from '$lib/types/database';
	import { formatCurrency } from '$lib/utils/currency';
	import { formatDisplayDate } from '$lib/utils/date';

	interface Props {
		transaction: Transaction;
	}

	let { transaction }: Props = $props();
	const isIncome = $derived(transaction.type === 'income');
</script>

<div
	class="flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 transition hover:bg-white/80 dark:border-slate-700/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
>
	<div class="min-w-0 flex-1">
		<p class="truncate font-medium text-slate-900 dark:text-white">{transaction.category}</p>
		<p class="truncate text-xs text-slate-500 dark:text-slate-400">
			{formatDisplayDate(transaction.created_at)}
			{#if transaction.note}
				· {transaction.note}
			{/if}
		</p>
	</div>
	<span
		class="shrink-0 text-sm font-semibold {isIncome
			? 'text-emerald-600 dark:text-emerald-400'
			: 'text-rose-600 dark:text-rose-400'}"
	>
		{isIncome ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
	</span>
</div>
