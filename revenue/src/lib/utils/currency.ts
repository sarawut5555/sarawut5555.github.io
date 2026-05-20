import { env } from '$env/dynamic/public';

const currency = env.PUBLIC_CURRENCY ?? 'THB';

const localeByCurrency: Record<string, string> = {
	THB: 'th-TH',
	USD: 'en-US'
};

/** Format numbers as localized currency strings. */
export function formatCurrency(amount: number): string {
	const locale = localeByCurrency[currency] ?? undefined;
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
