<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Modal from '$lib/components/ui/Modal.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import TransactionForm from '$lib/components/transactions/TransactionForm.svelte';
	import TransactionTable from '$lib/components/transactions/TransactionTable.svelte';
	import { PAGE_SIZE } from '$lib/constants';
	import {
		createTransaction,
		deleteTransaction,
		updateTransaction
	} from '$lib/services/transactions';
	import { createSupabaseBrowserClient } from '$lib/supabase';
	import { toasts } from '$lib/stores/toast';
	import { exportTransactionsCsv } from '$lib/utils/csv';
	import { getAllTransactions } from '$lib/services/transactions';
	import type { Transaction } from '$lib/types/database';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let modalOpen = $state(false);
	let editing = $state<Transaction | null>(null);
	let saving = $state(false);
	let exporting = $state(false);

	// Filter bindings synced to URL
	let search = $state(data.filters.search);
	let category = $state(data.filters.category);
	let type = $state(data.filters.type);
	let year = $state(data.filters.year);
	let month = $state(data.filters.month);
	let sort = $state(data.filters.sort);

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / PAGE_SIZE)));

	function buildUrl(overrides: Record<string, string | number> = {}) {
		const params = new URLSearchParams();
		const f = { ...data.filters, search, category, type, year, month, sort, ...overrides };
		if (f.search) params.set('search', f.search);
		if (f.category) params.set('category', f.category);
		if (f.type) params.set('type', f.type);
		params.set('year', String(f.year));
		params.set('month', String(f.month));
		params.set('sort', f.sort);
		if (f.page && f.page > 1) params.set('page', String(f.page));
		return `/transactions?${params}`;
	}

	function applyFilters(pageNum = 1) {
		goto(buildUrl({ page: pageNum }));
	}

	function openCreate() {
		editing = null;
		modalOpen = true;
	}

	function openEdit(t: Transaction) {
		editing = t;
		modalOpen = true;
	}

	async function handleSubmit(payload: {
		type: 'income' | 'expense';
		amount: number;
		category: string;
		note: string | null;
		created_at: string;
	}) {
		saving = true;
		const supabase = createSupabaseBrowserClient();
		try {
			if (editing) {
				await updateTransaction(supabase, editing.id, payload);
				toasts.show('Transaction updated', 'success');
			} else {
				const {
					data: { user }
				} = await supabase.auth.getUser();
				if (!user) throw new Error('Not authenticated');
				await createTransaction(supabase, user.id, payload);
				toasts.show('Transaction added', 'success');
			}
			modalOpen = false;
			await invalidateAll();
		} catch (e) {
			toasts.show(e instanceof Error ? e.message : 'Something went wrong', 'error');
		} finally {
			saving = false;
		}
	}

	async function handleDelete(t: Transaction) {
		if (!confirm('Delete this transaction?')) return;
		const supabase = createSupabaseBrowserClient();
		try {
			await deleteTransaction(supabase, t.id);
			toasts.show('Transaction deleted', 'success');
			await invalidateAll();
		} catch (e) {
			toasts.show(e instanceof Error ? e.message : 'Delete failed', 'error');
		}
	}

	async function exportCsv() {
		exporting = true;
		const supabase = createSupabaseBrowserClient();
		try {
			const all = await getAllTransactions(supabase, {
				search: data.filters.search,
				category: data.filters.category,
				type: data.filters.type,
				year: data.filters.year,
				month: data.filters.month
			});
			exportTransactionsCsv(all, `transactions-${data.filters.year}-${data.filters.month}.csv`);
			toasts.show('CSV exported', 'success');
		} catch (e) {
			toasts.show(e instanceof Error ? e.message : 'Export failed', 'error');
		} finally {
			exporting = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold">Transactions</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">Manage income and expenses</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<button class="btn-secondary" onclick={exportCsv} disabled={exporting}>
				{exporting ? 'Exporting…' : 'Export CSV'}
			</button>
			<button class="btn-primary" onclick={openCreate}>+ Add transaction</button>
		</div>
	</div>

	<div class="glass-card">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
			<div class="flex flex-col gap-2 lg:col-span-2">
				<label class="text-label" for="search">Search</label>
				<input
					id="search"
					class="input-field"
					placeholder="Search notes or categories…"
					bind:value={search}
					onkeydown={(e) => e.key === 'Enter' && applyFilters()}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-label" for="category">Category</label>
				<select id="category" class="input-field" bind:value={category}>
					<option value="">All categories</option>
					{#each data.categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-label" for="type">Type</label>
				<select id="type" class="input-field" bind:value={type}>
					<option value="">All types</option>
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-label" for="year">Year</label>
				<input id="year" class="input-field" type="number" bind:value={year} min="2020" max="2100" />
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-label" for="month">Month</label>
				<input id="month" class="input-field" type="number" bind:value={month} min="1" max="12" />
			</div>
			<div class="flex items-end">
				<button class="btn-primary w-full" onclick={() => applyFilters()}>Apply</button>
			</div>
		</div>
	</div>

	<div class="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
		<label class="flex items-center gap-2">
			<span class="text-slate-500 dark:text-slate-400">Sort</span>
			<select
				class="input-field !w-auto py-1"
				bind:value={sort}
				onchange={() => applyFilters(data.filters.page)}
			>
				<option value="desc">Newest first</option>
				<option value="asc">Oldest first</option>
			</select>
		</label>
		<p class="text-slate-500 dark:text-slate-400">{data.total} total</p>
	</div>

	{#if data.transactions.length}
		<TransactionTable transactions={data.transactions} onedit={openEdit} ondelete={handleDelete} />
		<div class="flex justify-center gap-2">
			{#if data.filters.page > 1}
				<a class="btn-secondary" href={buildUrl({ page: data.filters.page - 1 })}>Previous</a>
			{/if}
			<span class="flex items-center px-3 text-sm text-slate-500 dark:text-slate-400">
				Page {data.filters.page} of {totalPages}
			</span>
			{#if data.filters.page < totalPages}
				<a class="btn-secondary" href={buildUrl({ page: data.filters.page + 1 })}>Next</a>
			{/if}
		</div>
	{:else}
		<EmptyState
			title="No transactions found"
			description="Try adjusting filters or add your first transaction."
			actionLabel="Add transaction"
			onaction={openCreate}
		/>
	{/if}
</div>

<Modal
	open={modalOpen}
	title={editing ? 'Edit transaction' : 'Add transaction'}
	onclose={() => (modalOpen = false)}
>
	<TransactionForm transaction={editing} loading={saving} onsubmit={handleSubmit} />
</Modal>
