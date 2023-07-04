<template>
	<div class="side-view-selector">
		<button class="cancel" @click="hide">
			<Icon icon="times" />
		</button>
		<div
			class="selector selector-left"
			@click="() => clickHandler('left')"
			title="A gauche"
		>
			<Icon icon="side-view-left" />
		</div>
		<div
			class="selector selector-right"
			@click="() => clickHandler('right')"
			title=" A droite"
		>
			<Icon icon="side-view-right" />
		</div>
	</div>
</template>

<script>
import { mapActions } from "@Modules/vuex"
import { STORE } from "@Constants"
export default {
	name: "SideViewSelector",
	methods: {
		...mapActions({
			hide: STORE.ACTIONS.OVERLAY_HIDE,
			toLeft: STORE.ACTIONS.PROJECTS_TO_LEFT,
			toRight: STORE.ACTIONS.PROJECTS_TO_RIGHT,
		}),
		clickHandler(side) {
			if (side === "left") this.toLeft()
			else if (side === "right") this.toRight()
			this.hide()
		},
	},
}
</script>

<style scoped>
.side-view-selector {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	place-items: stretch;

	padding: 3.5em;
	position: relative;

	background-color: var(--bg-color);
}

.cancel {
	position: absolute;
	top: 1em;
	right: 1em;
	border: none;

	color: crimson !important;
	background-color: transparent !important;
}

.selector {
	font-size: 10em;
	border-radius: 0.5em;
	display: grid;
	place-content: center;
	cursor: pointer;
}

.selector-left {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}
.selector-right {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
