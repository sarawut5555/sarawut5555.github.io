<script lang="ts">
	import ApexChart from '$lib/components/charts/ApexChart.svelte';
	import { categoryBreakdown } from '$lib/services/transactions';
	import { darkMode } from '$lib/stores/theme';
	import { formatCurrency } from '$lib/utils/currency';
	import { applyChartTheme } from '$lib/utils/chart-theme';
	import type { ApexOptions } from 'apexcharts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const breakdown = $derived(categoryBreakdown(data.transactions));

	const trendOptions = $derived(
		applyChartTheme(
			{
				chart: { type: 'bar', stacked: false, toolbar: { show: false }, fontFamily: 'inherit' },
				plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
				colors: ['#10b981', '#f43f5e'],
				xaxis: { categories: data.trends.map((t) => t.label) },
				yaxis: { labels: { formatter: (v) => formatCurrency(Number(v)) } },
				legend: { position: 'top' },
				series: [
					{ name: 'Income', data: data.trends.map((t) => t.income) },
					{ name: 'Expenses', data: data.trends.map((t) => t.expense) }
				]
			} satisfies ApexOptions,
			$darkMode
		)
	);

	const compareOptions = $derived(
		applyChartTheme(
			{
				chart: { type: 'line', toolbar: { show: false }, fontFamily: 'inherit' },
				stroke: { curve: 'smooth', width: 3 },
				colors: ['#10b981', '#f43f5e'],
				xaxis: { categories: data.trends.map((t) => t.label) },
				yaxis: { labels: { formatter: (v) => formatCurrency(Number(v)) } },
				legend: { position: 'top' },
				series: [
					{ name: 'Income', data: data.trends.map((t) => t.income) },
					{ name: 'Expenses', data: data.trends.map((t) => t.expense) }
				]
			} satisfies ApexOptions,
			$darkMode
		)
	);

	const categoryOptions = $derived(
		applyChartTheme(
			{
				chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
				plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
				colors: ['#6366f1'],
				xaxis: { categories: breakdown.map((b) => b.category) },
				series: [{ name: 'Spent', data: breakdown.map((b) => b.total) }]
			} satisfies ApexOptions,
			$darkMode
		)
	);
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-2xl font-bold">Analytics</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400">Income, expenses, and trends over the last 6 months</p>
	</div>

	<div class="glass-card">
		<h2 class="mb-4 font-semibold text-slate-900 dark:text-white">Income vs expenses</h2>
		<ApexChart options={compareOptions} height={320} />
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<div class="glass-card">
			<h2 class="mb-4 font-semibold text-slate-900 dark:text-white">Monthly comparison</h2>
			<ApexChart options={trendOptions} />
		</div>
		<div class="glass-card">
			<h2 class="mb-4 font-semibold text-slate-900 dark:text-white">Category breakdown (all loaded data)</h2>
			{#if breakdown.length}
				<ApexChart options={categoryOptions} />
			{:else}
				<p class="text-sm text-slate-500 dark:text-slate-400">No expense data to display.</p>
			{/if}
		</div>
	</div>
</div>
