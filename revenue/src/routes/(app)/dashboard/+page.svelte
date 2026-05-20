<script lang="ts">
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import TransactionRow from '$lib/components/dashboard/TransactionRow.svelte';
	import ApexChart from '$lib/components/charts/ApexChart.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import { categoryBreakdown, dailyExpenseSeries } from '$lib/services/transactions';
	import { formatCurrency } from '$lib/utils/currency';
	import type { ApexOptions } from 'apexcharts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const breakdown = $derived(categoryBreakdown(data.monthly));
	const daily = $derived(dailyExpenseSeries(data.monthly, data.year, data.month));

	const expenseChartOptions = $derived<ApexOptions>({
		chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
		stroke: { curve: 'smooth', width: 2 },
		fill: {
			type: 'gradient',
			gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 }
		},
		colors: ['#f43f5e'],
		dataLabels: { enabled: false },
		xaxis: { categories: daily.map((d) => String(d.day)) },
		yaxis: { labels: { formatter: (v) => formatCurrency(Number(v)) } },
		grid: { borderColor: 'rgba(148,163,184,0.2)' },
		series: [{ name: 'Expenses', data: daily.map((d) => d.amount) }]
	});

	const categoryChartOptions = $derived<ApexOptions>({
		chart: { type: 'donut', fontFamily: 'inherit' },
		labels: breakdown.map((b) => b.category),
		series: breakdown.map((b) => b.total),
		legend: { position: 'bottom' },
		colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#94a3b8']
	});
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
		<p class="text-sm text-slate-500">{data.periodLabel} overview</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		<StatCard label="Total income" value={data.summary.income} variant="income" />
		<StatCard label="Total expenses" value={data.summary.expenses} variant="expense" />
		<StatCard
			label="Remaining balance"
			value={data.summary.balance}
			variant="balance"
			trend={data.summary.balance >= 0 ? 'On track this month' : 'Spending exceeds income'}
		/>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<div class="glass-card">
			<h2 class="mb-4 font-semibold">Daily expenses</h2>
			{#if data.summary.expenses > 0}
				<ApexChart options={expenseChartOptions} />
			{:else}
				<EmptyState title="No expenses yet" description="Add an expense to see your daily chart." />
			{/if}
		</div>
		<div class="glass-card">
			<h2 class="mb-4 font-semibold">Spending by category</h2>
			{#if breakdown.length}
				<ApexChart options={categoryChartOptions} height={300} />
			{:else}
				<EmptyState title="No category data" description="Expenses will appear grouped by category." />
			{/if}
		</div>
	</div>

	<div class="glass-card">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold">Recent transactions</h2>
			<a href="/transactions" class="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
				>View all</a
			>
		</div>
		{#if data.recent.length}
			<div class="space-y-2">
				{#each data.recent as t (t.id)}
					<TransactionRow transaction={t} />
				{/each}
			</div>
		{:else}
			<EmptyState
				title="No transactions"
				description="Your latest income and expenses will show up here."
				actionLabel="Add transaction"
				onaction={() => (window.location.href = '/transactions')}
			/>
		{/if}
	</div>

	<div class="glass-card">
		<h2 class="mb-2 font-semibold">Monthly summary</h2>
		<p class="text-sm text-slate-500">
			Net flow: <span class="font-semibold text-slate-800 dark:text-slate-200"
				>{formatCurrency(data.summary.balance)}</span
			>
			({formatCurrency(data.summary.income)} in · {formatCurrency(data.summary.expenses)} out)
		</p>
	</div>
</div>
