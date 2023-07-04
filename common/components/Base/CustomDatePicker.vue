<template>
	<div class="custom-date-picker">
		<CustomInput :name="name" :label="label" v-model="date" />
		<div class="custom-date-picker__calendar" tabindex="0">
			<div class="custom-date-picker__calendar__nav">
				<button @click="() => previousMonth()">&#10094;</button>
				<span>{{ current.format("MMMM YYYY").toLocaleUpperCase() }}</span>
				<button @click="() => nextMonth()">&#10095;</button>
			</div>
			<div class="custom-date-picker__calendar__days">
				<span
					v-for="(day, i) in week_days"
					:key="`weekday-${i}`"
					class="custom-date-picker__calendar__week-day"
				>
					{{ day.format("dd") }}
				</span>
				<span
					v-for="(day, i) in days"
					:key="`day-${i}`"
					class="custom-date-picker__calendar__day"
					:data-no-day="day === null"
					:data-selected="day !== null && day.isSame(value, 'day')"
					@click="() => select(day)"
				>
					{{ day === null ? "" : day.format("DD") }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { useMoment } from "@Hooks"

const moment = useMoment()

export default {
	name: "CustomDatePicker",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		name: String,
		label: String,
		value: {
			type: Object,
			validator: value => moment.isMoment(value),
		},
	},
	data() {
		const date_str = ""
		const current = this.value.clone()
		const week_days = [
			...moment
				.range(moment().startOf("week"), moment().endOf("week"))
				.by("day"),
		]

		return { date_str, current, week_days }
	},
	computed: {
		date: {
			get() {
				return this.value.format("DD/MM/YYYY")
			},
			set(date_str) {
				this.date_str = date_str
			},
		},
		days() {
			const days_range = [
				...moment
					.range(
						this.current.clone().startOf("month"),
						this.current.clone().endOf("month")
					)
					.by("day"),
			]

			const days = [
				...Array(days_range[0].weekday() % 7).fill(null),
				...days_range,
			]

			return days
		},
	},
	watch: {
		date_str(value) {
			if (/\d{2}\/\d{2}\/\d{4}/.test(value)) {
				this.$emit(CUSTOM_EVENTS.UPDATE_VALUE, moment(value, "DD/MM/YYYY"))
			}
		},
	},
	methods: {
		previousMonth() {
			this.current = this.current.clone().subtract({ months: 1 })
		},
		nextMonth() {
			this.current = this.current.clone().add({ month: 1 })
		},
		select(date) {
			if (date === null) return

			this.date_str = date.format("DD/MM/YYYY")
		},
	},
	mounted() {
		this.date_str = this.date
	},
}
</script>

<style scoped>
.custom-date-picker {
	position: relative;
}

.custom-date-picker:focus .custom-date-picker__calendar,
.custom-date-picker:focus-within .custom-date-picker__calendar,
.custom-date-picker__calendar:focus,
.custom-date-picker__calendar:focus-visible {
	pointer-events: all;
	opacity: 1;
}
.custom-date-picker__calendar {
	font-size: 0.75rem;
	user-select: none;

	position: absolute;
	left: 0;
	right: 0;
	top: 100%;
	z-index: 100;

	background-color: hsl(0deg 0% 100%);
	height: min-content;

	padding: 1em;

	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 1em;

	border-bottom-left-radius: 0.75rem;
	border-bottom-right-radius: 0.75rem;
	border: solid 1px hsl(0deg 0% 0% / 0.15);

	pointer-events: none;
	opacity: 0;
}

.custom-date-picker__calendar__nav {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}
.custom-date-picker__calendar__days {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	place-content: space-between;
	gap: 0.5em;
}

.custom-date-picker__calendar__week-day {
	font-weight: bold;
	text-transform: uppercase;
}
.custom-date-picker__calendar__day,
.custom-date-picker__calendar__week-day {
	place-self: center;
	padding: 0.5em;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	isolation: isolate;
}

.custom-date-picker__calendar__day[data-selected]:not([data-no-day]) {
	border-color: var(--color-primary);
}

.custom-date-picker__calendar__day:not([data-no-day]) {
	cursor: pointer;
	border: solid 1px transparent;
}
.custom-date-picker__calendar__day:not([data-no-day]):hover::before {
	opacity: 1;
}
.custom-date-picker__calendar__day:not([data-no-day])::before {
	content: "";

	position: absolute;
	inset: 0;
	z-index: -1;

	opacity: 0;

	background-color: hsl(0deg 0% 50% / 0.25);
	border: solid 1px;
	border-color: hsl(0deg 0% 50% / 0.25);

	transition: opacity 150ms;
}
</style>
