<template>
	<div
		class="custom-input-multiple"
		:required="required"
		:class="[
			{ focus },
			{ 'has-content': _value.length !== 0 || text.length > 0 },
			{ error },
		]"
		:error-message="errorMessage"
	>
		<label v-if="label" :for="id" class="custom-input-multiple__label">
			{{ label }}
		</label>
		<div class="custom-input-multiple__container">
			<input
				:type="type"
				:id="id"
				:name="name"
				:tabindex="tabindex"
				:list="'datalist__' + name"
				autocomplete="off"
				v-model="text"
				class="custom-input-multiple__input"
				@focus="focus = true"
				@blur="focus = false"
				@keyup.enter.prevent="select"
			/>

			<datalist v-if="datalist.length > 0" :id="'datalist__' + name">
				<option v-for="(data, i) in datalist" :key="i" :value="data">
					{{ data.toLocaleUpperCase() }}
				</option>
			</datalist>

			<template v-if="text.length > 0">
				<button
					@click="select"
					class="custom-input-multiple__btn"
					style="color: green"
					title="Ajouter"
				>
					✓
				</button>
				<button
					@click="() => (text = '')"
					class="custom-input-multiple__btn"
					style="color: crimson"
					title="Effacer"
				>
					✗
				</button>
			</template>

			<div class="custom-input-multiple__values" v-if="_value.length > 0">
				<span
					class="custom-input-multiple__value"
					v-for="(val, i) in _value"
					:key="i"
					@click="unselect(val)"
				>
					{{ val }}
					<Icon icon="times" />
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { INPUT_TYPES, CUSTOM_EVENTS } from "@Constants"
import { getUuidGenerator } from "@Utils"
const uuid = getUuidGenerator("input-multiple")

export default {
	name: "CustomInputMultiple",
	model: {
		prop: "value",
		event: CUSTOM_EVENTS.UPDATE_VALUE,
	},
	props: {
		name: String,
		label: String,
		value: Array,
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
	},
	data() {
		const id = uuid.next().value
		const focus = false

		const text = ""

		return { id, focus, text }
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
		select() {
			if (this.text.length > 0) {
				if (
					!this._value.some(
						value => value.toLowerCase() === this.text.toLowerCase()
					)
				) {
					this._value.push(this.text)
				}
			}

			this.text = ""
		},
		unselect(value) {
			this._value = this._value.filter(e => e !== value)
		},
	},
}
</script>

<style scoped>
.custom-input-multiple {
	display: flex;
	flex-direction: column;
	height: min-content;
	gap: 0.25em;
	position: relative;
	color: inherit;
}
.custom-input-multiple__container {
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
.custom-input-multiple__label {
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
.custom-input-multiple:hover .custom-input-multiple__label {
	color: var(--color-accent);
}
.custom-input-multiple:hover .custom-input-multiple__container {
	border-color: var(--color-accent);
}
.custom-input-multiple.focus .custom-input-multiple__label {
	top: 0;
	color: var(--color-accent);
	transform: scale(0.75);
}
.custom-input-multiple.focus .custom-input-multiple__container {
	border-color: var(--color-accent);
	background-color: hsla(204, 100%, 2%, 0.1);
}
.custom-input-multiple.has-content .custom-input-multiple__label {
	top: 0;
	transform: scale(0.75);
}

.custom-input-multiple__container {
	display: grid;
	grid-template-columns: 1fr auto auto;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5em;
	margin-bottom: 0.5em;
}

.custom-input-multiple__values {
	grid-column: 1 / -1;
	padding: 0.5em;
	display: flex;
	gap: 0.5em;
	flex-wrap: wrap;
}

.custom-input-multiple__input {
	outline: 0;
	font-family: inherit;
	font-size: 1em;
	font-weight: normal;
	color: currentColor;
	padding: 0.5em;

	background-color: transparent;
	border: none;
}

.custom-input-multiple__btn {
	cursor: pointer;
	padding: 0 0.5em !important;
	border: none !important;
	background-color: transparent !important;
	width: min-content !important;
}

.custom-input-multiple__value {
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
.custom-input-multiple__value > :first-child {
	font-size: 0.65em;
}
</style>
