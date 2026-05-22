import type { ApexOptions } from 'apexcharts';

/** ApexCharts colors that respect light/dark UI. */
export function applyChartTheme(options: ApexOptions, isDark: boolean): ApexOptions {
	const foreColor = isDark ? '#cbd5e1' : '#64748b';
	const gridBorder = isDark ? 'rgba(51,65,85,0.8)' : 'rgba(148,163,184,0.25)';

	return {
		...options,
		theme: { mode: isDark ? 'dark' : 'light' },
		chart: {
			...options.chart,
			foreColor,
			background: 'transparent'
		},
		grid: {
			...options.grid,
			borderColor: gridBorder
		},
		xaxis: {
			...options.xaxis,
			labels: {
				...(typeof options.xaxis === 'object' ? options.xaxis?.labels : {}),
				style: { colors: foreColor }
			}
		},
		yaxis: Array.isArray(options.yaxis)
			? options.yaxis.map((axis) => ({
					...axis,
					labels: { ...axis.labels, style: { colors: foreColor } }
				}))
			: {
					...options.yaxis,
					labels: {
						...(typeof options.yaxis === 'object' ? options.yaxis?.labels : {}),
						style: { colors: foreColor }
					}
				},
		legend: {
			...options.legend,
			labels: { colors: foreColor }
		}
	};
}
