export type TransactionType = 'income' | 'expense';

export interface Transaction {
	id: string;
	user_id: string;
	type: TransactionType;
	amount: number;
	category: string;
	note: string | null;
	created_at: string;
}

export interface TransactionInsert {
	type: TransactionType;
	amount: number;
	category: string;
	note?: string | null;
	created_at?: string;
}

export interface TransactionUpdate {
	type?: TransactionType;
	amount?: number;
	category?: string;
	note?: string | null;
	created_at?: string;
}

export interface FinancialSummary {
	income: number;
	expenses: number;
	balance: number;
}

/** Minimal Supabase schema typing for the transactions table. */
export interface Database {
	public: {
		Tables: {
			transactions: {
				Row: Transaction;
				Insert: TransactionInsert & { user_id: string };
				Update: TransactionUpdate;
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}
