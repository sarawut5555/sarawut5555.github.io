/** First day of month (UTC date parts from local selection). */
export function startOfMonth(year: number, month: number): Date {
	return new Date(year, month - 1, 1, 0, 0, 0, 0);
}

/** Last moment of month. */
export function endOfMonth(year: number, month: number): Date {
	return new Date(year, month, 0, 23, 59, 59, 999);
}

export function toISODateTimeLocal(date: Date): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDateTime(value: string): Date {
	return new Date(value);
}

export function formatDisplayDate(iso: string): string {
	return new Intl.DateTimeFormat('th-TH', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(iso));
}

/** Human-readable date for CSV exports (Excel-friendly, Thai locale). */
export function formatCsvDate(iso: string): string {
	return new Intl.DateTimeFormat('th-TH', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(new Date(iso));
}

export function formatMonthYear(year: number, month: number): string {
	return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
		new Date(year, month - 1, 1)
	);
}

export function currentMonthYear(): { year: number; month: number } {
	const now = new Date();
	return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
