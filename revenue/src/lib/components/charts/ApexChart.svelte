<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { ApexOptions } from 'apexcharts';

	interface Props {
		options: ApexOptions;
		height?: number | string;
	}

	let { options, height = 280 }: Props = $props();
	let el: HTMLDivElement;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let chart: any = null;

	onMount(async () => {
		const { default: ApexCharts } = await import('apexcharts');
		chart = new ApexCharts(el, { ...options, chart: { ...options.chart, height } });
		await chart.render();
	});

	$effect(() => {
		if (chart && options) {
			chart.updateOptions(options, true, true);
		}
	});

	onDestroy(() => chart?.destroy());
</script>

<div bind:this={el} class="w-full"></div>
