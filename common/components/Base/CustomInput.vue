<template>
	<div
		class="custom-input"
		:required="required"
		:class="[
			{ focus },
			{ 'has-content': _value.length !== 0 },
			{ error },
			{ disabled },
		]"
		:error-message="errorMessage"
	>
		<label v-if="label" :for="id" class="custom-input__label">
			{{ label }}
		</label>
		<input
			:type="type"
			:id="id"
			:name="name"
			:tabindex="tabindex"
			:disabled="disabled"
			:list="'datalist__' + name"
			:pattern="pattern.source"
			autocomplete="off"
			v-model="_value"
			class="custom-input__input"
			@focus="handlerFocus"
			@blur="handlerBlur"
		/>

		<datalist v-if="datalist.length > 0" :id="'datalist__' + name">
			<option v-for="(data, i) in datalist" :key="i" :value="data">
				{{ data }}
			</option>
		</datalist>
	</div>
</template>

<script>
import { INPUT_TYPES, CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("input")

export default {
	name: "CustomInput",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		name: String,
		label: String,
		value: String,
		type: {
			type: String,
			default: () => "text",
			validator: type => Object.values(INPUT_TYPES).includes(type),
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
		datalist: {
			type: Array,
			default: () => [],
			validator: datalist => {
				if (datalist.length === 0) {
					return true
				}

				return datalist.every(data => typeof data === "string")
			},
		},
		pattern: {
			type: RegExp,
			default: () => /.*/g,
		},
	},
	data() {
		const { value: id } = uuid.next()
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
	},
	methods: {
		handlerFocus() {
			this.focus = true
			this.$emit("focus")
		},
		handlerBlur() {
			this.focus = false
			this.$emit("blur")
		},
	},
}
</script>

<style scoped>
.custom-input {
	display: flex;
	flex-direction: column;
	height: min-content;
	gap: 0.25em;
	position: relative;
	color: inherit;
}

.custom-input__input {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;

	outline: 0;
	padding: 0.5em;
}

.custom-input__input {
	flex: 1;
	font-size: 1em;
	font-weight: normal;
	font-family: inherit;
	color: currentColor;
	border: none;
	border-bottom: solid 1px currentColor;

	background-color: var(--bg-color-dark);
	border-top-left-radius: 0.75em;
	border-top-right-radius: 0.75em;

	transition-property: background-color, border-color;
	transition-duration: 300ms;
}

.custom-input__label {
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

.custom-input:hover .custom-input__label {
	color: var(--color-accent);
}

.custom-input:hover .custom-input__input {
	border-color: var(--color-accent);
}

.custom-input.focus .custom-input__label {
	top: 0;
	color: var(--color-accent);
	transform: scale(0.75);
}
.custom-input.focus .custom-input__input {
	border-color: var(--color-accent);
	background-color: hsla(204, 100%, 2%, 0.1);
}

.custom-input.has-content .custom-input__label {
	top: 0;
	transform: scale(0.75);
}

.custom-input.error::after {
	content: attr(error-message);
	align-self: flex-end;
	font-size: 0.8em;
	color: hsla(348, 83%, 47%, 0.5);
	font-weight: bold;
}

.custom-input.error .custom-input__input {
	background-color: hsla(348, 83%, 47%, 0.15);
	border-color: hsla(348, 83%, 47%, 1);
}
.custom-input.error .custom-input__label {
	color: hsla(348, 83%, 47%, 1);
}

.custom-input.disabled {
	pointer-events: none;
	opacity: 0.5;
}

.custom-select-input__container .custom-input__input,
.custom-select-input__container .custom-input.focus .custom-input__input {
	background-color: transparent;
	border-bottom: none;
}

.custom-select-input__container .custom-input__input {
	border-left: solid 1px currentColor;
	border-top-left-radius: 0;
}
</style>
