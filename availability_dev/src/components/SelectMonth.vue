<template>
	<transition-group tag="div" name="select-month" class="select-month">
		<span
			v-for="(m, i) in months"
			:key="m.label"
			@click="month = m"
			class="month"
			:class="[
				{ current: i === 2 },
				{ adjacent: [1, 3].includes(i) },
				{ adjacent_2: [0, 4].includes(i) }
			]"
		>
			{{ m.label }}
		</span>
	</transition-group>
</template>

<script>
export default {
	name: "SelectMonth",
	model: {
		prop: "value",
		event: "update:value"
	},
	props: {
		value: {
			type: Object,
			required: true
		}
	},
	computed: {
		month: {
			get() {
				return this.value
			},
			set(month) {
				this.$emit("update:value", month)
			}
		},
		months() {
			const current = this.$moment({
				month: this.month.value,
				year: this.month.year
			})
			const before = current.clone().subtract(1, "months")
			const before_2 = before.clone().subtract(1, "months")
			const after = current.clone().add(1, "months")
			const after_2 = after.clone().add(1, "months")

			return [
				{
					value: before_2.month(),
					year: before_2.year(),
					label: before_2.format("MMMM YYYY")
				},
				{
					value: before.month(),
					year: before.year(),
					label: before.format("MMMM YYYY")
				},
				{
					value: current.month(),
					year: current.year(),
					label: current.format("MMMM YYYY")
				},
				{
					value: after.month(),
					year: after.year(),
					label: after.format("MMMM YYYY")
				},
				{
					value: after_2.month(),
					year: after_2.year(),
					label: after_2.format("MMMM YYYY")
				}
			]
		}
	},
	methods: {
		next() {
			const current = this.$moment({
				month: this.month.value,
				year: this.month.year
			})
			const next = current.clone().add(1, "months")
			this.month = {
				value: next.month(),
				year: next.year(),
				label: next.format("MMMM YYY")
			}
		},
		previous() {
			const current = this.$moment({
				month: this.month.value,
				year: this.month.year
			})
			const previous = current.clone().subtract(1, "months")
			this.month = {
				value: previous.month(),
				year: previous.year(),
				label: previous.format("MMMM YYY")
			}
		},
		handler_wheel(e) {
			if (e.deltaY > 0) this.next()
			else this.previous()
		}
	},
	mounted() {
		document.querySelector(".select-month").onwheel = this.handler_wheel
	}
}
</script>

<style scoped>
.select-month {
	display: flex;
	justify-content: center;
	flex: 1;
	gap: 3em;
}

.month {
	transition: all 750ms;
}

.select-month-leave-active {
	position: absolute;
}

.select-month-enter,
.select-month-leave-to {
	opacity: 0;
}

.current {
	font-weight: bold;
}

.adjacent {
	cursor: pointer;
	opacity: 0.25;
}

.adjacent_2 {
	cursor: pointer;
	opacity: 0;
}
</style>
