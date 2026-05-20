import type { TransactionType } from '$lib/types/database';

export interface TransactionFormData {
	type: TransactionType;
	amount: string;
	category: string;
	note: string;
	created_at: string;
}

export function validateTransactionForm(data: TransactionFormData): Record<string, string> {
	const errors: Record<string, string> = {};
	const amount = Number(data.amount);

	if (!data.type) errors.type = 'Type is required';
	if (!data.amount || Number.isNaN(amount) || amount <= 0) {
		errors.amount = 'Enter a valid amount greater than 0';
	}
	if (!data.category?.trim()) errors.category = 'Category is required';
	if (!data.created_at) errors.created_at = 'Date and time are required';

	return errors;
}
