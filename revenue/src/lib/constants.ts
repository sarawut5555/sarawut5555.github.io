export const DEFAULT_CATEGORIES = [
	'Food',
	'Transport',
	'Shopping',
	'Bills',
	'Salary',
	'Investment',
	'Entertainment',
	'Other'
] as const;

export type Category = (typeof DEFAULT_CATEGORIES)[number];

export const EXPENSE_CATEGORIES = [
	'Food',
	'Transport',
	'Shopping',
	'Bills',
	'Entertainment',
	'Other'
] as const;

export const INCOME_CATEGORIES = ['Salary', 'Investment', 'Other'] as const;

export const PAGE_SIZE = 10;

export const NAV_ITEMS = [
	{ href: '/dashboard', label: 'Dashboard', icon: 'layout' },
	{ href: '/transactions', label: 'Transactions', icon: 'list' },
	{ href: '/analytics', label: 'Analytics', icon: 'chart' }
] as const;
