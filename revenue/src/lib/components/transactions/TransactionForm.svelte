<script lang="ts">
	import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '$lib/constants';
	import type { Transaction, TransactionType } from '$lib/types/database';
	import { toISODateTimeLocal } from '$lib/utils/date';
	import { validateTransactionForm, type TransactionFormData } from '$lib/utils/validation';

	interface Props {
		transaction?: Transaction | null;
		loading?: boolean;
		onsubmit: (data: {
			type: TransactionType;
			amount: number;
			category: string;
			note: string | null;
			created_at: string;
		}) => void | Promise<void>;
	}

	let { transaction = null, loading = false, onsubmit }: Props = $props();

	let type = $state<TransactionType>(transaction?.type ?? 'expense');
	let amount = $state(transaction ? String(transaction.amount) : '');
	let category = $state(transaction?.category ?? 'Food');
	let note = $state(transaction?.note ?? '');
	let created_at = $state(
		transaction
			? toISODateTimeLocal(new Date(transaction.created_at))
			: toISODateTimeLocal(new Date())
	);
	let errors = $state<Record<string, string>>({});

	const categoryList = $derived(type === 'income' ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES]);

	$effect(() => {
		const list = categoryList as readonly string[];
		if (!list.includes(category)) {
			category = list[0];
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		const form: TransactionFormData = { type, amount, category, note, created_at };
		errors = validateTransactionForm(form);
		if (Object.keys(errors).length) return;

		onsubmit({
			type,
			amount: Number(amount),
			category,
			note: note.trim() || null,
			created_at: new Date(created_at).toISOString()
		});
	}
</script>

<form class="space-y-4" onsubmit={handleSubmit}>
	<div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
		<button
			type="button"
			class="rounded-lg py-2 text-sm font-semibold transition {type === 'expense'
				? 'toggle-active'
				: 'toggle-inactive'}"
			onclick={() => (type = 'expense')}
		>
			Expense
		</button>
		<button
			type="button"
			class="rounded-lg py-2 text-sm font-semibold transition {type === 'income'
				? 'toggle-active'
				: 'toggle-inactive'}"
			onclick={() => (type = 'income')}
		>
			Income
		</button>
	</div>

	<div>
		<label class="text-label mb-1 block" for="amount">Amount</label>
		<input id="amount" class="input-field" type="number" step="0.01" min="0" bind:value={amount} />
		{#if errors.amount}<p class="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.amount}</p>{/if}
	</div>

	<div>
		<label class="text-label mb-1 block" for="category">Category</label>
		<select id="category" class="input-field" bind:value={category}>
			{#each categoryList as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</div>

	<div>
		<label class="text-label mb-1 block" for="note">Note</label>
		<textarea
			id="note"
			class="input-field min-h-[80px]"
			bind:value={note}
			placeholder="Optional details"
		></textarea>
	</div>

	<div>
		<label class="text-label mb-1 block" for="created_at">Date & time</label>
		<input id="created_at" class="input-field" type="datetime-local" bind:value={created_at} />
		{#if errors.created_at}<p class="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.created_at}</p>{/if}
	</div>

	<button class="btn-primary w-full" type="submit" disabled={loading}>
		{loading ? 'Saving…' : transaction ? 'Update transaction' : 'Add transaction'}
	</button>
</form>
