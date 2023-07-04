<template>
	<button id="button-to-top" :style="[btnStyle]" @click="toTop">
		<Icon icon="arrow-up" />
	</button>
</template>

<script>
export default {
	name: "ButtonToTop",
	props: {
		scroll: {
			type: Boolean,
			default: () => false
		}
	},
	computed: {
		btnStyle() {
			if (this.scroll) {
				return { opacity: "0.6" }
			}

			return {
				"pointer-events": "none",
				opacity: "0"
			}
		}
	},
	methods: {
		toTop() {
			window.scroll({ top: 0, behavior: "smooth" })
		}
	}
}
</script>

<style scoped>
#button-to-top {
	position: fixed;
	bottom: 0.5em;
	right: 0.5em;
	z-index: 100;
	font-size: 3em;
	border: none;
	padding: 0;
	background-color: var(--txt-color);
	color: var(--bg-color);

	transition: opacity 150ms;
}
</style>
