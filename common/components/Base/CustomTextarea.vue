<template>
	<div
		class="custom-textarea"
		:class="[{ focus }, { 'has-content': _value.length !== 0 }, { error }]"
		:error-message="errorMessage"
		:data-characters="max === -1 ? false : characters"
	>
		<label v-if="label" :for="id" class="custom-textarea__label">
			{{ label }}
		</label>
		<textarea
			:id="id"
			:name="name"
			:tabindex="tabindex"
			:required="required"
			v-model="_value"
			rows="5"
			class="custom-textarea__textarea"
			@focus="focus = true"
			@blur="focus = false"
		></textarea>
	</div>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("textarea")

export default {
	name: "CustomTextarea",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		name: String,
		label: String,
		value: String,
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
		max: {
			type: Number,
			validator: max => parseInt(max) === max,
			default: () => -1,
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
		characters() {
			return `${this._value.length} / ${this.max}`
		},
	},
	watch: {
		_value(currentValue, previousValue) {
			if (this.max > 0) {
				if (currentValue.length > this.max) this._value = previousValue
			}
		},
	},
}
</script>

<style scoped>
.custom-textarea {
	display: flex;
	flex-direction: column;
	gap: 0.25em;
	position: relative;
}

.custom-textarea__textarea {
	width: 100%;
	resize: vertical;
	outline: 0;
	flex: 1;
	font-family: inherit;
	font-size: 1em;
	font-weight: normal;
	color: currentColor;
	border: none;
	border-bottom: solid 1px currentColor;
	padding: 0.5em;

	background-color: var(--bg-color-dark);
	border-top-left-radius: 0.5em;
	border-top-right-radius: 0.5em;

	transition-property: color, border-color, background-color;
	transition-duration: 300ms;
}

.custom-textarea__label {
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

.custom-textarea:hover .custom-textarea__label {
	color: var(--color-accent);
}

.custom-textarea:hover .custom-textarea__textarea {
	border-color: var(--color-accent);
}

.custom-textarea.focus .custom-textarea__label {
	top: 0;
	color: var(--color-accent);
	transform: scale(0.75);
}

.custom-textarea.focus .custom-textarea__textarea {
	border-color: var(--color-accent);
	background-color: hsla(204, 100%, 2%, 0.1);
}

.custom-textarea.has-content .custom-textarea__label {
	top: 0;
	transform: scale(0.75);
}

.custom-textarea.disabled {
	pointer-events: none;
	opacity: 0.5;
}

.custom-textarea[data-characters]::after {
	content: attr(data-characters);
	display: block;
	position: absolute;
	top: 100%;
	right: 0;
}
</style>
