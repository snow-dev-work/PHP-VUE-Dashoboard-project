<template>
	<transition-group tag="div" name="slide" :class="['container__popups']">
		<Popup v-for="popup in popups" :key="popup.id" v-bind="popup" />
	</transition-group>
</template>

<script>
import { mapState } from "@Modules/vuex"
import Popup from "./Popup.vue"

export default {
	name: "Popups",
	components: { Popup },
	computed: {
		...mapState({
			popups: ({ popups }) => popups.list,
		}),
	},
}
</script>

<style scoped>
.container__popups {
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-start;
	position: fixed;
	z-index: 1000;
	padding: 1em;
	gap: 1em;
}
</style>
