<template>
	<div class="overlay">
		<component :is="component" />
	</div>
</template>

<script>
import { STORE } from "@Constants"

export default {
	name: "Overlay",
	computed: {
		component() {
			return this.$store.getters[STORE.GETTERS.OVERLAY_COMPONENT]
		},
	},
}
</script>

<style>
.overlay {
	position: fixed;
	display: flex;
	inset: 0;
	z-index: 900;
	background-color: rgba(0, 0, 0, 0.5);
}

.overlay > *:not(.loader) {
	margin: auto;
	width: 100vw;
	max-width: 800px;
	max-height: 80vh;
	padding: 2em;
	background-color: #fff;
	border-radius: 1em;
	color: var(--txt-color);
	font-size: 1em;
}

.overlay h3 {
	font-size: 1.5em;
	color: var(--color-secondary);
	font-weight: bold;
	text-transform: capitalize;
}

.overlay h4 {
	font-weight: 300;
	font-size: 1.15em;
}

.overlay header {
	grid-column: 1 / -1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.overlay-enter-active,
.overlay-leave-active {
	transition: opacity 1s;
}

.overlay-enter,
.overlay-leave-to {
	opacity: 0;
}

@media screen and (max-width: 800px) {
	.overlay > :not(.loader) {
		height: 100vh;
		max-height: 100vh;
		padding: 1em;
		border-radius: 0;
		margin: 0;
	}
}
</style>
