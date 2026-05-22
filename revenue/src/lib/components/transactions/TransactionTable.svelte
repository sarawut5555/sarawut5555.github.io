<script lang="ts">
	import type { Transaction } from '$lib/types/database';
	import { formatCurrency } from '$lib/utils/currency';
	import { formatDisplayDate } from '$lib/utils/date';

	interface Props {
		transactions: Transaction[];
		onedit: (t: Transaction) => void;
		ondelete: (t: Transaction) => void;
	}

	let { transactions, onedit, ondelete }: Props = $props();
</script>

<div class="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700">
	<table class="w-full min-w-[640px] text-left text-sm text-slate-900 dark:text-slate-100">
		<thead
			class="border-b border-slate-200/80 bg-slate-50/90 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400"
		>
			<tr>
				<th class="px-4 py-3">Date</th>
				<th class="px-4 py-3">Type</th>
				<th class="px-4 py-3">Category</th>
				<th class="px-4 py-3">Note</th>
				<th class="px-4 py-3 text-right">Amount</th>
				<th class="px-4 py-3 text-right">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each transactions as t (t.id)}
				<tr
					class="border-b border-slate-100/80 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/50"
				>
					<td class="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-200">
						{formatDisplayDate(t.created_at)}
					</td>
					<td class="px-4 py-3 capitalize">
						<span
							class="rounded-full px-2 py-0.5 text-xs font-medium {t.type === 'income'
								? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
								: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'}"
						>
							{t.type}
						</span>
					</td>
					<td class="px-4 py-3">{t.category}</td>
					<td class="max-w-[200px] truncate px-4 py-3 text-slate-500 dark:text-slate-400">
						{t.note ?? '—'}
					</td>
					<td class="px-4 py-3 text-right font-semibold">
						{t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
					</td>
					<td class="px-4 py-3 text-right">
						<button
							class="mr-2 text-indigo-600 hover:underline dark:text-indigo-400"
							onclick={() => onedit(t)}>Edit</button
						>
						<button
							class="text-rose-600 hover:underline dark:text-rose-400"
							onclick={() => ondelete(t)}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
