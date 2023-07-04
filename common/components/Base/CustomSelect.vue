<template>
	<div
		:id="id"
		:required="required"
		:tabindex="tabindex"
		class="custom-select"
		:class="[
			{ focus },
			{ 'has-content': _value.length !== 0 },
			{ error },
			{ disabled },
		]"
		@focus="$emit('focus', $event)"
		@blur="handlerBlur"
	>
		<input type="checkbox" hidden v-model="focus" :id="`${id}-focus`" />
		<label v-if="label" :for="`${id}-focus`" class="custom-select__label">
			{{ label }}
		</label>
		<label
			class="custom-select__value"
			:for="`${id}-focus`"
			v-html="_label"
		></label>
		<div class="custom-select__options">
			<span
				v-for="(option, i) in _options"
				class="custom-select__option"
				:key="i"
			>
				<input
					hidden
					type="radio"
					:name="_name"
					:value="option.value"
					:id="id + '__option__' + i"
					v-model="_value"
					class="custom-select__option__input"
				/>
				<label
					:for="id + '__option__' + i"
					v-html="option.label"
					class="custom-select__option__label"
				></label>
			</span>
		</div>
	</div>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("select")

export default {
	name: "CustomSelect",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		value: String,
		name: String,
		label: String,
		options: {
			type: Array,
			required: true,
			validator: options => {
				if (options.every(option => typeof option === "string")) {
					return true
				}

				for (const option of options) {
					const keys = Object.keys(option)
					if (!keys.includes("value")) {
						return false
					}
				}

				return true
			},
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

		return { id, focus }
	},
	computed: {
		_value: {
			get() {
				return this.value
			},
			set(value) {
				this.$emit(CUSTOM_EVENTS.UPDATE_VALUE, value)
			},
		},
		_name() {
			return this.name ?? this.id
		},
		_label() {
			return (
				this._options.find(option => option.value === this.value).label ??
				"&nbsp;"
			)
		},
		_options() {
			let options = this.options.map(option => {
				if (typeof option === "string") {
					return {
						value: option,
						label: option.toLocaleUpperCase(),
					}
				}

				const { value } = option
				if ("label" in option) {
					const { label } = option
					return { value, label }
				}

				return {
					value: value,
					label: value.toLocaleUpperCase(),
				}
			})

			if (this.required) {
				return options
			}

			return [{ value: "", label: "&nbsp;" }, ...options]
		},
	},
	watch: {
		value(current, old) {
			if (current !== old) {
				this.focus = false
			}
		},
		focus(focus) {
			if (!focus) {
				this.$el.blur()
			}
		},
	},
	methods: {
		handlerBlur() {
			this.focus = false
			this.$emit("blur")
		},
	},
}
</script>

<style scoped>
.custom-select {
	display: flex;
	flex-direction: column;
	height: min-content;
	gap: 0.25em;
	position: relative;
	outline: none;
}

.custom-select__value {
	flex: 1;
	font-size: 1em;
	font-weight: normal;
	text-transform: uppercase;
	color: currentColor;
	border: none;
	border-bottom: solid 1px currentColor;
	padding: 0.5em;

	display: flex;
	flex-wrap: wrap;
	gap: 0.5em;

	background-color: var(--bg-color-dark);
	border-top-left-radius: 0.75em;
	border-top-right-radius: 0.75em;

	transition-property: background-color, border-color;
	transition-duration: 300ms;
}

.custom-select__value::after {
	content: "▼";
	margin-left: auto;
	line-height: 1;
}

.custom-select__label {
	text-transform: uppercase;
	font-weight: bold;
	font-size: 1em;

	position: relative;
	top: 1.9em;

	transform-origin: left center;
	transform: scale(1);

	line-height: 1;
	padding-left: 0.5em;

	display: flex;
	align-items: center;
	gap: 0.25em;

	transition-property: transform, color, top;
	transition-duration: 300ms;
}

.custom-select:hover .custom-select__label {
	color: var(--color-accent);
}

.custom-select:hover .custom-select__value {
	border-color: var(--color-accent);
}

.custom-select.focus .custom-select__label {
	top: 0;
	color: var(--color-accent);
	transform: scale(0.75);
}
.custom-select.focus .custom-select__value {
	border-color: var(--color-accent);
	background-color: hsla(204, 100%, 2%, 0.1);
}

.custom-select.has-content .custom-select__label {
	top: 0;
	transform: scale(0.75);
}

.custom-select.focus .custom-select__options {
	opacity: 1;
	pointer-events: all;
}

.custom-select.focus .custom-select__value::after {
	content: "▲";
}

.custom-select__options {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	position: absolute;
	z-index: 10;
	top: calc(100%);
	left: 0;
	right: 0;
	background-color: var(--bg-color);
	border: solid 1px currentColor;
	max-height: 8.5em;
	overflow-y: auto;
	opacity: 0;
	pointer-events: none;
}

.custom-select__option:nth-child(even) {
	background-color: var(--bg-color-dark);
}

.custom-select__option__label:hover {
	background-color: var(--bg-color-dark);
}

.custom-select__option__label {
	position: relative;
}

.custom-select__option__label::before {
	content: "";
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: var(--color-accent);
	opacity: 0;
	z-index: -1;
}

.custom-select__option__input:checked + .custom-select__option__label {
	font-weight: bold;
}

.custom-select__option__input:checked + .custom-select__option__label::before {
	opacity: 0.5;
}

.custom-select__option__input:checked + .custom-select__option__label::after {
	content: "\002713";
	margin-left: auto;
	font-size: 0.9em;

	line-height: 1;
}

.custom-select__option__label {
	display: inline-flex;
	width: 100%;
	padding: 0.75em;
	align-items: center;
}

.custom-select.error::after {
	content: attr(error-message);
	display: inline-block;
	position: absolute;
	font-size: 0.8em;
	bottom: -1.25em;
	right: 0;
	color: hsla(348, 83%, 47%, 0.5);
	font-weight: bold;
}

.custom-select.error .custom-select__value {
	background-color: hsla(348, 83%, 47%, 0.15);
	border-color: hsla(348, 83%, 47%, 1);
}
.custom-select.error .custom-select__label {
	color: hsla(348, 83%, 47%, 1);
}

.custom-select.disabled {
	pointer-events: none;
	opacity: 0.5;
}

.custom-select-input__container .custom-select__value,
.custom-select-input__container .custom-select.focus .custom-select__value {
	background-color: transparent;
	border-bottom: none;
}
</style>
