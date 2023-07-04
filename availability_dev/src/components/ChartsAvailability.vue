<template>
	<section id="charts-availability">
		<Charts
			:type="type"
			:height="height"
			:width="width"
			:options="{ ...options_default, ...options }"
			:series="series"
		/>
	</section>
</template>

<script>
export default {
	name: "ChartsAvailability",
	props: {
		series: {
			type: Array,
			default: () => []
		},
		options: {
			type: Object,
			default: () => ({})
		},
		tooltips: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		const [height, width] = ["95%", "100%"]
		const type = "bar"
		const options_default = {
			chart: {
				height,
				width,
				type,
				parentHeightOffset: -25,
				toolbar: { show: false },
				offsetX: 0
			},
			plotOptions: {
				bar: {
					barHeight: "50%",
					horizontal: true,
					dataLabels: {
						position: "bottom"
					}
				}
			},
			dataLabels: {
				enabled: true,
				textAnchor: "start",
				style: { colors: ["#fff"] },
				dropShadow: {
					enabled: true
				},
				formatter: (
					value,
					{
						w: {
							globals: { labels }
						},
						dataPointIndex
					}
				) => {
					const label = labels[dataPointIndex]
					return `${label} ~ ${value} %`
				}
			},
			colors: [
				({ value }) => {
					if (value < 96) return "rgb(220, 20, 60)"
					return "rgb(20, 219, 179)"
				}
			],
			yaxis: {
				labels: { show: false }
			},
			tooltip: {
				fixed: {
					enabled: true,
					position: "topCenter",
					offsetX: 0,
					offsetY: 0
				},
				custom: ({ dataPointIndex, w, seriesIndex }) => {
					const name = w.globals.seriesNames[seriesIndex]
					const label = w.globals.labels[dataPointIndex]

					return this.tooltips[name][label]
				}
			}
		}

		return { type, height, width, options_default }
	}
}
</script>

<style>
.tooltip {
	--color-accent-base: 0, 0%, 50%;
	--color-accent: hsl(var(--color-accent-base));
	--bg-color: hsla(var(--color-accent-base), 0.1);
	display: grid;
	grid-template-rows: auto 1fr;
	font-size: 0.95em;
	color: var(--color-accent);
	background-color: var(--bg-color);
}
.tooltip.alert {
	--color-accent-base: 348, 83%, 47%;
}

.tooltip header {
	padding: 0.5em;
	font-size: 1.25em;
	background-color: var(--color-accent);
	color: #fff;
}

.tooltip main {
	padding: 0.5em;
	display: flex;
	flex-direction: column;
	gap: 1em;
}

.tooltip ul {
	list-style: none;
	margin: 0;
	padding: 0;

	display: flex;
	flex-direction: column;
	gap: 0.5em;
}

.tooltip li {
	padding: 0.5em 0;
}

.tooltip li + li {
	border-top: solid 1px currentColor;
}
</style>

<style scoped>
#charts-availability {
	justify-self: start;
}
</style>
