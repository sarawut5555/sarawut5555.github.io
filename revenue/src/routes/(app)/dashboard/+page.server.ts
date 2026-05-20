import {
	getRecentTransactions,
	getTransactionsForPeriod,
	summarize
} from '$lib/services/transactions';
import { currentMonthYear, formatMonthYear } from '$lib/utils/date';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { year, month } = currentMonthYear();
	const [monthly, recent] = await Promise.all([
		getTransactionsForPeriod(supabase, year, month),
		getRecentTransactions(supabase, 6)
	]);

	const summary = summarize(monthly);

	return {
		summary,
		recent,
		monthly,
		periodLabel: formatMonthYear(year, month),
		year,
		month
	};
};
