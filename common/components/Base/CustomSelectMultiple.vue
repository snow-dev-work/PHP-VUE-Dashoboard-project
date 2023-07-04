<template>
	<div
		:id="id"
		:required="required"
		:tabindex="tabindex"
		class="custom-select-multiple"
		:class="[{ focus }, { 'has-content': _value.length !== 0 }, { error }]"
		@focus="$emit('focus', $event)"
		@blur="
			e => {
				focus = false
				$emit('blur', e)
			}
		"
	>
		<input type="checkbox" hidden v-model="focus" :id="`${id}-focus`" />
		<label
			v-if="label"
			:for="`${id}-focus`"
			class="custom-select-multiple__label"
		>
			{{ label }}
		</label>
		<label class="custom-select-multiple__values" :for="`${id}-focus`">
			<template v-if="_value.length > 0">
				<span
					v-for="(selected, i) in _value"
					class="custom-select-multiple__value"
					@click="() => unselect(selected)"
					:key="i"
				>
					{{ selected }}
					<Icon icon="times" />
				</span>
			</template>
			<template v-else>
				<span
					class="custom-select-multiple__value"
					style="background-color: transparent"
				>
					&nbsp;
				</span>
			</template>
		</label>
		<div class="custom-select-multiple__options">
			<span
				v-for="(option, i) in _options"
				class="custom-select-multiple__option"
				:key="i"
			>
				<input
					hidden
					type="checkbox"
					:name="_name"
					:value="option.value"
					:id="id + '__option__' + i"
					v-model="_value"
					class="custom-select-multiple__option__input"
				/>
				<label
					:for="id + '__option__' + i"
					v-html="option.label"
					class="custom-select-multiple__option__label"
				></label>
			</span>
		</div>
	</div>
</template>

<script>
import { CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("select-multiple")

export default {
	name: "CustomSelectMultiple",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		value: Array,
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
	},
	data() {
		const id = uuid.next().value
		const focus = false

		return { id, focus }
	},
	computed: {
		_name() {
			return this.name ?? this.id
		},
		_value: {
			get() {
				return this.value
			},
			set(value) {
				this.$emit(CUSTOM_EVENTS.UPDATE_VALUE, value)
			},
		},
		_options() {
			let options = this.options.map(option => {
				if (typeof option === "string") {
					return {
						value: option,
						label: option.toLocaleUpperCase().replace(/_/g, " "),
					}
				}

				const { value } = option
				if ("label" in option) {
					const { label } = option
					return { value, label: label.replace(/_/g, " ") }
				}

				return {
					value: value,
					label: value.toLocaleUpperCase().replace(/_/g, " "),
				}
			})

			return [...options]
		},
	},
	watch: {
		focus(focus) {
			if (!focus) {
				this.$el.blur()
			}
		},
	},
	methods: {
		unselect(selected) {
			this._value = this.value.filter(value => value !== selected)
		},
	},
}
</script>

<style scoped>
.custom-select-multiple {
	display: flex;
	flex-direction: column;
	height: min-content;
	gap: 0.25em;
	position: relative;
	outline: none;
}

.custom-select-multiple__values {
	flex: 1;
	font-size: 1em;
	font-weight: normal;
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

.custom-select-multiple__values::after {
	content: "▼";
	margin-left: auto;
	line-height: 1;
}

.custom-select-multiple__label {
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

.custom-select-multiple:hover .custom-select-multiple__label {
	color: var(--color-accent);
}

.custom-select-multiple:hover .custom-select-multiple__label {
	border-color: var(--color-accent);
}

.custom-select-multiple.focus .custom-select-multiple__label {
	top: 0;
	color: var(--color-accent);
	transform: scale(0.75);
}
.custom-select-multiple.focus .custom-select-multiple__values {
	border-color: var(--color-accent);
	background-color: hsla(204, 100%, 2%, 0.1);
}

.custom-select-multiple.has-content .custom-select-multiple__label {
	top: 0;
	transform: scale(0.75);
}

.custom-select-multiple.focus .custom-select-multiple__options {
	display: flex;
}

.custom-select-multiple.focus .custom-select-multiple__values::after {
	content: "▲";
}

.custom-select-multiple__options {
	display: none;
	flex-direction: column;
	align-items: stretch;
	position: absolute;
	z-index: 10;
	top: calc(100%);
	left: 0;
	right: 0;
	background-color: var(--bg-color);
	border: solid 1px currentColor;
	max-height: 7.5em;
	overflow-y: auto;
}

.custom-select-multiple__option:nth-child(even) {
	background-color: var(--bg-color-dark);
}

.custom-select-multiple__option__label:hover {
	background-color: var(--bg-color-dark);
}

.custom-select-multiple__option__label {
	position: relative;
}

.custom-select-multiple__option__label::before {
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

.custom-select-multiple__option__input:checked
	+ .custom-select-multiple__option__label {
	font-weight: bold;
}

.custom-select-multiple__option__input:checked
	+ .custom-select-multiple__option__label::before {
	opacity: 0.5;
}

.custom-select-multiple__option__input:checked
	+ .custom-select-multiple__option__label::after {
	content: "\002713";
	margin-left: auto;
	font-size: 0.9em;

	line-height: 1;
}

.custom-select-multiple__option__label {
	display: inline-flex;
	width: 100%;
	padding: 0.75em;
	align-items: center;
}

.custom-select-multiple__value {
	font-size: 0.75em;
	padding: 0.3em 0.75em;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	gap: 0.5em;
	background-color: var(--color-accent);
	color: var(--bg-color);
	font-weight: bold;
	border-radius: 1em;
}

.custom-select-multiple__value > :first-child {
	font-size: 0.65em;
}

.custom-select-multiple.error::after {
	content: attr(error-message);
	display: inline-block;
	position: absolute;
	font-size: 0.8em;
	bottom: -1.25em;
	right: 0;
	color: hsla(348, 83%, 47%, 0.5);
	font-weight: bold;
}

.custom-select-multiple.error .custom-select-multiple__values {
	background-color: hsla(348, 83%, 47%, 0.15);
	border-color: hsla(348, 83%, 47%, 1);
}

.custom-select-multiple.error .custom-select-multiple__label {
	color: hsla(348, 83%, 47%, 1);
}
</style>
