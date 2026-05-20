import type { SupabaseClient } from '@supabase/supabase-js';
import { PAGE_SIZE } from '$lib/constants';
import type {
	FinancialSummary,
	Transaction,
	TransactionInsert,
	TransactionUpdate
} from '$lib/types/database';
import { endOfMonth, startOfMonth } from '$lib/utils/date';

export interface TransactionFilters {
	search?: string;
	category?: string;
	type?: 'income' | 'expense' | '';
	year?: number;
	month?: number;
}

export interface TransactionListResult {
	transactions: Transaction[];
	total: number;
}

function applyFilters<T extends { eq: Function; gte: Function; lte: Function; ilike: Function; or: Function }>(
	query: T,
	filters: TransactionFilters
) {
	let q = query;
	if (filters.type) q = q.eq('type', filters.type);
	if (filters.category) q = q.eq('category', filters.category);
	if (filters.year && filters.month) {
		const start = startOfMonth(filters.year, filters.month).toISOString();
		const end = endOfMonth(filters.year, filters.month).toISOString();
		q = q.gte('created_at', start).lte('created_at', end);
	}
	if (filters.search?.trim()) {
		const term = filters.search.trim().replace(/[%_,]/g, '');
		if (term) {
			q = q.or(`note.ilike.%${term}%,category.ilike.%${term}%`);
		}
	}
	return q;
}

export async function listTransactions(
	supabase: SupabaseClient,
	filters: TransactionFilters = {},
	page = 1,
	sort: 'asc' | 'desc' = 'desc'
): Promise<TransactionListResult> {
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	let query = supabase
		.from('transactions')
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: sort === 'asc' })
		.range(from, to);

	query = applyFilters(query, filters);

	const { data, error, count } = await query;
	if (error) throw error;

	return {
		transactions: (data ?? []) as Transaction[],
		total: count ?? 0
	};
}

export async function getRecentTransactions(
	supabase: SupabaseClient,
	limit = 5
): Promise<Transaction[]> {
	const { data, error } = await supabase
		.from('transactions')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) throw error;
	return (data ?? []) as Transaction[];
}

export async function getTransactionsForPeriod(
	supabase: SupabaseClient,
	year: number,
	month: number
): Promise<Transaction[]> {
	const start = startOfMonth(year, month).toISOString();
	const end = endOfMonth(year, month).toISOString();

	const { data, error } = await supabase
		.from('transactions')
		.select('*')
		.gte('created_at', start)
		.lte('created_at', end)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return (data ?? []) as Transaction[];
}

export async function getAllTransactions(
	supabase: SupabaseClient,
	filters: TransactionFilters = {}
): Promise<Transaction[]> {
	let query = supabase.from('transactions').select('*').order('created_at', { ascending: false });
	query = applyFilters(query, filters);
	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []) as Transaction[];
}

export function summarize(transactions: Transaction[]): FinancialSummary {
	const income = transactions
		.filter((t) => t.type === 'income')
		.reduce((sum, t) => sum + Number(t.amount), 0);
	const expenses = transactions
		.filter((t) => t.type === 'expense')
		.reduce((sum, t) => sum + Number(t.amount), 0);

	return { income, expenses, balance: income - expenses };
}

export async function createTransaction(
	supabase: SupabaseClient,
	userId: string,
	payload: TransactionInsert
): Promise<Transaction> {
	const { data, error } = await supabase
		.from('transactions')
		.insert({ ...payload, user_id: userId })
		.select()
		.single();

	if (error) throw error;
	return data as Transaction;
}

export async function updateTransaction(
	supabase: SupabaseClient,
	id: string,
	payload: TransactionUpdate
): Promise<Transaction> {
	const { data, error } = await supabase
		.from('transactions')
		.update(payload)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data as Transaction;
}

export async function deleteTransaction(
	supabase: SupabaseClient,
	id: string
): Promise<void> {
	const { error } = await supabase.from('transactions').delete().eq('id', id);
	if (error) throw error;
}

/** Group expenses by category for charts. */
export function categoryBreakdown(transactions: Transaction[]) {
	const map = new Map<string, number>();
	for (const t of transactions) {
		if (t.type !== 'expense') continue;
		map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount));
	}
	return [...map.entries()].map(([category, total]) => ({ category, total }));
}

/** Daily totals for a month (expenses). */
export function dailyExpenseSeries(transactions: Transaction[], year: number, month: number) {
	const daysInMonth = new Date(year, month, 0).getDate();
	const totals = Array.from({ length: daysInMonth }, (_, i) => ({
		day: i + 1,
		amount: 0
	}));

	for (const t of transactions) {
		if (t.type !== 'expense') continue;
		const d = new Date(t.created_at);
		if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue;
		totals[d.getDate() - 1].amount += Number(t.amount);
	}

	return totals;
}
