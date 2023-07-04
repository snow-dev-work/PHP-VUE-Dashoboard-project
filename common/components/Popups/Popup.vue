<template>
	<div :class="[popupClass]" ref="popup" @click="handleClick">
		<Icon :icon="_icon" />
		{{ message }}
	</div>
</template>

<script>
import { mapMutations } from "@Modules/vuex"
import { POPUP_VARIANTS, POPUP_ICONS, STORE } from "@Constants"

export default {
	name: "Popup",
	props: {
		id: Number,
		message: String,
		variant: {
			type: String,
			default: () => POPUP_VARIANTS.INFO,
			validator: variant =>
				Object.values(POPUP_VARIANTS).includes(
					variant.trim().toLocaleUpperCase()
				),
		},
		action: {
			type: Function,
			default: () => null,
		},
		icon: {
			type: String,
			default: () => null,
		},
	},
	computed: {
		popupClass() {
			return `popup-${this.variant.toLocaleLowerCase()}${
				this.action !== null ? " clickable" : ""
			}`
		},
		_icon() {
			if (this.icon === null) {
				return POPUP_ICONS[this.variant]
			}

			return this.icon
		},
	},
	methods: {
		...mapMutations({
			remove: STORE.MUTATIONS.POPUPS_REMOVE,
		}),
		handleClick() {
			if (this.action !== null) {
				this.action()
			}
			this.remove({ id: this.id })
		},
	},
	mounted() {
		if (this.action === null) {
			setTimeout(() => this.remove({ id: this.id }), 7500)
		}
	},
}
</script>

<style scoped>
[class^="popup"] {
	cursor: default;
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 1em 1.5em;
	background-color: #fff;
	border-radius: 1em;
	box-shadow: 2px 2px 2em 0 rgba(0, 0, 0, 0.1);
	font-weight: bold;
	position: relative;
	left: 0;
}

[class^="popup"].clickable {
	cursor: pointer;
}

.popup-info {
	background-color: var(--color-info);
	color: #fff;
}

.popup-warning {
	background-color: var(--color-warning);
	color: #fff;
}

.popup-danger {
	background-color: var(--color-danger);
	color: #fff;
}

.slide-enter-active,
.slide-leave-active {
	opacity: 1;
	transition-property: left, opacity;
	transition-duration: 1000ms;
}

.slide-enter,
.slide-leave-to {
	left: -200%;
	opacity: 0;
}
</style>
