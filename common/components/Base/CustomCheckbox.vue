<template>
	<label
		class="custom-checkbox"
		:for="id"
		:required="required"
		:class="[{ focus }, { checked: _value }, { error }]"
		:error-message="errorMessage"
		:tabindex="tabindex"
	>
		<span v-if="label" class="custom-checkbox__label">{{ label }}</span>
		<input
			hidden
			type="checkbox"
			:id="id"
			:name="name"
			v-model="_value"
			class="custom-checkbox__input"
			@focus="focus = true"
			@blur="focus = false"
		/>
	</label>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("checkbox")

export default {
	name: "CustomCheckbox",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		value: Boolean,
		name: String,
		label: String,
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
	},
}
</script>

<style scoped>
.custom-checkbox {
	display: flex;
	align-items: center;
	gap: 0.5em;
	position: relative;
	color: currentColor;
	font-size: 1em;
	width: min-content;
}

.custom-checkbox__label {
	position: relative;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5em;
	line-height: 1;
	text-transform: uppercase;
	font-weight: bold;
}

.custom-checkbox__label::before {
	content: "";
	display: inline-block;
	box-sizing: border-box;
	border: solid 2px;
	border-color: var(--bg-color-dark);
	border-radius: 2px;
	width: 1em;
	height: 1em;

	transition-property: border-color, background-color;
	transition-duration: 200ms;
}
.custom-checkbox__label::after {
	content: "\002714";
	color: #fff;
	position: absolute;
	left: 0.15em;
	line-height: 1;
	font-size: 0.85em;
}
.custom-checkbox.checked .custom-checkbox__input {
	background-color: var(--color-accent);
}
.custom-checkbox.checked .custom-checkbox__label::before {
	border-color: var(--color-accent);
	background-color: var(--color-accent);
}

.custom-checkbox:hover .custom-checkbox__input {
	opacity: 0.04;
}
</style>
