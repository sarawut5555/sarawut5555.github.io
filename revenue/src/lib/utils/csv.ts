import type { Transaction } from '$lib/types/database';
import { formatCsvDate } from '$lib/utils/date';

/** Escape a cell for RFC 4180 CSV. */
function escapeCell(value: string): string {
	return `"${value.replace(/"/g, '""')}"`;
}

/** Build CSV string and trigger browser download (UTF-8 BOM for Excel + Thai). */
export function exportTransactionsCsv(transactions: Transaction[], filename = 'transactions.csv') {
	const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
	const rows = transactions.map((t) => [
		formatCsvDate(t.created_at),
		t.type,
		t.category,
		Number(t.amount).toFixed(2),
		t.note ?? ''
	]);

	const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');

	// UTF-8 BOM so Excel on Windows reads Thai characters correctly
	const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
