<template>
	<div
		:tabindex="tabindex"
		:class="[`custom-range`, { focus }, { error }, { disabled }]"
		:style="rangeStyle"
		@focus="focus = true"
		@blur="focus = false"
		:disabled="disabled"
	>
		<label :for="id" class="custom-range__label" :unity="unity">
			{{ label }}
			<input
				:id="id"
				type="text"
				:aria-min="minmax.min"
				:aria-max="minmax.max"
				pattern="[0-9]{1,3}"
				class="custom-range__value"
				v-model.number="_value"
			/>
		</label>
		<div
			class="custom-range__container"
			ref="custom-range__container"
			@click="handlerClick"
		>
			<span
				class="custom-range__button"
				@mousedown="startMove"
				@touchstart="startMove"
				:class="{ move }"
				:style="cursorStyle"
			></span>
		</div>
	</div>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("range")

export default {
	name: "CustomRange",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		value: Number,
		name: String,
		label: String,
		min: {
			type: Number,
			default: () => 0,
		},
		max: {
			type: Number,
			default: () => 100,
		},
		unity: {
			type: String,
			default: () => "",
		},
		required: {
			type: Boolean,
			default: () => false,
		},
		error: {
			type: Boolean,
			default: () => false,
		},
		errorMessage: {
			type: String,
			default: () => "Saisie erronée",
		},
		tabindex: {
			type: String,
			default: () => "0",
			validator: tabindex => /^\d+$/.test(tabindex),
		},
		disabled: {
			type: Boolean,
			default: () => false,
		},
	},
	data() {
		const id = uuid.next().value
		const focus = false
		const move = false

		return { id, focus, move }
	},
	computed: {
		_value: {
			get() {
				return this.value
			},
			set(value) {
				let _value = value
				if (typeof value === "string") {
					_value = 0
				}
				if (value > 100) {
					_value = 100
				}
				if (value < 0) {
					_value = 0
				}

				this.$emit(CUSTOM_EVENTS.UPDATE_VALUE, _value)
			},
		},
		minmax() {
			if (this.min > this.max) {
				return {
					min: this.max,
					max: this.min,
				}
			}

			return {
				min: this.min,
				max: this.max,
			}
		},
		rangeStyle() {
			return {
				"--value": this._value + "%",
			}
		},
		cursorStyle() {
			return {
				left: `calc(${this._value}% - 1.5em)`,
			}
		},
		customRangeContainer() {
			return this.$refs["custom-range__container"]
		},
	},
	methods: {
		startMove() {
			this.move = true
		},
		stopMove() {
			this.move = false
		},
		getPercentage(clientX) {
			const { min, max } = this.minmax
			const { left, width } = this.customRangeContainer.getBoundingClientRect()
			const CURSOR_POSITION = clientX - left
			const PERCENTAGE = parseInt((CURSOR_POSITION / width) * 100)

			if (PERCENTAGE > max) {
				return max
			}

			if (PERCENTAGE < min) {
				return min
			}

			return PERCENTAGE
		},
		setValue(e) {
			if (this.move) {
				this._value = this.getPercentage(e.clientX)
			}
		},
		handlerClick(e) {
			this.move = true
			this.setValue(e)
			this.move = false
		},
		handlerMove(e) {
			e.preventDefault()
			const [{ clientX }] = e.changedTouches
			this.setValue({ clientX })
		},
	},
	mounted() {
		window.addEventListener("mouseup", this.stopMove)
		window.addEventListener("mousemove", this.setValue)
		window.addEventListener("touchend", this.stopMove)
		window.addEventListener("touchmove", this.handlerMove)
	},
	beforeDestroy() {
		window.removeEventListener("mouseup", this.stopMove)
		window.removeEventListener("mousemove", this.setValue)
		window.removeEventListener("touchend", this.stopMove)
		window.removeEventListener("touchmove", this.handlerMove)
	},
}
</script>

<style scoped>
.custom-range {
	--value: 0;
	outline: none;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 0.5em;
}

.custom-range__label {
	display: flex;
	align-items: center;
	text-transform: uppercase;
	font-weight: bold;
}
.custom-range__label::after {
	content: attr(unity);
}

.custom-range__value {
	margin-left: auto;
	outline: 0;
	font-family: inherit;
	font-size: 1em;
	font-weight: normal;
	color: currentColor;
	border: none;
	padding: 0.5em;
	width: 10ex;
	text-align: right;

	transition: all 300ms;
}

.custom-range__container {
	height: 0.75em;
	width: 100%;
	margin: 0.5em 0;
	background-color: var(--bg-color-dark);
	border-radius: 1em;
	display: flex;
	align-items: center;
	position: relative;
}

.custom-range__container::before {
	content: "";
	display: inline-block;
	background-color: var(--color-accent);
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: var(--value);

	border-radius: inherit;
}

.custom-range__button {
	box-sizing: content-box;
	background-color: hsla(45, 5%, 85%, 1);
	background-clip: content-box;
	height: 1.5em;
	width: 1.5em;
	border-radius: 50%;
	border: solid 0.75em hsla(45, 100%, 70%, 0);
	position: absolute;
	left: -0.75em;
	z-index: 2;

	transition-property: border-color, background-color;
	transition-duration: 300ms;
}

.custom-range__button:hover {
	border-color: hsla(45, 100%, 70%, 0.25);
	background-color: hsla(45, 25%, 75%, 1);
}

.custom-range__button.move {
	background-color: var(--color-accent);
	border-color: hsla(45, 100%, 70%, 0.5);
}
</style>
