<script lang="ts">
	import type { Transaction } from '$lib/types/database';
	import { formatCurrency } from '$lib/utils/currency';
	import { formatDisplayDate } from '$lib/utils/date';

	interface Props {
		transaction: Transaction;
	}

	let { transaction }: Props = $props();
	const isIncome = transaction.type === 'income';
</script>

<div
	class="flex items-center justify-between gap-4 rounded-xl border border-slate-100/80 bg-white/40 px-4 py-3 transition hover:bg-white/70 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-800/50"
>
	<div class="min-w-0 flex-1">
		<p class="truncate font-medium">{transaction.category}</p>
		<p class="truncate text-xs text-slate-500">
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
