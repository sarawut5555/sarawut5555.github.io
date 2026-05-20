import type { Transaction } from '$lib/types/database';

/** Last N months income vs expense totals for trend chart. */
export function monthlyTrends(transactions: Transaction[], months = 6) {
	const now = new Date();
	const results: { label: string; income: number; expense: number }[] = [];

	for (let i = months - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const year = d.getFullYear();
		const month = d.getMonth();
		const label = d.toLocaleString(undefined, { month: 'short', year: '2-digit' });

		let income = 0;
		let expense = 0;
		for (const t of transactions) {
			const td = new Date(t.created_at);
			if (td.getFullYear() !== year || td.getMonth() !== month) continue;
			const amt = Number(t.amount);
			if (t.type === 'income') income += amt;
			else expense += amt;
		}
		results.push({ label, income, expense });
	}

	return results;
}
