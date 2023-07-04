<template>
	<div
		:id="id"
		:required="required"
		:tabindex="tabindex"
		:error-message="errorMessage"
		:name="name"
		class="custom-select-input"
		:class="[{ focus }, { 'has-content': _value.length !== 0 }, { error }]"
		@focus="focus = true"
		@blur="focus = false"
	>
		<label v-if="label" :for="id" class="custom-select-input__label">
			{{ label }}
		</label>
		<div class="custom-select-input__container">
			<CustomSelect
				v-model="_type"
				:options="options"
				required
				@focus="focus = true"
				@blur="focus = false"
			/>
			<CustomInput
				v-model="_value"
				:type="type"
				@focus="focus = true"
				@blur="focus = false"
			/>
		</div>
	</div>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("select-input")

export default {
	name: "CustomSelectInput",
	components: {
		CustomSelect: () =>
			import(/* webpackChunkName: "custom-form" */ "./CustomSelect.vue"),
		CustomInput: () =>
			import(/* webpackChunkName: "custom-form" */ "./CustomInput.vue"),
	},
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		value: {
			type: Object,
			required: true,
			validator: value => {
				const keys = Object.keys(value)
				return keys.some(key => ["value", "type"].includes(key))
			},
		},
		name: String,
		label: String,
		type: {
			type: String,
			default: () => "text",
		},
		options: {
			type: Array,
			required: true,
			validator: options => {
				if (options.every(option => typeof option === "string")) {
					return true
				}

				return options.every(option => "value" in option)
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
		pattern: {
			type: RegExp,
			default: () => /.*/g,
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
				return this.value.value
			},
			set(value) {
				this.$emit(CUSTOM_EVENTS.UPDATE_VALUE, { ...this.value, value })
			},
		},
		_type: {
			get() {
				return this.value.type
			},
			set(type) {
				this.$emit(CUSTOM_EVENTS.UPDATE_VALUE, { ...this.value, type })
			},
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
		handlerClick() {},
	},
}
</script>

<style scoped>
.custom-select-input {
	display: flex;
	flex-direction: column;
	height: min-content;
	gap: 0.25em;
	position: relative;
	outline: none;
}

.custom-select-input__label {
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

.custom-select-input__label {
	top: 0;
	transform: scale(0.75);
}

.custom-select-input:hover .custom-select-input__label {
	color: var(--color-accent);
}

.custom-select-input:hover .custom-select-input__container {
	border-color: var(--color-accent);
}

.custom-select-input.focus .custom-select-input__label {
	top: 0;
	color: var(--color-accent);
	transform: scale(0.75);
}
.custom-select-input.focus .custom-select-input__container {
	border-color: var(--color-accent);
	background-color: hsla(204, 100%, 2%, 0.1);
}

.custom-select-input__container {
	display: flex;
	background-color: var(--bg-color-dark);
	border-top-right-radius: 0.5em;
	border-top-left-radius: 0.5em;
	border-bottom: solid 1px currentColor;

	transition: border-color 300ms;
}

.custom-select-input__container > * {
	flex: 1;
}

.custom-select-input.error::after {
	content: attr(error-message);
	align-self: flex-end;
	text-align: end;
	font-size: 0.8em;
	color: hsla(348, 83%, 47%, 0.5);
	font-weight: bold;
}

.custom-select-input.error .custom-select-input__container {
	background-color: hsla(348, 83%, 47%, 0.15);
	border-color: hsla(348, 83%, 47%, 1);
}
.custom-select-input.error .custom-select-input__label {
	color: hsla(348, 83%, 47%, 1);
}

.custom-select-input.error .custom-input__input {
	border-color: hsla(348, 83%, 47%, 1);
}
</style>
