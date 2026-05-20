import { getTransactionsForPeriod } from '$lib/services/transactions';
import { monthlyTrends } from '$lib/utils/analytics';
import type { PageServerLoad } from './$types';

/** Load last 6 months of transactions for analytics charts. */
export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const now = new Date();
	const loads = [];

	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		loads.push(getTransactionsForPeriod(supabase, d.getFullYear(), d.getMonth() + 1));
	}

	const months = await Promise.all(loads);
	const all = months.flat();
	const trends = monthlyTrends(all, 6);

	return { trends, transactions: all };
};
